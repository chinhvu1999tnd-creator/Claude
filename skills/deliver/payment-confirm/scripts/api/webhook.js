// Vercel serverless function — deploy to Vercel as /api/webhook
// SePay calls this URL when a bank transfer is detected

import crypto from 'crypto';
import { verifySignature } from '../lib/verify.js';
import { matchOrder } from '../lib/matcher.js';
import { notifyConfirmed } from '../lib/notify.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Get raw body for HMAC verification
  const rawBody = JSON.stringify(req.body);
  const signature = req.headers['x-webhook-signature'] || req.headers['checksum'] || '';

  // 2. Verify HMAC signature
  const isValid = verifySignature(rawBody, signature, process.env.SEPAY_WEBHOOK_SECRET);
  if (!isValid) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ success: false, error: 'Invalid signature' });
  }

  const payload = req.body;

  // 3. Only process incoming transfers
  if (payload.transferType !== 'in') {
    return res.status(200).json({ success: true, message: 'Skipped: not incoming transfer' });
  }

  // 4. Match to order
  try {
    const result = await matchOrder(payload);

    if (result.matched) {
      // 5. Notify + trigger delivery
      await notifyConfirmed(result.order, payload);
      console.log(`Order confirmed: ${result.order.order_id}`);
      return res.status(200).json({ success: true, order_id: result.order.order_id });
    } else {
      console.warn('No order matched:', result.reason);
      return res.status(200).json({ success: true, message: result.reason });
    }
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    // Still return 200 to prevent SePay retry storm
    return res.status(200).json({ success: true, error: 'Processing failed, logged' });
  }
}
