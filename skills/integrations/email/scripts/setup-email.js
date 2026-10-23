#!/usr/bin/env node
/**
 * setup-email.js — Provider-aware email integration setup
 *
 * Chạy: node skills/integrations/email/scripts/setup-email.js
 *
 * Tự động detect provider từ .env (EMAIL_PROVIDER) và chạy setup phù hợp.
 * Default: brevo
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');

const ROOT     = path.resolve(__dirname, '../../../../..');
const ENV_PATH = path.join(ROOT, '.env');

const G = s => `\x1b[32m${s}\x1b[0m`;
const R = s => `\x1b[31m${s}\x1b[0m`;
const Y = s => `\x1b[33m${s}\x1b[0m`;
const B = s => `\x1b[1m${s}\x1b[0m`;
const C = s => `\x1b[36m${s}\x1b[0m`;
const D = s => `\x1b[2m${s}\x1b[0m`;

function loadEnv(p) {
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(
    fs.readFileSync(p, 'utf8').split('\n')
      .filter(l => l.includes('=') && !l.startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
  );
}

function writeEnvKey(envPath, key, value) {
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const line  = `${key}=${value}`;
  content = regex.test(content) ? content.replace(regex, line) : content + (content.endsWith('\n') ? '' : '\n') + line + '\n';
  fs.writeFileSync(envPath, content);
}

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

async function ensureBrevoList(apiKey, name) {
  const lists = await brevoReq({ method: 'GET', path: '/v3/contacts/lists?limit=50', apiKey });
  const found = lists.body?.lists?.find(l => l.name === name);
  if (found) return found.id;
  const r = await brevoReq({ method: 'POST', path: '/v3/contacts/lists', apiKey, body: { name, folderId: 1 } });
  if (r.status === 201) return r.body.id;
  throw new Error(`Cannot create list "${name}": ${JSON.stringify(r.body)}`);
}

// ── Deploy email.js + provider to funnel outputs ──────────────────────────────
function deployEmailModule(provider) {
  const emailSrc    = path.join(__dirname, '..', 'email.js');
  const providerSrc = path.join(__dirname, '..', 'providers', `${provider}.js`);
  const salesDir    = path.join(ROOT, 'output/funnel/sales');
  let count = 0;

  const deployTo = (apiDir) => {
    fs.mkdirSync(path.join(apiDir, 'providers'), { recursive: true });
    fs.copyFileSync(emailSrc, path.join(apiDir, 'email.js'));
    fs.copyFileSync(providerSrc, path.join(apiDir, 'providers', `${provider}.js`));
  };

  if (fs.existsSync(salesDir)) {
    for (const slug of fs.readdirSync(salesDir)) {
      const apiDir = path.join(salesDir, slug, 'api');
      if (fs.existsSync(apiDir)) { deployTo(apiDir); count++; }
    }
  }

  // Shared output/funnel location
  const sharedApi = path.join(ROOT, 'output/funnel/api');
  fs.mkdirSync(sharedApi, { recursive: true });
  deployTo(sharedApi);

  return count;
}

// ── Brevo setup ───────────────────────────────────────────────────────────────
async function setupBrevo(env) {
  console.log(B('\n── Brevo Setup ──────────────────────────────────────────\n'));

  const API_KEY      = env.BREVO_API_KEY;
  const SENDER_EMAIL = env.BREVO_SENDER_EMAIL;
  const PORTAL_URL   = env.CUSTOMER_PORTAL_URL;

  if (!API_KEY || API_KEY.includes('xxx')) {
    console.log(R('✗ BREVO_API_KEY chưa có hoặc là placeholder'));
    console.log(Y('  → brevo.com → Settings → API Keys → Generate\n  → .env: BREVO_API_KEY=xkeysib-...\n'));
    process.exit(1);
  }
  if (!SENDER_EMAIL) { console.log(R('✗ BREVO_SENDER_EMAIL chưa có trong .env\n')); process.exit(1); }

  const scenario = PORTAL_URL ? 'A' : 'B';
  console.log(B(`Scenario: ${scenario}`) + (scenario === 'A'
    ? ` — Customer Portal (${PORTAL_URL})`
    : ' — No Customer Portal (direct delivery)') + '\n');

  process.stdout.write('Verifying API key... ');
  const acct = await brevoReq({ method: 'GET', path: '/v3/account', apiKey: API_KEY });
  if (acct.status !== 200) { console.log(R('✗ API key không hợp lệ\n')); process.exit(1); }
  console.log(G(`✓ ${acct.body.email} (${acct.body.plan?.[0]?.type || 'free'})`));

  const LISTS = [
    { name: 'Leads',          envKey: 'BREVO_LIST_ID_LEADS'        },
    { name: 'Customers',      envKey: 'BREVO_LIST_ID_CUSTOMERS'    },
    { name: 'Re-engagement',  envKey: 'BREVO_LIST_ID_REENGAGEMENT' },
    { name: 'Abandoned Cart', envKey: 'BREVO_LIST_ID_ABANDONED'    },
  ];

  console.log('\nCreating contact lists:');
  const listIds = {};
  for (const list of LISTS) {
    process.stdout.write(`  "${list.name}"... `);
    if (env[list.envKey]) {
      listIds[list.envKey] = parseInt(env[list.envKey]);
      console.log(G(`✓ Already exists (ID: ${env[list.envKey]})`));
    } else {
      const id = await ensureBrevoList(API_KEY, list.name);
      listIds[list.envKey] = id;
      writeEnvKey(ENV_PATH, list.envKey, id);
      console.log(G(`✓ Created (ID: ${id})`));
    }
  }

  process.stdout.write('\nCreating contact attributes... ');
  const ATTRS = [
    { name: 'FIRSTNAME',     category: 'normal', type: 'text' },
    { name: 'PRODUCT',       category: 'normal', type: 'text' },
    { name: 'PURCHASE_DATE', category: 'normal', type: 'date' },
    { name: 'SOURCE',        category: 'normal', type: 'text' },
    { name: 'AMOUNT',        category: 'normal', type: 'text' },
    { name: 'ORDER_ID',      category: 'normal', type: 'text' },
    { name: 'CHECKOUT_LINK', category: 'normal', type: 'text' },
  ];
  let ok = 0;
  for (const a of ATTRS) {
    const r = await brevoReq({
      method: 'POST', path: `/v3/contacts/attributes/${a.category}/${a.name}`,
      apiKey: API_KEY, body: { type: a.type },
    });
    if (r.status === 201 || r.status === 400) ok++;
  }
  console.log(G(`✓ ${ok}/${ATTRS.length} attributes ready`));

  process.stdout.write(`\nSending test email to ${SENDER_EMAIL}... `);
  const testResult = await brevoReq({
    method: 'POST', path: '/v3/smtp/email', apiKey: API_KEY,
    body: {
      sender: { name: env.BREVO_SENDER_NAME || 'AI Agent Kit', email: SENDER_EMAIL },
      to: [{ email: SENDER_EMAIL }],
      subject: '✅ Email integration setup thành công',
      htmlContent: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px">
          <h2>✅ Email integration ready</h2>
          <p>Provider: <strong>Brevo</strong></p>
          <p>Scenario: <strong>${scenario === 'A' ? 'A — Customer Portal' : 'B — Direct delivery'}</strong></p>
          <p>Lists:</p>
          <ul>
            ${LISTS.map(l => `<li>${l.name} (ID: ${listIds[l.envKey]})</li>`).join('')}
          </ul>
          <p style="color:#888;font-size:13px">AI Agent Business Kit · skills/integrations/email/</p>
        </div>`,
    },
  });
  console.log(testResult.status === 201 ? G('✓ Check inbox') : Y(`⚠ ${testResult.status} — tiếp tục`));

  writeEnvKey(ENV_PATH, 'EMAIL_PROVIDER', 'brevo');
  console.log(G('\n✓ EMAIL_PROVIDER=brevo đã ghi vào .env'));

  return { scenario, listIds };
}

// ── Resend setup ──────────────────────────────────────────────────────────────
async function setupResend(env) {
  console.log(B('\n── Resend Setup ─────────────────────────────────────────\n'));

  const API_KEY      = env.RESEND_API_KEY;
  const SENDER_EMAIL = env.RESEND_SENDER_EMAIL;

  if (!API_KEY || API_KEY.includes('xxx')) {
    console.log(R('✗ RESEND_API_KEY chưa có hoặc là placeholder'));
    console.log(Y('  → resend.com → API Keys → Create API Key\n  → .env: RESEND_API_KEY=re_...\n'));
    process.exit(1);
  }
  if (!SENDER_EMAIL) { console.log(R('✗ RESEND_SENDER_EMAIL chưa có trong .env\n')); process.exit(1); }

  process.stdout.write('Verifying Resend API key... ');
  const resp = await new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: 'api.resend.com', port: 443, path: '/domains', method: 'GET',
        headers: { Authorization: `Bearer ${API_KEY}`, Accept: 'application/json' } },
      res => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); } });
      }
    );
    req.on('error', reject);
    req.end();
  });

  if (resp.status !== 200) { console.log(R('✗ API key không hợp lệ\n')); process.exit(1); }
  console.log(G('✓ API key hợp lệ'));

  writeEnvKey(ENV_PATH, 'EMAIL_PROVIDER', 'resend');
  console.log(G('\n✓ EMAIL_PROVIDER=resend đã ghi vào .env'));

  console.log(Y('\n⚠️  Lưu ý quan trọng:'));
  console.log('  Resend không có sequence automation.');
  console.log('  enrollLead/enrollCustomer/enrollAbandoned sẽ log warning, không tự schedule.');
  console.log('  → Chỉ nên dùng Resend nếu anh tự build scheduler (n8n, cron, v.v.)');
  console.log('  → Khuyến nghị: EMAIL_PROVIDER=brevo để có full automation\n');
}

// ── Print patch instructions ──────────────────────────────────────────────────
function printPatchInstructions(provider, scenario) {
  console.log('\n' + B('─────────────────────────────────────────────'));
  console.log(B('📋 Patch Instructions'));
  console.log(B('─────────────────────────────────────────────\n'));
  console.log(D('Thay require("./brevo") bằng require("./email") trong mọi webhook:\n'));

  console.log(C(`// Tất cả webhooks và API handlers dùng interface này:
const { enrollLead, enrollCustomer, enrollAbandoned, sendEmail } = require('./email');

// Không import trực tiếp từ provider:
// ❌ const { enrollLead } = require('./brevo');     ← hardcoded
// ✅ const { enrollLead } = require('./email');     ← provider-agnostic`));

  if (provider === 'brevo' && scenario === 'A') {
    console.log(`\n${B('Customer Portal webhook-sepay:')}
${C(`// Cuối handler sau khi account tạo xong:
const { enrollCustomer } = require('./email');
await enrollCustomer({ email, name, product, purchaseDate, funnelSlug })
  .catch(console.error);`)}`);
  }

  console.log(`\n${B('Lead capture (funnel opt-in):')}
${C(`const { enrollLead } = require('./email');
await enrollLead({ email, name, source: 'landing-page' }).catch(console.error);`)}`);

  console.log(`\n${B('Abandoned order (30 phút sau order pending):')}
${C(`const { enrollAbandoned } = require('./email');
await enrollAbandoned({ email, name, product, amount, orderId, checkoutLink })
  .catch(console.error);`)}`);

  console.log(`\n${B('npm install:')}
${C(`npm install @getbrevo/brevo dotenv   # nếu dùng brevo
npm install resend dotenv               # nếu dùng resend`)}\n`);

  console.log(G('✅ Setup hoàn tất!\n'));
  console.log(B('Bước tiếp theo:'));
  if (provider === 'brevo') {
    console.log('  1. Patch webhooks theo hướng dẫn trên (dùng require("./email"))');
    console.log('  2. Setup Brevo Automations: skills/integrations/brevo/sequence-setup-guide.md');
    console.log('  3. Deploy lại lên Vercel\n');
  } else {
    console.log('  1. Patch webhooks theo hướng dẫn trên');
    console.log('  2. Cân nhắc n8n hoặc cron để schedule follow-up emails thủ công');
    console.log('  3. Deploy lại lên Vercel\n');
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + B('🚀 Email Integration Setup') + '\n');

  const env      = loadEnv(ENV_PATH);
  const provider = (env.EMAIL_PROVIDER || 'brevo').toLowerCase().trim();

  console.log(`Provider: ${B(provider)}`);
  console.log(D(`(Thay đổi: EMAIL_PROVIDER=resend|brevo trong .env)\n`));

  let setupResult = {};

  if (provider === 'brevo') {
    setupResult = await setupBrevo(env);
  } else if (provider === 'resend') {
    await setupResend(env);
  } else {
    console.log(R(`✗ Provider không được hỗ trợ: "${provider}"`));
    console.log(Y('  → Hỗ trợ: brevo | resend\n'));
    process.exit(1);
  }

  process.stdout.write('\nDeploying email module to funnel outputs... ');
  const count = deployEmailModule(provider);
  console.log(G(`✓ Deployed to ${count} funnel(s) + output/funnel/api/`));

  printPatchInstructions(provider, setupResult.scenario);
}

main().catch(err => {
  console.error(R('\n✗ Lỗi:'), err.message);
  process.exit(1);
});
