#!/usr/bin/env node
/**
 * generate-page.js
 * Đọc THEME.md → inject CSS variables + Google Fonts → xuất HTML template sẵn deploy
 *
 * Cách dùng:
 *   node generate-page.js                        → tạo index.html (leads funnel mặc định)
 *   node generate-page.js --type sales           → sales page template
 *   node generate-page.js --type thankyou        → thank you page
 *   node generate-page.js --out my-page.html     → đặt tên file output
 *   node generate-page.js --content content.json → điền nội dung từ file JSON
 */

const fs = require('fs');
const path = require('path');

// ─── Parse CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const PAGE_TYPE = getArg('--type') || 'leads';
const OUT_FILE  = getArg('--out')  || 'index.html';
const CONTENT_FILE = getArg('--content') || null;

// ─── Tìm THEME.md ─────────────────────────────────────────────────────────────
function findThemeMd() {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, 'THEME.md');
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }
  return null;
}

// ─── Parse CSS variables từ THEME.md ─────────────────────────────────────────
function parseTheme(themePath) {
  const raw = fs.readFileSync(themePath, 'utf8');

  // Extract Google Fonts URL
  const fontsMatch = raw.match(/href="(https:\/\/fonts\.googleapis\.com[^"]+)"/);
  const fontsUrl = fontsMatch ? fontsMatch[1] : null;

  // Extract CSS variables block
  const cssBlock = raw.match(/```css([\s\S]*?)```/);
  const cssRaw = cssBlock ? cssBlock[1] : '';

  // Parse individual variables
  const vars = {};
  const varPattern = /--([\w-]+):\s*([^;]+);/g;
  let m;
  while ((m = varPattern.exec(cssRaw)) !== null) {
    vars[m[1]] = m[2].trim();
  }

  return { fontsUrl, vars, cssRaw };
}

// ─── Load content JSON (optional) ─────────────────────────────────────────────
function loadContent(contentFile) {
  const defaults = {
    brand:      'Thương Hiệu',
    headline:   'Headline chính — chỉnh lại nội dung này',
    subheadline:'Subheadline hỗ trợ — mô tả ngắn gọn giá trị',
    cta:        'Nhận Miễn Phí Ngay',
    benefits:   ['Lợi ích 1', 'Lợi ích 2', 'Lợi ích 3'],
    formFields: ['name', 'email'],
    formAction: '#',
  };
  if (!contentFile || !fs.existsSync(contentFile)) return defaults;
  try {
    return { ...defaults, ...JSON.parse(fs.readFileSync(contentFile, 'utf8')) };
  } catch {
    console.warn('⚠️  Không đọc được content.json — dùng nội dung mặc định.');
    return defaults;
  }
}

// ─── Template HTML theo page type ─────────────────────────────────────────────
function buildLeadsPage(theme, content) {
  const { fontsUrl, vars, cssRaw } = theme;
  const benefits = content.benefits.map(b =>
    `<li>✓ ${b}</li>`).join('\n            ');
  const formFields = content.formFields.map(f => f === 'name'
    ? `<input type="text" name="name" placeholder="Họ và tên" required>`
    : f === 'email'
    ? `<input type="email" name="email" placeholder="Email của bạn" required>`
    : `<input type="tel" name="phone" placeholder="Số điện thoại">`
  ).join('\n            ');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.headline} | ${content.brand}</title>
  <meta name="description" content="${content.subheadline}">
${fontsUrl ? `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">` : ''}
  <style>
    /* ── THEME VARIABLES (từ THEME.md) ───────────────────── */
    ${cssRaw.trim()}

    /* ── RESET & BASE ────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-body, 'Inter', sans-serif);
      background: var(--color-bg, #fff);
      color: var(--color-text-body, #374151);
      line-height: var(--lh-body, 1.6);
    }
    h1, h2, h3 {
      font-family: var(--font-heading, 'Inter', sans-serif);
      color: var(--color-text-head, #111827);
      letter-spacing: var(--ls-heading, -0.02em);
      line-height: var(--lh-heading, 1.1);
    }

    /* ── LAYOUT ──────────────────────────────────────────── */
    .container { max-width: 680px; margin: 0 auto; padding: 0 24px; }

    /* ── HERO ────────────────────────────────────────────── */
    .hero {
      padding: var(--section-pad, 80px 24px);
      text-align: center;
    }
    .hero h1 { font-size: clamp(28px, 5vw, 56px); font-weight: var(--fw-heading, 900); margin-bottom: 20px; }
    .hero p  { font-size: 18px; color: var(--color-text-muted, #6b7280); margin-bottom: 40px; max-width: 560px; margin-left: auto; margin-right: auto; }

    /* ── BENEFITS ────────────────────────────────────────── */
    .benefits { text-align: left; margin: 0 auto 40px; max-width: 480px; }
    .benefits ul { list-style: none; }
    .benefits li { padding: 8px 0; font-size: 16px; }

    /* ── FORM ────────────────────────────────────────────── */
    .opt-in-form { display: flex; flex-direction: column; gap: 12px; max-width: 420px; margin: 0 auto; }
    .opt-in-form input {
      padding: 14px 16px;
      border: 1.5px solid var(--color-light-gray, #e8e6dc);
      border-radius: var(--radius-input, 6px);
      background: var(--color-surface, #f8f9fa);
      color: var(--color-text-body, #374151);
      font-family: var(--font-body, 'Inter', sans-serif);
      font-size: 15px;
    }
    .opt-in-form input:focus { outline: none; border-color: var(--color-primary, #B6FF00); }
    .btn-primary {
      background: var(--color-primary, #B6FF00);
      color: var(--color-cta-text, #141413);
      border: none; cursor: pointer;
      padding: var(--btn-padding, 14px 32px);
      border-radius: var(--radius-btn, 6px);
      font-family: var(--font-heading, 'Inter', sans-serif);
      font-size: 16px; font-weight: 700;
      transition: box-shadow 0.2s;
    }
    .btn-primary:hover { box-shadow: var(--shadow-btn, 0 0 20px rgba(182,255,0,0.3)); }
    .privacy { font-size: 13px; color: var(--color-text-muted, #6b7280); text-align: center; margin-top: 8px; }

    /* ── RESPONSIVE ──────────────────────────────────────── */
    @media (max-width: 480px) {
      .hero { padding: 60px 20px; }
      .hero h1 { font-size: 28px; }
    }
  </style>
</head>
<body>

  <!-- HERO + OPT-IN FORM -->
  <section class="hero">
    <div class="container">
      <!-- TODO: thêm mockup image ở đây nếu có -->
      <!-- <img src="mockup.png" alt="Preview" style="max-width:280px;margin-bottom:32px;"> -->

      <h1>${content.headline}</h1>
      <p>${content.subheadline}</p>

      <div class="benefits">
        <ul>
            ${benefits}
        </ul>
      </div>

      <form class="opt-in-form" action="${content.formAction}" method="POST">
            ${formFields}
        <button type="submit" class="btn-primary">${content.cta}</button>
        <p class="privacy">🔒 Không spam. Hủy bất cứ lúc nào.</p>
      </form>
    </div>
  </section>

  <!-- TODO: thêm sections bên dưới (social proof, about, FAQ) nếu cần -->

</body>
</html>`;
}

function buildSalesPage(theme, content) {
  const { fontsUrl, vars, cssRaw } = theme;
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.headline} | ${content.brand}</title>
${fontsUrl ? `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">` : ''}
  <style>
    ${cssRaw.trim()}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-body,'Inter',sans-serif); background: var(--color-bg,#fff); color: var(--color-text-body,#374151); line-height: var(--lh-body,1.6); }
    h1,h2,h3 { font-family: var(--font-heading,'Inter',sans-serif); color: var(--color-text-head,#111827); letter-spacing: var(--ls-heading,-0.02em); }
    .container { max-width: 760px; margin: 0 auto; padding: 0 24px; }
    section { padding: var(--section-pad,80px 24px); }
    .hero { text-align:center; }
    .hero h1 { font-size: clamp(28px,5vw,52px); font-weight: var(--fw-heading,900); margin-bottom:20px; }
    .hero p { font-size:18px; color:var(--color-text-muted,#6b7280); margin-bottom:40px; }
    .btn-primary { display:inline-block; background:var(--color-primary,#B6FF00); color:var(--color-cta-text,#141413); padding:var(--btn-padding,14px 32px); border-radius:var(--radius-btn,6px); font-family:var(--font-heading,'Inter',sans-serif); font-size:16px; font-weight:700; text-decoration:none; border:none; cursor:pointer; }
    .btn-primary:hover { box-shadow:var(--shadow-btn,0 0 20px rgba(182,255,0,0.3)); }
    /* TODO: thêm styles cho các section: benefits, testimonials, pricing, guarantee, FAQ */
  </style>
</head>
<body>

  <!-- HERO -->
  <section class="hero">
    <div class="container">
      <h1>${content.headline}</h1>
      <p>${content.subheadline}</p>
      <a href="#order-form" class="btn-primary">${content.cta}</a>
    </div>
  </section>

  <!-- TODO: Benefits Section -->
  <!-- TODO: Social Proof / Testimonials -->
  <!-- TODO: Pricing + Order Form -->
  <!-- TODO: Guarantee -->
  <!-- TODO: FAQ -->
  <!-- TODO: Final CTA -->

</body>
</html>`;
}

function buildThankYouPage(theme, content) {
  const { fontsUrl, vars, cssRaw } = theme;
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cảm ơn anh/chị! | ${content.brand}</title>
${fontsUrl ? `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">` : ''}
  <style>
    ${cssRaw.trim()}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-body,'Inter',sans-serif); background: var(--color-bg,#fff); color: var(--color-text-body,#374151); line-height: var(--lh-body,1.6); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    h1,h2 { font-family: var(--font-heading,'Inter',sans-serif); color: var(--color-text-head,#111827); letter-spacing: var(--ls-heading,-0.02em); }
    .container { max-width: 600px; padding: 48px 24px; text-align: center; }
    .check { font-size: 56px; margin-bottom: 24px; }
    h1 { font-size: clamp(24px,4vw,40px); font-weight: var(--fw-heading,900); margin-bottom: 16px; }
    .delivery-box { background: var(--color-surface,#f8f9fa); border-radius: var(--radius-card,8px); padding: 24px; margin: 32px 0; text-align: left; }
    .delivery-box h2 { font-size: 18px; margin-bottom: 12px; }
    .quick-win { border-left: 3px solid var(--color-primary,#B6FF00); padding-left: 16px; margin: 32px 0; text-align: left; font-style: italic; }
    .btn-next { display: inline-block; background: var(--color-primary,#B6FF00); color: var(--color-cta-text,#141413); padding: var(--btn-padding,14px 32px); border-radius: var(--radius-btn,6px); font-family: var(--font-heading,'Inter',sans-serif); font-size: 16px; font-weight: 700; text-decoration: none; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="check">✅</div>
    <h1>Đăng ký thành công!</h1>
    <p>Tài liệu đang trên đường đến với anh/chị.</p>

    <!-- DELIVERY INSTRUCTIONS -->
    <div class="delivery-box">
      <h2>📧 Nhận tài liệu thế nào?</h2>
      <!-- TODO: chọn 1 trong 3 bên dưới, xóa phần còn lại -->

      <!-- Option A: Email -->
      <p>Kiểm tra hộp thư — email từ <strong>${content.brand}</strong> sẽ đến trong 2 phút.<br>
      Không thấy? Check thư mục <strong>Spam</strong> và nhấn "Không phải spam".</p>

      <!-- Option B: Zalo OA
      <p>Mở Zalo → tìm OA "<strong>[Tên OA]</strong>" → nhấn Theo dõi<br>
      → tài liệu sẽ được gửi ngay trong Zalo.</p>
      <a href="[ZALO_OA_LINK]" class="btn-next" style="margin-top:16px;">Theo Dõi Zalo OA</a> -->

      <!-- Option C: Direct Download
      <a href="[DOWNLOAD_LINK]" class="btn-next" style="margin-top:16px;">Tải Về Ngay</a> -->
    </div>

    <!-- QUICK WIN TIP -->
    <div class="quick-win">
      <strong>Mẹo dùng ngay hôm nay:</strong><br>
      <!-- TODO: điền 1 tip ngắn liên quan đến topic lead magnet -->
      [Điền quick win tip tại đây — 2-3 câu actionable]
    </div>

    <!-- NEXT STEP CTA -->
    <!-- TODO: chọn 1 trong 3 bên dưới -->

    <!-- Option A: Dẫn vào group -->
    <p>Trong khi chờ, tham gia cộng đồng của chúng tôi:</p>
    <a href="[GROUP_LINK]" class="btn-next">Tham Gia Nhóm Miễn Phí</a>

    <!-- Option B: Xem video
    <p>Xem video này trước khi đọc tài liệu — sẽ giúp anh/chị hiệu quả hơn 3x:</p>
    <a href="[VIDEO_LINK]" class="btn-next">Xem Video Ngay</a> -->

    <!-- Option C: Đặt lịch
    <a href="[BOOKING_LINK]" class="btn-next">Đặt Lịch Tư Vấn Miễn Phí</a> -->

    <!-- TRIPWIRE (optional) -->
    <!--
    <div style="margin-top:48px; padding:32px; background:var(--color-surface,#f8f9fa); border-radius:var(--radius-card,8px);">
      <p style="font-size:12px;font-weight:700;letter-spacing:0.1em;color:var(--color-primary);">🎁 DÀNH RIÊNG CHO NGƯỜI VỪA ĐĂNG KÝ</p>
      <h2 style="margin:12px 0;">[Tên sản phẩm tripwire]</h2>
      <p>[Mô tả ngắn — 1-2 câu lợi ích]</p>
      <p><s>[Giá gốc]</s> → <strong>Chỉ [Giá tripwire] hôm nay</strong></p>
      <a href="[CHECKOUT_LINK]" class="btn-next" style="margin-top:16px;">Thêm Vào — Chỉ [Giá]</a>
      <br><a href="#" style="font-size:13px;color:var(--color-text-muted);margin-top:8px;display:block;">Không, cảm ơn</a>
    </div>
    -->
  </div>
</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('🔍 Tìm THEME.md...');
  const themePath = findThemeMd();

  if (!themePath) {
    console.error('❌ Không tìm thấy THEME.md. Chạy /setup trước để tạo file này.');
    process.exit(1);
  }

  console.log(`✅ Đọc theme từ: ${themePath}`);
  const theme = parseTheme(themePath);

  if (!theme.fontsUrl) {
    console.warn('⚠️  Không tìm thấy Google Fonts URL trong THEME.md — trang sẽ dùng font fallback.');
  }

  const content = loadContent(CONTENT_FILE);
  console.log(`📄 Tạo ${PAGE_TYPE} page...`);

  let html;
  switch (PAGE_TYPE) {
    case 'sales':    html = buildSalesPage(theme, content);   break;
    case 'thankyou': html = buildThankYouPage(theme, content); break;
    default:         html = buildLeadsPage(theme, content);    break;
  }

  fs.writeFileSync(OUT_FILE, html, 'utf8');
  console.log(`\n✅ Xong! File đã tạo: ${OUT_FILE}`);
  console.log('📝 Mở file và điền nội dung vào các phần TODO.');
  console.log('🚀 Sau đó chạy: bash deploy.sh');
}

main();
