/**
 * api/tracking.js — Server-side Tracking Proxy
 * Vercel Serverless Function (Node.js ESM)
 *
 * Nhận event từ browser (sendBeacon), hash PII, forward lên:
 *   - Meta Conversions API v19.0
 *   - TikTok Events API v1.3
 *   - GA4 Measurement Protocol v2
 *
 * Env vars required (xem .env.example):
 *   META_PIXEL_ID, META_ACCESS_TOKEN, META_TEST_EVENT_CODE (optional)
 *   TIKTOK_PIXEL_ID, TIKTOK_ACCESS_TOKEN
 *   GA4_MEASUREMENT_ID, GA4_API_SECRET
 */

import crypto from 'crypto';

function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256')
    .update(String(value).trim().toLowerCase())
    .digest('hex');
}

function normalizePhone(phone) {
  if (!phone) return undefined;
  var cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = '84' + cleaned.slice(1);
  return cleaned;
}

async function fireMetaCAPI(event, data, req) {
  var pixelId = process.env.META_PIXEL_ID;
  var token = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !token) return;

  var payload = {
    data: [{
      event_name: event,
      event_time: Math.floor(Date.now() / 1000),
      event_id: data.event_id,
      action_source: 'website',
      event_source_url: data.page_url,
      user_data: {
        em: data.email ? [sha256(data.email)] : undefined,
        ph: data.phone ? [sha256(normalizePhone(data.phone))] : undefined,
        client_ip_address: data.ip || req.headers['x-forwarded-for'] || '0.0.0.0',
        client_user_agent: data.user_agent || req.headers['user-agent'] || ''
      },
      custom_data: data.value ? {
        value: data.value,
        currency: data.currency || 'VND',
        order_id: data.order_id
      } : undefined
    }],
    access_token: token
  };

  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  var resp = await fetch(
    `https://graph.facebook.com/v19.0/${pixelId}/events`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
  );
  if (!resp.ok) {
    var err = await resp.text();
    console.error('[Tracking] Meta CAPI error:', err);
  }
}

async function fireTikTokEvents(event, data, req) {
  var pixelId = process.env.TIKTOK_PIXEL_ID;
  var token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!pixelId || !token) return;

  var ttqEventMap = {
    'Lead': 'SubmitForm',
    'InitiateCheckout': 'InitiateCheckout',
    'Purchase': 'CompletePayment',
    'PageView': 'PageView',
    'ViewContent': 'ViewContent'
  };
  var ttqEvent = ttqEventMap[event] || event;

  var payload = {
    pixel_code: pixelId,
    event: ttqEvent,
    timestamp: new Date().toISOString(),
    event_id: data.event_id,
    context: {
      page: { url: data.page_url },
      user: {
        email: data.email ? sha256(data.email) : undefined,
        phone_number: data.phone ? sha256(normalizePhone(data.phone)) : undefined
      },
      ip: data.ip || req.headers['x-forwarded-for'] || '0.0.0.0',
      user_agent: data.user_agent || req.headers['user-agent'] || ''
    },
    properties: data.value ? {
      value: data.value,
      currency: data.currency || 'VND'
    } : undefined
  };

  var resp = await fetch(
    'https://business-api.tiktok.com/open_api/v1.3/pixel/track/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Token': token },
      body: JSON.stringify(payload)
    }
  );
  if (!resp.ok) {
    var err = await resp.text();
    console.error('[Tracking] TikTok Events API error:', err);
  }
}

async function fireGA4MP(event, data) {
  var measurementId = process.env.GA4_MEASUREMENT_ID;
  var apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return;

  var ga4EventMap = {
    'Lead': 'generate_lead',
    'InitiateCheckout': 'begin_checkout',
    'Purchase': 'purchase',
    'PageView': 'page_view',
    'ViewContent': 'view_item'
  };
  var ga4Event = ga4EventMap[event] || event;

  var eventParams = {};
  if (data.value) {
    eventParams.currency = data.currency || 'VND';
    eventParams.value = data.value;
  }
  if (data.order_id && event === 'Purchase') {
    eventParams.transaction_id = data.order_id;
  }

  var payload = {
    client_id: data.event_id,
    events: [{ name: ga4Event, params: eventParams }]
  };

  var url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
  var resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (resp.status !== 204 && !resp.ok) {
    console.error('[Tracking] GA4 MP error:', resp.status);
  }
}

export async function fireServerPurchase(data) {
  await Promise.allSettled([
    fireMetaCAPI('Purchase', data, { headers: {} }),
    fireTikTokEvents('Purchase', data, { headers: {} }),
    fireGA4MP('Purchase', data)
  ]);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    var { event, data } = body;

    if (!event || !data) {
      return res.status(400).json({ error: 'Missing event or data' });
    }

    await Promise.allSettled([
      fireMetaCAPI(event, data, req),
      fireTikTokEvents(event, data, req),
      fireGA4MP(event, data)
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Tracking] Handler error:', err.message);
    return res.status(200).json({ ok: false });
  }
}
