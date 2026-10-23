# Deploy Scripts

Chạy được bởi Claude Code (Bash tool) hoặc trực tiếp trong terminal. Không cần framework — chỉ cần Node.js.

## Yêu cầu

```bash
node --version   # >= 16
```

Không cần `npm install` — tất cả dùng Node.js built-in modules.

---

## 4 Scripts

### 1. `generate-page.js` — Tạo HTML từ THEME.md

Đọc THEME.md → inject CSS variables + Google Fonts → xuất file HTML sẵn deploy.

```bash
node generate-page.js                        # leads funnel (mặc định)
node generate-page.js --type sales           # sales page
node generate-page.js --type thankyou        # thank you page
node generate-page.js --out my-page.html     # đặt tên file output
node generate-page.js --content content.json # điền nội dung từ JSON
```

**content.json format (optional):**
```json
{
  "brand":      "Tên thương hiệu",
  "headline":   "Headline chính",
  "subheadline":"Subheadline",
  "cta":        "Text nút CTA",
  "benefits":   ["Lợi ích 1", "Lợi ích 2", "Lợi ích 3"],
  "formFields": ["name", "email"],
  "formAction": "https://your-endpoint.com/submit"
}
```

---

### 2. `deploy.sh` — Deploy lên Vercel

```bash
bash deploy.sh           # preview deploy (URL test)
bash deploy.sh --prod    # production deploy
bash deploy.sh --help    # xem hướng dẫn
```

Tự động cài Vercel CLI nếu chưa có.

---

### 3. `setup-telegram.js` — Setup Telegram Bot

```bash
node setup-telegram.js          # interactive setup (lần đầu)
node setup-telegram.js --test   # test bot đã config
node setup-telegram.js --show   # xem config hiện tại
```

Tự động lấy Chat ID, gửi test message, lưu config vào `.env`.

---

### 4. `check-sepay.js` — Xác nhận thanh toán SePay

```bash
node check-sepay.js --setup                        # lấy và lưu API token
node check-sepay.js --recent                       # xem 5 giao dịch gần nhất
node check-sepay.js                                # interactive test
node check-sepay.js --amount 97000 --ref TEST-001  # test nhanh
```

Poll SePay API mỗi 5 giây, xác nhận khi nhận được giao dịch khớp amount + nội dung.

---

## Quy Trình Deploy Đầy Đủ

```bash
# Bước 1: Tạo HTML từ THEME.md
node generate-page.js --type leads --out index.html

# Bước 2: Mở index.html, điền nội dung vào phần TODO

# Bước 3: Deploy lên Vercel
bash deploy.sh --prod

# Bước 4: Setup Telegram (lần đầu)
node setup-telegram.js

# Bước 5: Test thanh toán SePay
node check-sepay.js --setup   # lấy API token (lần đầu)
node check-sepay.js --amount 1000 --ref TEST-001
```

---

## File .env

Scripts tự tạo và đọc `.env` trong thư mục project:

```env
TELEGRAM_BOT_TOKEN=123456789:AAF...
TELEGRAM_CHAT_ID=-100123456789
SEPAY_API_TOKEN=your_sepay_token_here
```

**Quan trọng:** Thêm `.env` vào `.gitignore` — không commit token lên GitHub.
