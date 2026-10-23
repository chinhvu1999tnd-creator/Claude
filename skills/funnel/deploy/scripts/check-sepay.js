#!/usr/bin/env node
/**
 * check-sepay.js
 * Poll SePay API để xác nhận thanh toán — dùng để test integration end-to-end
 *
 * Cách dùng:
 *   node check-sepay.js                          → interactive (hỏi amount + ref)
 *   node check-sepay.js --amount 97000 --ref TEST123   → truyền args trực tiếp
 *   node check-sepay.js --setup                  → hướng dẫn lấy API token
 *   node check-sepay.js --recent                 → xem 5 giao dịch gần nhất
 *
 * Yêu cầu: SEPAY_API_TOKEN trong .env
 */

const https    = require('https');
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

// ─── Parse args ───────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const getArg  = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (flag) => args.includes(flag);

const MODE       = hasFlag('--setup') ? 'setup' : hasFlag('--recent') ? 'recent' : 'check';
const ARG_AMOUNT = getArg('--amount');
const ARG_REF    = getArg('--ref');

// ─── .env helpers ─────────────────────────────────────────────────────────────
function readEnv() {
  const envFile = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envFile)) return {};
  return Object.fromEntries(
    fs.readFileSync(envFile, 'utf8')
      .split('\n')
      .filter(l => l.includes('=') && !l.startsWith('#'))
      .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
  );
}

function writeEnv(vars) {
  const envFile = path.join(process.cwd(), '.env');
  const existing = readEnv();
  const merged = { ...existing, ...vars };
  fs.writeFileSync(envFile,
    Object.entries(merged).map(([k, v]) => `${k}=${v}`).join('\n') + '\n'
  );
}

// ─── SePay API ────────────────────────────────────────────────────────────────
function sePayRequest(token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const urlPath = `/userapi/transactions/list${query ? '?' + query : ''}`;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'my.sepay.vn',
      path: urlPath,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error('SePay trả về không hợp lệ: ' + raw.slice(0, 100))); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// ─── Prompt ───────────────────────────────────────────────────────────────────
function prompt(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => rl.question(q, a => { rl.close(); r(a.trim()); }));
}

// ─── Format tiền VN ──────────────────────────────────────────────────────────
const fmtVND = (n) => Number(n).toLocaleString('vi-VN') + 'đ';

// ─── Modes ────────────────────────────────────────────────────────────────────
async function modeSetup() {
  console.log('\n📋 Hướng dẫn lấy SePay API Token:');
  console.log('──────────────────────────────────');
  console.log('1. Đăng nhập: https://my.sepay.vn');
  console.log('2. Vào: Tài khoản → API & Webhook → Tạo API Token mới');
  console.log('3. Chọn quyền: Đọc giao dịch (read transactions)');
  console.log('4. Copy token và dán vào đây:\n');

  const token = await prompt('🔑 SePay API Token: ');
  if (!token || token.length < 10) {
    console.error('❌ Token không hợp lệ.');
    process.exit(1);
  }

  console.log('\n🔍 Xác minh token...');
  try {
    const res = await sePayRequest(token, { limit: 1 });
    if (res.status !== 200 && !res.transactions) throw new Error(res.message || 'Không xác minh được');
    console.log('✅ Token hợp lệ!');
    writeEnv({ SEPAY_API_TOKEN: token });
    console.log('💾 Đã lưu vào .env\n');
    console.log('Bước tiếp theo: node check-sepay.js --recent');
  } catch (e) {
    console.error('❌ Lỗi:', e.message);
  }
}

async function modeRecent() {
  const env = readEnv();
  const token = env.SEPAY_API_TOKEN;
  if (!token) { console.error('❌ Chưa có API token. Chạy: node check-sepay.js --setup'); process.exit(1); }

  console.log('\n📊 5 giao dịch gần nhất trong SePay:\n');
  const res = await sePayRequest(token, { limit: 5, sort: 'transaction_date,desc' });

  if (!res.transactions?.length) {
    console.log('  (Chưa có giao dịch nào)');
    return;
  }

  res.transactions.forEach((t, i) => {
    const sign   = t.transfer_type === 'in' ? '+' : '-';
    const amount = fmtVND(t.amount_in || t.amount_out || 0);
    console.log(`  ${i + 1}. ${sign}${amount}`);
    console.log(`     Nội dung: ${t.transaction_content || '(trống)'}`);
    console.log(`     Thời gian: ${t.transaction_date}`);
    console.log(`     Ngân hàng: ${t.bank_brand_name || t.bank_account_name || '—'}`);
    console.log('');
  });
}

async function modeCheck() {
  const env = readEnv();
  const token = env.SEPAY_API_TOKEN;

  if (!token) {
    console.error('❌ Chưa có SEPAY_API_TOKEN. Chạy: node check-sepay.js --setup');
    process.exit(1);
  }

  // Lấy amount và ref từ args hoặc hỏi interactive
  let amount = ARG_AMOUNT;
  let ref     = ARG_REF;

  if (!amount || !ref) {
    console.log('\n🧪 Test SePay Payment Integration');
    console.log('──────────────────────────────────');
    console.log('Hướng dẫn: Chuyển khoản thử nghiệm với nội dung và số tiền bên dưới,');
    console.log('script sẽ tự động xác nhận khi nhận được.\n');

    amount = amount || await prompt('💰 Số tiền test (VD: 1000): ');
    ref    = ref    || await prompt('📝 Mã tham chiếu (VD: TEST-001): ');
  }

  const amountNum = parseInt(amount.replace(/\D/g, ''), 10);
  if (!amountNum || amountNum < 1000) {
    console.error('❌ Số tiền phải ≥ 1.000đ');
    process.exit(1);
  }

  console.log('\n──────────────────────────────────────────');
  console.log(`💰 Số tiền:     ${fmtVND(amountNum)}`);
  console.log(`📝 Nội dung CK: ${ref}`);
  console.log('──────────────────────────────────────────');
  console.log('\n⏳ Đang đợi thanh toán (poll mỗi 5 giây)...');
  console.log('   Nhấn Ctrl+C để dừng\n');

  const POLL_INTERVAL = 5000; // 5 giây
  const TIMEOUT       = 5 * 60 * 1000; // 5 phút
  const startTime     = Date.now();
  let   attempt       = 0;

  const found = await new Promise((resolve) => {
    const timer = setInterval(async () => {
      attempt++;
      process.stdout.write(`\r   Lần ${attempt} — ${Math.round((Date.now() - startTime) / 1000)}s...`);

      // Timeout
      if (Date.now() - startTime > TIMEOUT) {
        clearInterval(timer);
        resolve(null);
        return;
      }

      try {
        const res = await sePayRequest(token, {
          limit: 20,
          sort: 'transaction_date,desc',
        });

        if (!res.transactions) return;

        const match = res.transactions.find(t => {
          const txAmount  = parseInt(t.amount_in || 0);
          const txContent = (t.transaction_content || '').toLowerCase();
          return txAmount === amountNum && txContent.includes(ref.toLowerCase());
        });

        if (match) {
          clearInterval(timer);
          resolve(match);
        }
      } catch {
        // Tiếp tục poll nếu có lỗi mạng nhất thời
      }
    }, POLL_INTERVAL);
  });

  console.log('');

  if (!found) {
    console.log('\n⏰ Timeout sau 5 phút — không tìm thấy giao dịch khớp.');
    console.log('Kiểm tra:');
    console.log('  - Nội dung chuyển khoản có chứa: ' + ref);
    console.log('  - Số tiền chính xác: ' + fmtVND(amountNum));
    console.log('  - API token có quyền đọc giao dịch');
    process.exit(1);
  }

  console.log('\n✅ THANH TOÁN XÁC NHẬN THÀNH CÔNG!\n');
  console.log('────────────────────────────────────');
  console.log(`💰 Số tiền:     ${fmtVND(found.amount_in || 0)}`);
  console.log(`📝 Nội dung:    ${found.transaction_content}`);
  console.log(`🏦 Ngân hàng:   ${found.bank_brand_name || found.bank_account_name || '—'}`);
  console.log(`🕐 Thời gian:   ${found.transaction_date}`);
  console.log('────────────────────────────────────');
  console.log('\n🎉 SePay integration hoạt động tốt!');
  console.log('🚀 Funnel đã sẵn sàng nhận đơn hàng thật.\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    if (MODE === 'setup')  await modeSetup();
    else if (MODE === 'recent') await modeRecent();
    else await modeCheck();
  } catch (e) {
    console.error('\n❌ Lỗi:', e.message);
    process.exit(1);
  }
})();
