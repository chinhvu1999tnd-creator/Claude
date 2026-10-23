#!/usr/bin/env node
/**
 * setup-brevo.js — Automated Brevo integration setup
 *
 * Chạy: node skills/integrations/brevo/scripts/setup-brevo.js
 *
 * Tự động:
 *   1. Detect scenario (Customer Portal hay không)
 *   2. Verify API key
 *   3. Tạo 3 contact lists: Leads / Customers / Re-engagement
 *   4. Tạo contact attributes
 *   5. Ghi list IDs vào .env
 *   6. Gửi test email
 *   7. Copy brevo.js vào funnel output
 *   8. Print patch instructions
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const ROOT     = path.resolve(__dirname, '../../../../..');
const ENV_PATH = path.join(ROOT, '.env');

// ── Colors ───────────────────────────────────────────────────────────────────
const G = s => `\x1b[32m${s}\x1b[0m`;
const R = s => `\x1b[31m${s}\x1b[0m`;
const Y = s => `\x1b[33m${s}\x1b[0m`;
const B = s => `\x1b[1m${s}\x1b[0m`;
const C = s => `\x1b[36m${s}\x1b[0m`;

// ── .env helpers ─────────────────────────────────────────────────────────────
function loadEnv(p) {
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(
    fs.readFileSync(p, 'utf8').split('\n')
      .filter(l => l.includes('=') && !l.startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
  );
}

function writeEnvKey(envPath, key, value) {
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const line  = `${key}=${value}`;
  content = regex.test(content) ? content.replace(regex, line) : content + (content.endsWith('\n') ? '' : '\n') + line + '\n';
  fs.writeFileSync(envPath, content);
}

// ── Brevo API helper ──────────────────────────────────────────────────────────
function brevoReq({ method, path: p, body, apiKey }) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'api.brevo.com', port: 443, path: p, method,
      headers: {
        'api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(opts, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : {} }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// ── Ensure or create list ────────────────────────────────────────────────────
async function ensureList(apiKey, name) {
  const lists = await brevoReq({ method: 'GET', path: '/v3/contacts/lists?limit=50', apiKey });
  const found = lists.body?.lists?.find(l => l.name === name);
  if (found) return found.id;
  const r = await brevoReq({ method: 'POST', path: '/v3/contacts/lists', apiKey, body: { name, folderId: 1 } });
  if (r.status === 201) return r.body.id;
  throw new Error(`Cannot create list "${name}": ${JSON.stringify(r.body)}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + B('🚀 Brevo Integration Setup') + '\n');

  const env = loadEnv(ENV_PATH);
  const API_KEY      = env.BREVO_API_KEY;
  const SENDER_EMAIL = env.BREVO_SENDER_EMAIL;
  const PORTAL_URL   = env.CUSTOMER_PORTAL_URL;

  // ── Preflight checks ───────────────────────────────────────────────────────
  if (!API_KEY || API_KEY.includes('xxx')) {
    console.log(R('✗ BREVO_API_KEY chưa có hoặc là placeholder'));
    console.log(Y('  → brevo.com → Settings → API Keys → Generate\n  → .env: BREVO_API_KEY=xkeysib-...\n'));
    process.exit(1);
  }
  if (!SENDER_EMAIL) {
    console.log(R('✗ BREVO_SENDER_EMAIL chưa có trong .env\n'));
    process.exit(1);
  }

  // ── Detect scenario ────────────────────────────────────────────────────────
  const scenario = PORTAL_URL ? 'A' : 'B';
  console.log(B(`Scenario: ${scenario}`) + (scenario === 'A'
    ? ` — Customer Portal detected (${PORTAL_URL})`
    : ' — No Customer Portal (direct delivery mode)') + '\n');

  // ── Step 1: Verify API key ─────────────────────────────────────────────────
  process.stdout.write('Verifying API key... ');
  const acct = await brevoReq({ method: 'GET', path: '/v3/account', apiKey: API_KEY });
  if (acct.status !== 200) { console.log(R('✗ API key không hợp lệ\n')); process.exit(1); }
  console.log(G(`✓ ${acct.body.email} (${acct.body.plan?.[0]?.type || 'free'})`));

  // ── Step 2: Create 3 lists ─────────────────────────────────────────────────
  const LISTS = [
    { name: 'Leads',           envKey: 'BREVO_LIST_ID_LEADS'         },
    { name: 'Customers',       envKey: 'BREVO_LIST_ID_CUSTOMERS'     },
    { name: 'Re-engagement',   envKey: 'BREVO_LIST_ID_REENGAGEMENT'  },
    { name: 'Abandoned Cart',  envKey: 'BREVO_LIST_ID_ABANDONED'     },
  ];

  console.log('\nCreating contact lists:');
  const listIds = {};
  for (const list of LISTS) {
    process.stdout.write(`  "${list.name}"... `);
    if (env[list.envKey]) {
      listIds[list.envKey] = parseInt(env[list.envKey]);
      console.log(G(`✓ Already exists (ID: ${env[list.envKey]})`));
    } else {
      const id = await ensureList(API_KEY, list.name);
      listIds[list.envKey] = id;
      writeEnvKey(ENV_PATH, list.envKey, id);
      console.log(G(`✓ Created (ID: ${id})`));
    }
  }

  // ── Step 3: Create contact attributes ─────────────────────────────────────
  process.stdout.write('\nCreating contact attributes... ');
  const ATTRS = [
    { name: 'FIRSTNAME',     category: 'normal', type: 'text' },
    { name: 'PRODUCT',       category: 'normal', type: 'text' },
    { name: 'PURCHASE_DATE', category: 'normal', type: 'date' },
    { name: 'SOURCE',        category: 'normal', type: 'text' },
  ];
  let ok = 0;
  for (const a of ATTRS) {
    const r = await brevoReq({
      method: 'POST',
      path: `/v3/contacts/attributes/${a.category}/${a.name}`,
      apiKey: API_KEY,
      body: { type: a.type },
    });
    if (r.status === 201 || r.status === 400) ok++; // 400 = already exists
  }
  console.log(G(`✓ ${ok}/${ATTRS.length} attributes ready`));

  // ── Step 4: Send test email ────────────────────────────────────────────────
  process.stdout.write(`\nSending test email to ${SENDER_EMAIL}... `);
  const testResult = await brevoReq({
    method: 'POST', path: '/v3/smtp/email', apiKey: API_KEY,
    body: {
      sender:      { name: env.BREVO_SENDER_NAME || 'AI Agent Kit', email: SENDER_EMAIL },
      to:          [{ email: SENDER_EMAIL }],
      subject:     '✅ Brevo setup thành công — AI Agent Kit',
      htmlContent: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px">
          <h2 style="color:#141413">✅ Brevo đã kết nối thành công!</h2>
          <p>Scenario: <strong>${scenario === 'A' ? 'A — Có Customer Portal' : 'B — Direct delivery'}</strong></p>
          <p>Lists đã tạo:</p>
          <ul>
            <li>Leads (ID: ${listIds['BREVO_LIST_ID_LEADS']})</li>
            <li>Customers (ID: ${listIds['BREVO_LIST_ID_CUSTOMERS']})</li>
            <li>Re-engagement (ID: ${listIds['BREVO_LIST_ID_REENGAGEMENT']})</li>
            <li>Abandoned Cart (ID: ${listIds['BREVO_LIST_ID_ABANDONED']})</li>
          </ul>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
          <p style="color:#888;font-size:13px">AI Agent Business Kit</p>
        </div>`,
    },
  });
  console.log(testResult.status === 201 ? G('✓ Check inbox') : Y(`⚠ ${testResult.status} — tiếp tục`));

  // ── Step 5: Copy brevo.js to funnel output ─────────────────────────────────
  await deployBrevoModule();

  // ── Step 6: Print patch instructions ──────────────────────────────────────
  printPatchInstructions(scenario, listIds);
}

// ── Deploy brevo.js ──────────────────────────────────────────────────────────
async function deployBrevoModule() {
  process.stdout.write('\nDeploying api/brevo.js to funnel outputs... ');
  const src = path.join(__dirname, 'brevo.js');
  const salesDir = path.join(ROOT, 'output/funnel/sales');
  let count = 0;

  if (fs.existsSync(salesDir)) {
    for (const slug of fs.readdirSync(salesDir)) {
      const apiDir = path.join(salesDir, slug, 'api');
      if (fs.existsSync(apiDir)) {
        fs.copyFileSync(src, path.join(apiDir, 'brevo.js'));
        count++;
      }
    }
  }

  // Also place in a shared location
  const sharedDir = path.join(ROOT, 'output/funnel');
  if (fs.existsSync(sharedDir)) {
    fs.copyFileSync(src, path.join(sharedDir, 'brevo.js'));
  }

  console.log(G(`✓ Deployed to ${count} funnel(s)`));
}

// ── Print patch instructions ──────────────────────────────────────────────────
function printPatchInstructions(scenario, listIds) {
  console.log('\n' + B('─────────────────────────────────────'));
  console.log(B('📋 Patch Instructions') + ` (Scenario ${scenario})`);
  console.log(B('─────────────────────────────────────'));

  if (scenario === 'A') {
    console.log(`
${B('1. Trong Customer Portal webhook-sepay (apps/customer-portal/api/webhook-sepay.js):')}
${C(`// Thêm ở đầu file:
const { enrollCustomer } = require('../../output/funnel/brevo');
// hoặc nếu đã copy vào api/:
const { enrollCustomer } = require('./brevo');

// Thêm CUỐI handler, sau khi account đã tạo xong:
if (process.env.BREVO_API_KEY) {
  await enrollCustomer({
    email:        customerEmail,
    name:         customerName,
    product:      productName,
    purchaseDate: new Date().toLocaleDateString('vi-VN'),
    funnelSlug:   funnelSlug || '',
  }).catch(console.error); // non-blocking
}`)}

${B('2. Trong funnel lead capture (api/capture-lead.js hoặc similar):')}
${C(`const { enrollLead } = require('./brevo');

// Sau khi save lead:
if (process.env.BREVO_API_KEY) {
  await enrollLead({
    email:  req.body.email,
    name:   req.body.name || '',
    source: 'landing-page',
  }).catch(console.error);
}`)}
`);
  } else {
    console.log(`
${B('Trong api/webhook.js (funnel trực tiếp):')}
${C(`// Thêm ở đầu:
const { sendDeliveryEmail, enrollCustomer } = require('./brevo');

// Sau khi verify payment:
const customerData = {
  email:        paymentData.buyer_email || paymentData.email,
  name:         paymentData.buyer_name  || 'bạn',
  product:      process.env.PRODUCT_NAME,
  accessLink:   process.env.ACCESS_LINK,
  purchaseDate: new Date().toLocaleDateString('vi-VN'),
  funnelSlug:   process.env.FUNNEL_SLUG || '',
};

await Promise.all([
  sendDeliveryEmail(customerData),  // giao hàng trực tiếp
  enrollCustomer(customerData),     // vào onboarding sequence
]);`)}

${B('.env bổ sung:')}
${C(`PRODUCT_NAME=AI Agent Business Kit
ACCESS_LINK=https://github.com/your-repo
FUNNEL_SLUG=ai-agent-biz-kit`)}
`);
  }

  console.log(B('📦 npm install (nếu chưa có):'));
  console.log(C('npm install @getbrevo/brevo dotenv\n'));

  console.log(G('✅ Setup hoàn tất!\n'));
  console.log(B('Bước tiếp theo:'));
  console.log('  1. Patch webhook theo hướng dẫn ở trên');
  console.log('  2. Setup Brevo Automations: skills/integrations/brevo/sequence-setup-guide.md');
  console.log('  3. Deploy lại lên Vercel\n');
}

main().catch(err => {
  console.error(R('\n✗ Lỗi:'), err.message);
  process.exit(1);
});
