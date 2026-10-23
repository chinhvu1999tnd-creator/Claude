#!/usr/bin/env node
/**
 * setup-funnel-email.js — Tự động setup Brevo khi build funnel xong
 *
 * Chạy ngay sau khi build HTML funnel:
 *   node skills/integrations/email/scripts/setup-funnel-email.js --type leads --slug ai-agent-biz-kit
 *   node skills/integrations/email/scripts/setup-funnel-email.js --type sales --slug ai-agent-biz-kit
 *   node skills/integrations/email/scripts/setup-funnel-email.js --type abandoned --slug ai-agent-biz-kit
 *
 * Tự động:
 *   1. Tạo Brevo list riêng cho funnel này (e.g. "Leads — ai-agent-biz-kit")
 *   2. Parse email sequence từ markdown file của funnel type đó
 *   3. Tạo Brevo email templates với content đã parse
 *   4. Ghi Brevo IDs vào output/funnel/{type}/{slug}/funnel.json
 *   5. Print hướng dẫn Automation setup (1 manual step còn lại)
 *
 * Giới hạn Brevo API: Automation workflow (trigger→wait→send) không tạo được qua API.
 * Script này làm hết phần có thể tự động. Phần còn lại: 1 lần click trong Brevo UI.
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const ROOT     = path.resolve(__dirname, '../../../../..');
const ENV_PATH = path.join(ROOT, '.env');

const G = s => `\x1b[32m${s}\x1b[0m`;
const R = s => `\x1b[31m${s}\x1b[0m`;
const Y = s => `\x1b[33m${s}\x1b[0m`;
const B = s => `\x1b[1m${s}\x1b[0m`;
const C = s => `\x1b[36m${s}\x1b[0m`;
const D = s => `\x1b[2m${s}\x1b[0m`;

// ── Sequence definitions ──────────────────────────────────────────────────────
const SEQUENCE_FILES = {
  leads:    'skills/email-marketing/lead-nurture/email-lead-nurture.md',
  sales:    'skills/email-marketing/email-sequence/templates/sequences.md',
  abandoned:'skills/email-marketing/abandoned-cart/SKILL.md',
};

const LIST_NAMES = {
  leads:    slug => `Leads — ${slug}`,
  sales:    slug => `Customers — ${slug}`,
  abandoned:slug => `Abandoned Cart — ${slug}`,
};

const FUNNEL_DIRS = {
  leads:    slug => path.join(ROOT, 'output/funnel/leads', slug),
  sales:    slug => path.join(ROOT, 'output/funnel/sales', slug),
  abandoned:slug => path.join(ROOT, 'output/funnel/sales', slug),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
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

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1] || true;
      i++;
    }
  }
  return args;
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

// ── Brevo list ────────────────────────────────────────────────────────────────
async function ensureList(apiKey, name) {
  const lists = await brevoReq({ method: 'GET', path: '/v3/contacts/lists?limit=50&offset=0', apiKey });
  const found = lists.body?.lists?.find(l => l.name === name);
  if (found) return { id: found.id, existing: true };
  const r = await brevoReq({ method: 'POST', path: '/v3/contacts/lists', apiKey, body: { name, folderId: 1 } });
  if (r.status === 201) return { id: r.body.id, existing: false };
  throw new Error(`Cannot create list "${name}": ${JSON.stringify(r.body)}`);
}

// ── Brevo template ────────────────────────────────────────────────────────────
async function upsertTemplate(apiKey, { name, subject, htmlContent, senderName, senderEmail }) {
  // Check existing
  const list = await brevoReq({ method: 'GET', path: '/v3/smtp/templates?templateStatus=true&limit=50', apiKey });
  const allTemplates = [
    ...(list.body?.templates || []),
    // also check inactive
  ];
  const found = allTemplates.find(t => t.name === name);

  if (found) {
    // Update existing
    await brevoReq({
      method: 'PUT', path: `/v3/smtp/templates/${found.id}`, apiKey,
      body: { name, subject, htmlContent, sender: { name: senderName, email: senderEmail }, isActive: true },
    });
    return { id: found.id, existing: true };
  }

  // Create new
  const r = await brevoReq({
    method: 'POST', path: '/v3/smtp/templates', apiKey,
    body: {
      name,
      subject,
      htmlContent,
      sender: { name: senderName, email: senderEmail },
      replyTo: senderEmail,
      toField: '{{ contact.EMAIL }}',
      isActive: true,
    },
  });
  if (r.status === 201) return { id: r.body.id, existing: false };
  throw new Error(`Cannot create template "${name}": ${JSON.stringify(r.body)}`);
}

// ── Markdown parser ───────────────────────────────────────────────────────────
/**
 * Parse email sequence từ markdown.
 * Tìm blocks: ### Email N — [timing]: [description]
 * Extract: subject (dòng **Subject:**), body (giữa 2 dấu ---)
 */
function parseEmailSequence(markdown, type) {
  const emails = [];

  // Split by email headers
  const emailBlocks = markdown.split(/(?=###\s+Email\s+\d+\s+—)/i);

  for (const block of emailBlocks) {
    const headerMatch = block.match(/###\s+Email\s+(\d+)\s+—\s+([^\n]+)/i);
    if (!headerMatch) continue;

    const emailNum   = parseInt(headerMatch[1]);
    const headerDesc = headerMatch[2].trim();

    // Extract subject
    const subjectMatch = block.match(/\*\*Subject:\*\*\s*(.+)/i);
    if (!subjectMatch) continue;
    const subject = subjectMatch[1].trim();

    // Extract body — between the separators (---)
    // Find the body between the first and second ---
    const parts = block.split(/^---\s*$/m);
    // parts[0] = header section, parts[1] = body, parts[2] = after body
    let body = '';
    if (parts.length >= 3) {
      body = parts[1].trim();
    } else if (parts.length === 2) {
      body = parts[1].trim();
    }

    // Parse timing from header
    const timing = parseTiming(headerDesc, emailNum, type);

    emails.push({ num: emailNum, headerDesc, subject, body, timing });
  }

  // Sort by email number
  emails.sort((a, b) => a.num - b.num);
  return emails;
}

/**
 * Parse timing từ header description.
 * "Ngay lập tức" → { value: 0, unit: 'immediately' }
 * "Ngày 2" → { value: 2, unit: 'days' }
 * "30 Phút" → { value: 30, unit: 'minutes' }
 * "4 Giờ" → { value: 4, unit: 'hours' }
 */
function parseTiming(headerDesc, emailNum, type) {
  const desc = headerDesc.toLowerCase();

  if (desc.includes('ngay lập tức') || desc.includes('ngay') || emailNum === 1) {
    if (type === 'abandoned') return { value: 30, unit: 'minutes' };
    return { value: 0, unit: 'immediately' };
  }
  if (desc.match(/(\d+)\s*(phút|minute)/i)) {
    return { value: parseInt(desc.match(/(\d+)\s*(phút|minute)/i)[1]), unit: 'minutes' };
  }
  if (desc.match(/(\d+)\s*(giờ|hour)/i)) {
    return { value: parseInt(desc.match(/(\d+)\s*(giờ|hour)/i)[1]), unit: 'hours' };
  }
  if (desc.match(/ngày\s+(\d+)/i)) {
    return { value: parseInt(desc.match(/ngày\s+(\d+)/i)[1]), unit: 'days' };
  }

  // Fallback for abandoned cart sequence
  if (type === 'abandoned') {
    const fallbacks = [
      { value: 30, unit: 'minutes' },
      { value: 4, unit: 'hours' },
      { value: 24, unit: 'hours' },
    ];
    return fallbacks[emailNum - 1] || { value: (emailNum - 1) * 24, unit: 'hours' };
  }

  // Fallback: sequential days
  return { value: emailNum - 1, unit: 'days' };
}

function timingLabel({ value, unit }) {
  if (unit === 'immediately') return 'Gửi ngay (delay = 0)';
  if (unit === 'minutes') return `Sau ${value} phút`;
  if (unit === 'hours') return `Sau ${value} giờ`;
  if (unit === 'days') return `Sau ${value} ngày`;
  return `Delay: ${value} ${unit}`;
}

// ── Text → HTML email ─────────────────────────────────────────────────────────
function textToHtml(text, slug, type) {
  const brandColor = '#B6FF00'; // lime neon — override khi có THEME.md

  const lines = text.split('\n');
  const htmlLines = [];
  let inParagraph = false;

  for (const raw of lines) {
    const line = raw.trim();

    if (line === '') {
      if (inParagraph) { htmlLines.push('</p>'); inParagraph = false; }
      continue;
    }

    // CTA line → ở / link
    if (line.startsWith('→')) {
      if (inParagraph) { htmlLines.push('</p>'); inParagraph = false; }
      const ctaText = line.slice(1).trim();
      // Check if it contains a placeholder link
      const isPlaceholder = ctaText.includes('[') && ctaText.includes(']');
      if (isPlaceholder) {
        htmlLines.push(
          `<p style="margin:16px 0;"><a href="#" style="display:inline-block;background:${brandColor};color:#111;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px;">${escHtml(ctaText)}</a></p>`
        );
      } else {
        htmlLines.push(
          `<p style="margin:16px 0;"><a href="#" style="color:${brandColor};font-weight:700;text-decoration:none;">→ ${escHtml(ctaText)}</a></p>`
        );
      }
      continue;
    }

    // Bold text **...**
    let processed = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:#f5f5f5;padding:2px 5px;border-radius:3px;font-size:13px;">$1</code>');

    if (!inParagraph) { htmlLines.push('<p style="margin:0 0 14px;line-height:1.7;color:#333;">'); inParagraph = true; }
    htmlLines.push(processed);
  }

  if (inParagraph) htmlLines.push('</p>');

  const bodyHtml = htmlLines.join('\n');

  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:32px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
      <!-- Header accent -->
      <tr><td style="height:4px;background:${brandColor};"></td></tr>
      <!-- Body -->
      <tr><td style="padding:36px 40px 28px;font-size:16px;line-height:1.7;color:#333;">
        ${bodyHtml}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:20px 40px;border-top:1px solid #eee;font-size:12px;color:#999;line-height:1.6;">
        Bạn nhận được email này vì đã đăng ký nhận thông tin từ chúng tôi.<br>
        <a href="{{ unsubscribeUrl }}" style="color:#999;">Hủy đăng ký</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── funnel.json update ────────────────────────────────────────────────────────
function updateFunnelJson(funnelDir, type, listId, listName, templates) {
  const funnelJsonPath = path.join(funnelDir, 'funnel.json');
  let data = {};

  if (fs.existsSync(funnelJsonPath)) {
    try { data = JSON.parse(fs.readFileSync(funnelJsonPath, 'utf8')); }
    catch { data = {}; }
  }

  if (!data.email) data.email = {};
  if (!data.email.lists) data.email.lists = {};
  if (!data.email.templates) data.email.templates = {};

  data.email.provider  = 'brevo';
  data.email.lists[type] = { id: listId, name: listName };
  data.email.templates[type] = templates.map(t => ({
    id:          t.id,
    name:        t.name,
    subject:     t.subject,
    timing:      t.timing,
    timing_label:timingLabel(t.timing),
  }));

  // Update checklist
  if (!data.checklist) data.checklist = {};
  data.checklist[`brevo_${type}_list`]      = true;
  data.checklist[`brevo_${type}_templates`] = true;
  data.checklist[`brevo_${type}_automation`] = false; // still manual

  if (fs.existsSync(funnelDir)) {
    fs.writeFileSync(funnelJsonPath, JSON.stringify(data, null, 2));
    return true;
  }
  return false;
}

// ── Print automation guide ────────────────────────────────────────────────────
function printAutomationGuide(type, slug, listName, listId, templates) {
  const guide = {
    leads: {
      title: 'Lead Nurture Sequence',
      stopCondition: 'Thêm Exit condition: "Contact added to list Customers"',
    },
    sales: {
      title: 'Customer Onboarding Sequence',
      stopCondition: 'Không cần stop condition — sequence hữu hạn',
    },
    abandoned: {
      title: 'Abandoned Cart Recovery',
      stopCondition: 'Thêm Exit condition: "Contact added to list Customers — {slug}"',
    },
  }[type];

  console.log('\n' + B('═══════════════════════════════════════════════════════'));
  console.log(B('  📋 BREVO AUTOMATION SETUP — 1 lần, ~5 phút'));
  console.log(B('═══════════════════════════════════════════════════════\n'));

  console.log(D('Truy cập: brevo.com → Automation → Create a workflow\n'));

  console.log(B('Workflow name:'), C(`${guide.title} — ${slug}`));
  console.log(B('Trigger:'), C(`Contact added to list "${listName}" (ID: ${listId})\n`));

  console.log(B('Steps:\n'));
  for (const tpl of templates) {
    const label = tpl.timing.unit === 'immediately'
      ? G('  ▸ Gửi ngay (delay = 0)')
      : Y(`  ▸ Chờ ${tpl.timing.value} ${tpl.timing.unit}`);
    console.log(label);
    console.log(`    Send Email → Template: ${B(tpl.name)}`);
    console.log(D(`    Template ID: ${tpl.id} | Subject: "${tpl.subject}"\n`));
  }

  console.log(B('Stop condition:'), C(guide.stopCondition));

  console.log('\n' + D('─────────────────────────────────────────────────────'));
  console.log(Y('⚠️  Lưu ý nội dung templates:'));
  console.log('  Templates đã có sẵn trong Brevo với content mẫu.');
  console.log('  Thay thế tất cả [ ] placeholder trước khi activate:');
  console.log(D('  brevo.com → Email → Templates → tìm template → Edit\n'));

  console.log(G('✅ Sau khi xong → Automation sẽ tự chạy khi có lead mới!\n'));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + B('⚡ Funnel Email Setup') + '\n');

  const args = parseArgs(process.argv);
  const type = args.type;
  const slug = args.slug;

  // Validate
  if (!type || !['leads', 'sales', 'abandoned'].includes(type)) {
    console.log(R('✗ --type bắt buộc: leads | sales | abandoned'));
    console.log(Y('  Ví dụ: node setup-funnel-email.js --type leads --slug my-funnel\n'));
    process.exit(1);
  }
  if (!slug) {
    console.log(R('✗ --slug bắt buộc (tên funnel folder)'));
    console.log(Y('  Ví dụ: --slug ai-agent-biz-kit\n'));
    process.exit(1);
  }

  const env = loadEnv(ENV_PATH);
  const API_KEY = env.BREVO_API_KEY;
  const SENDER_EMAIL = env.BREVO_SENDER_EMAIL;
  const SENDER_NAME  = env.BREVO_SENDER_NAME || env.STORE_NAME || 'AI Agent Kit';

  if (!API_KEY || API_KEY.includes('xkeysib-') && API_KEY.length < 20) {
    console.log(R('✗ BREVO_API_KEY chưa có hoặc chưa hợp lệ trong .env'));
    console.log(Y('  Chạy setup tổng quát trước: node skills/integrations/email/scripts/setup-email.js\n'));
    process.exit(1);
  }
  if (!SENDER_EMAIL) {
    console.log(R('✗ BREVO_SENDER_EMAIL chưa có trong .env\n'));
    process.exit(1);
  }

  console.log(`Type: ${B(type)} | Slug: ${B(slug)}\n`);

  // ── Step 1: Create list ────────────────────────────────────────────────────
  const listName = LIST_NAMES[type](slug);
  process.stdout.write(`Creating Brevo list "${listName}"... `);
  const { id: listId, existing: listExisting } = await ensureList(API_KEY, listName);
  console.log(listExisting ? Y(`✓ Already exists (ID: ${listId})`) : G(`✓ Created (ID: ${listId})`));

  // Write to .env for reference
  const envKey = `BREVO_LIST_ID_${type.toUpperCase()}_${slug.toUpperCase().replace(/-/g, '_')}`;
  writeEnvKey(ENV_PATH, envKey, listId);

  // ── Step 2: Parse sequence ─────────────────────────────────────────────────
  const sequenceFilePath = path.join(ROOT, SEQUENCE_FILES[type]);
  if (!fs.existsSync(sequenceFilePath)) {
    console.log(R(`✗ Sequence file không tìm thấy: ${SEQUENCE_FILES[type]}\n`));
    process.exit(1);
  }

  const markdown = fs.readFileSync(sequenceFilePath, 'utf8');
  const emails   = parseEmailSequence(markdown, type);

  if (emails.length === 0) {
    console.log(R('✗ Không parse được email nào từ sequence file'));
    console.log(Y(`  Kiểm tra format: ${SEQUENCE_FILES[type]}\n`));
    process.exit(1);
  }

  console.log(G(`✓ Parsed ${emails.length} emails từ sequence\n`));

  // ── Step 3: Create Brevo templates ────────────────────────────────────────
  console.log('Creating Brevo email templates:');
  const createdTemplates = [];

  for (const email of emails) {
    const templateName = `[${slug}] ${type.charAt(0).toUpperCase() + type.slice(1)} Email ${email.num} — ${email.headerDesc.split(':')[0].trim()}`;
    process.stdout.write(`  Email ${email.num}: "${email.subject.slice(0, 50)}..."  `);

    const html = textToHtml(email.body, slug, type);

    try {
      const { id, existing } = await upsertTemplate(API_KEY, {
        name:         templateName,
        subject:      email.subject,
        htmlContent:  html,
        senderName:   SENDER_NAME,
        senderEmail:  SENDER_EMAIL,
      });
      console.log(existing ? Y(`✓ Updated (ID: ${id})`) : G(`✓ Created (ID: ${id})`));
      createdTemplates.push({ id, name: templateName, subject: email.subject, timing: email.timing });
    } catch (err) {
      console.log(R(`✗ Failed: ${err.message}`));
    }
  }

  // ── Step 4: Update funnel.json ─────────────────────────────────────────────
  const funnelDir = FUNNEL_DIRS[type](slug);
  process.stdout.write(`\nUpdating funnel.json at ${path.relative(ROOT, funnelDir)}... `);

  if (fs.existsSync(funnelDir)) {
    updateFunnelJson(funnelDir, type, listId, listName, createdTemplates);
    console.log(G('✓ Updated'));
  } else {
    console.log(Y(`⚠ Funnel dir không tìm thấy (${funnelDir}) — skipped`));
    console.log(D(`  Chạy /funnel build trước để tạo funnel files.\n`));
  }

  // ── Step 5: Print automation guide ────────────────────────────────────────
  printAutomationGuide(type, slug, listName, listId, createdTemplates);
}

main().catch(err => {
  console.error(R('\n✗ Lỗi:'), err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
