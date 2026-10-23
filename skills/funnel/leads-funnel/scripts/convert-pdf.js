#!/usr/bin/env node
/**
 * convert-pdf.js
 * Convert lead magnet HTML → PDF bằng Playwright (Chromium)
 *
 * Cách dùng:
 *   node skills/funnel/leads-funnel/scripts/convert-pdf.js <đường-dẫn-file.html>
 *
 * Ví dụ:
 *   node skills/funnel/leads-funnel/scripts/convert-pdf.js \
 *     output/funnel/leads/10-ai-agents-claude-code/assets/lead-magnet.html
 *
 * Output: cùng folder, cùng tên, đuôi .pdf
 *
 * Cài đặt lần đầu (tự động):
 *   npm install playwright
 *   npx playwright install chromium
 */

const path = require('path');
const fs   = require('fs');
const { spawnSync } = require('child_process');

const green  = s => `\x1b[32m${s}\x1b[0m`;
const yellow = s => `\x1b[33m${s}\x1b[0m`;
const red    = s => `\x1b[31m${s}\x1b[0m`;
const bold   = s => `\x1b[1m${s}\x1b[0m`;

function ensurePlaywright() {
  try {
    require('playwright');
    return;
  } catch {
    console.log(`\n${yellow('⚠️')}  Playwright chưa cài. Đang cài...\n`);
    const install = spawnSync('npm install playwright', {
      shell: true, stdio: 'inherit', cwd: process.cwd()
    });
    if (install.status !== 0) {
      console.log(`${red('❌')} Không thể cài playwright. Chạy thủ công: npm install playwright`);
      process.exit(1);
    }
    console.log(`\n${yellow('⚠️')}  Đang tải Chromium browser...\n`);
    const browser = spawnSync('npx playwright install chromium', {
      shell: true, stdio: 'inherit', cwd: process.cwd()
    });
    if (browser.status !== 0) {
      console.log(`${red('❌')} Không tải được Chromium. Chạy thủ công: npx playwright install chromium`);
      process.exit(1);
    }
  }
}

async function main() {
  const htmlArg = process.argv[2];

  if (!htmlArg) {
    console.log(`\nCách dùng:\n  node convert-pdf.js <đường-dẫn-file.html>\n`);
    process.exit(1);
  }

  const htmlPath = path.resolve(process.cwd(), htmlArg);

  if (!fs.existsSync(htmlPath)) {
    console.log(`${red('❌')} Không tìm thấy file: ${htmlPath}`);
    process.exit(1);
  }

  const pdfPath = htmlPath.replace(/\.html$/, '.pdf');

  ensurePlaywright();

  const { chromium } = require('playwright');

  console.log(`\n📄 Converting: ${path.basename(htmlPath)}`);

  const browser = await chromium.launch();
  const page    = await browser.newPage();

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Chờ fonts load xong
  await page.waitForFunction(() => document.fonts.ready);

  await page.pdf({
    path:              pdfPath,
    format:            'A4',
    printBackground:   true,
    margin:            { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  });

  await browser.close();

  const sizeKB = Math.round(fs.statSync(pdfPath).size / 1024);
  console.log(`${green('✅')} PDF đã tạo: ${bold(path.relative(process.cwd(), pdfPath))} (${sizeKB} KB)\n`);
}

main().catch(e => {
  console.error(`${red('❌')} Lỗi: ${e.message}`);
  process.exit(1);
});
