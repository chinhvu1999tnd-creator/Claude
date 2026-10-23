#!/usr/bin/env node
/**
 * setup-telegram.js
 * Setup Telegram bot notification cho funnel — tự động lấy Chat ID và test
 *
 * Cách dùng:
 *   node setup-telegram.js              → interactive setup
 *   node setup-telegram.js --test       → chỉ test bot đã config (đọc .env)
 *   node setup-telegram.js --show       → hiển thị config hiện tại
 *
 * Sau khi chạy xong: config được lưu vào .env (tạo mới hoặc append)
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const readline = require('readline');

// ─── Parse args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const MODE = args[0] || 'setup';

// ─── .env helpers ─────────────────────────────────────────────────────────────
const ENV_FILE = path.join(process.cwd(), '.env');

function readEnv() {
  if (!fs.existsSync(ENV_FILE)) return {};
  return Object.fromEntries(
    fs.readFileSync(ENV_FILE, 'utf8')
      .split('\n')
      .filter(l => l.includes('=') && !l.startsWith('#'))
      .map(l => l.split('=').map(s => s.trim()))
  );
}

function writeEnv(vars) {
  const existing = readEnv();
  const merged = { ...existing, ...vars };
  const content = Object.entries(merged)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
  fs.writeFileSync(ENV_FILE, content, 'utf8');
}

// ─── Telegram API helpers ─────────────────────────────────────────────────────
function telegramRequest(token, method, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${token}/${method}`,
      method: body ? 'POST' : 'GET',
      headers: body ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      } : {},
    };

    const req = https.request(options, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error('Invalid JSON response')); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getBotInfo(token) {
  const res = await telegramRequest(token, 'getMe');
  if (!res.ok) throw new Error(res.description || 'Invalid bot token');
  return res.result;
}

async function getChatId(token) {
  const res = await telegramRequest(token, 'getUpdates');
  if (!res.ok) throw new Error(res.description);
  if (!res.result.length) return null;
  const last = res.result[res.result.length - 1];
  return last.message?.chat?.id || last.channel_post?.chat?.id || null;
}

async function sendMessage(token, chatId, text) {
  return telegramRequest(token, 'sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  });
}

// ─── Prompt helper ────────────────────────────────────────────────────────────
function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

// ─── Modes ────────────────────────────────────────────────────────────────────
async function modeShow() {
  const env = readEnv();
  console.log('\n📋 Telegram config hiện tại (.env):');
  console.log(`   BOT_TOKEN: ${env.TELEGRAM_BOT_TOKEN ? env.TELEGRAM_BOT_TOKEN.slice(0,10) + '...' : '❌ Chưa có'}`);
  console.log(`   CHAT_ID:   ${env.TELEGRAM_CHAT_ID || '❌ Chưa có'}`);
  console.log('');
}

async function modeTest() {
  const env = readEnv();
  const token  = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('❌ Chưa có config. Chạy: node setup-telegram.js');
    process.exit(1);
  }

  console.log('\n📨 Gửi test notification...');
  const res = await sendMessage(token, chatId,
    `🧪 <b>Test Notification</b>\n\nBot Telegram đã hoạt động!\n\n` +
    `🕐 ${new Date().toLocaleString('vi-VN')}\n` +
    `✅ Funnel sẵn sàng nhận đơn hàng.`
  );

  if (res.ok) {
    console.log('✅ Tin nhắn đã gửi thành công! Kiểm tra Telegram của bạn.');
  } else {
    console.error('❌ Gửi thất bại:', res.description);
  }
}

async function modeSetup() {
  const hr  = () => console.log('─'.repeat(52));
  const ok  = msg => console.log(`\x1b[32m✅\x1b[0m ${msg}`);
  const tip = msg => console.log(`\x1b[33m💡\x1b[0m ${msg}`);
  const err = msg => console.log(`\x1b[31m❌\x1b[0m ${msg}`);

  console.log('\n\x1b[1m🤖 Setup Telegram Bot — AI Agent Business Kit\x1b[0m');
  console.log('Sau khi xong, bạn sẽ nhận thông báo ngay khi có lead hoặc đơn hàng mới.');
  hr();

  // ── BƯỚC 1: Tạo bot ──────────────────────────────────────────────────────────
  console.log('\n\x1b[1m[Bước 1/4]\x1b[0m Tạo bot Telegram\n');
  console.log('  1. Mở Telegram trên điện thoại hoặc máy tính');
  console.log('  2. Tìm kiếm: \x1b[1m@BotFather\x1b[0m  (tài khoản xanh có tích)');
  console.log('  3. Bấm START hoặc gõ: /start');
  console.log('  4. Gõ lệnh: \x1b[1m/newbot\x1b[0m');
  console.log('  5. BotFather hỏi tên bot → nhập tên bất kỳ (VD: "AI Agent Notify")');
  console.log('  6. BotFather hỏi username → nhập username kết thúc bằng "bot"');
  console.log('     (VD: myshop_notify_bot)');
  console.log('  7. BotFather gửi lại \x1b[1mBot Token\x1b[0m dạng: 1234567890:AAFxxx...');
  console.log('');
  tip('Nếu username đã tồn tại → thử thêm số vào cuối, VD: myshop2024_bot');
  console.log('');

  await prompt('⏎  Đã tạo bot và có Token? Nhấn Enter để tiếp tục...');

  // ── BƯỚC 2: Nhập và xác minh token ──────────────────────────────────────────
  console.log('\n\x1b[1m[Bước 2/4]\x1b[0m Nhập Bot Token\n');
  tip('Copy token từ BotFather, dán vào đây (Ctrl+V / Cmd+V)');
  console.log('');

  let token, botInfo;
  while (true) {
    token = await prompt('📋 Bot Token: ');
    token = token.trim();

    if (!token) { err('Chưa nhập token. Thử lại.'); continue; }
    if (!token.includes(':')) {
      err('Token không đúng định dạng. Token dạng: 1234567890:AAFxxx...');
      continue;
    }

    console.log('\n🔍 Đang xác minh token...');
    try {
      botInfo = await getBotInfo(token);
      ok(`Bot hợp lệ: \x1b[1m@${botInfo.username}\x1b[0m (${botInfo.first_name})`);
      break;
    } catch (e) {
      err('Token không hợp lệ hoặc bot chưa được tạo xong.');
      tip('Kiểm tra lại token từ BotFather, copy toàn bộ dòng.');
    }
  }

  // ── BƯỚC 3: Kết nối với chat/group ──────────────────────────────────────────
  console.log('\n\x1b[1m[Bước 3/4]\x1b[0m Chọn nơi nhận thông báo\n');
  console.log('  Thông báo có thể gửi đến:');
  console.log('  A) \x1b[1mDM cá nhân\x1b[0m — chỉ mình bạn thấy (đơn giản nhất)');
  console.log('  B) \x1b[1mGroup Telegram\x1b[0m — cả team cùng thấy');
  console.log('');

  const dest = await prompt('Bạn chọn A hay B? ');

  if (dest.trim().toUpperCase() === 'B') {
    console.log('');
    console.log('  Để kết nối với Group:');
    console.log('  1. Mở group Telegram của bạn');
    console.log('  2. Thêm \x1b[1m@' + botInfo.username + '\x1b[0m vào group (Add member)');
    console.log('  3. Gõ bất kỳ tin nhắn nào trong group (VD: "hello")');
    console.log('');
    await prompt('⏎  Đã thêm bot và gửi tin nhắn trong group? Nhấn Enter...');
  } else {
    console.log('');
    console.log('  Để kết nối với DM cá nhân:');
    console.log('  1. Tìm \x1b[1m@' + botInfo.username + '\x1b[0m trên Telegram');
    console.log('  2. Bấm START hoặc gõ: /start');
    console.log('');
    await prompt('⏎  Đã nhắn tin với bot? Nhấn Enter...');
  }

  // Tự động lấy Chat ID
  console.log('\n🔍 Đang tự động lấy Chat ID...');
  let finalChatId = await getChatId(token);

  if (finalChatId) {
    ok(`Tìm thấy Chat ID: \x1b[1m${finalChatId}\x1b[0m`);
    const confirm = await prompt('Dùng Chat ID này không? (Enter = Có, n = Không): ');
    if (confirm.toLowerCase() === 'n') finalChatId = null;
  }

  if (!finalChatId) {
    console.log('');
    tip('Không tự động lấy được Chat ID. Lấy thủ công:');
    console.log(`  Mở link này trong trình duyệt:`);
    console.log(`  \x1b[36mhttps://api.telegram.org/bot${token}/getUpdates\x1b[0m`);
    console.log('  Tìm dòng \x1b[1m"id"\x1b[0m trong phần "chat" → đó là Chat ID');
    console.log('  (Số dương = DM/group thường, số âm = group supergroup)');
    console.log('');
    finalChatId = await prompt('Nhập Chat ID: ');
    finalChatId = finalChatId.trim();
  }

  // ── BƯỚC 4: Test và lưu ──────────────────────────────────────────────────────
  console.log('\n\x1b[1m[Bước 4/4]\x1b[0m Gửi tin nhắn test\n');
  console.log('🔍 Đang gửi test notification...');

  const testRes = await sendMessage(token, finalChatId,
    `🎉 <b>Kết Nối Thành Công!</b>\n\n` +
    `Bot <b>@${botInfo.username}</b> đã sẵn sàng.\n\n` +
    `Từ giờ bạn sẽ nhận thông báo ngay khi:\n` +
    `• 📥 Có lead mới đăng ký\n` +
    `• 💰 Có đơn hàng mới\n\n` +
    `🕐 ${new Date().toLocaleString('vi-VN')}`
  );

  if (!testRes.ok) {
    err('Gửi test thất bại: ' + testRes.description);
    console.log('');
    tip('Kiểm tra lại:');
    console.log('  • Bot đã được thêm vào group chưa?');
    console.log('  • Chat ID có đúng không?');
    console.log('  • Bạn đã gửi tin nhắn trong chat/group chưa?');
    process.exit(1);
  }

  ok('Test message đã gửi! Kiểm tra Telegram của bạn.');

  // Lưu .env
  writeEnv({
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_CHAT_ID:   String(finalChatId),
  });

  hr();
  console.log('\n\x1b[1m\x1b[32m🎉 Telegram Bot đã kết nối!\x1b[0m\n');
  console.log(`  Bot:     @${botInfo.username}`);
  console.log(`  Chat ID: ${finalChatId}`);
  console.log('  Config:  đã lưu vào .env\n');
  console.log('  Test lại bất cứ lúc nào:');
  console.log('  \x1b[2mnode skills/funnel/deploy/scripts/setup-telegram.js --test\x1b[0m');
  hr();
  console.log('');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    if (MODE === '--show')  await modeShow();
    else if (MODE === '--test') await modeTest();
    else await modeSetup();
  } catch (e) {
    console.error('\n❌ Lỗi:', e.message);
    process.exit(1);
  }
})();
