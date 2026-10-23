# AI Agent Business Kit — BASIC

> **Bộ AI Agent giúp bạn ra đơn hàng đầu tiên trong 7 ngày.**
> 12 AI Agent chuyên biệt + Customer Portal tự host + Tự động hoá payment & email.

**Phiên bản: BASIC v1.0.0** · Giá: 699.000 VND · Mua một lần, dùng mãi mãi.

---

## ⚡ Bắt đầu trong 3 phút

```bash
# 1. Giải nén kit
unzip ai-business-kit-basic-v1.0.0.zip
cd ai-business-kit-basic-v1.0.0

# 2. Cài dependencies (lần đầu duy nhất, ~2 phút)
npm install
npx playwright install chromium   # cho render PDF lead magnet + image card

# 3. Mở trong Claude Code (hoặc Cursor / Antigravity)
claude

# 4. Gõ lệnh đầu tiên
/start
```

> 💡 Nếu quên bước 2, Coach Agent sẽ tự nhắc + chạy `npm install` giúp khi anh/chị gõ `/start`.

**Coach Agent sẽ làm hết phần còn lại:**
- Hỏi bạn về business → tự tạo `BUSINESS.md`
- Hỏi về brand → tự tạo `THEME.md` (màu, font)
- Setup Customer Portal (Supabase + Vercel + SePay) — *bạn chỉ cần 3 API token, ~15 phút*
- Tạo plan 30 ngày dùng kit
- Bắt đầu chạy Agent đầu tiên theo plan

---

## 🎯 12 AI Agent bạn nhận được

### 1 Coach Agent — não bộ điều phối
Bạn nói **"muốn bán sản phẩm X"** → Coach lên plan 8 bước → chạy từng Agent → dừng cho bạn duyệt sau mỗi bước → đến khi bạn có funnel hoàn chỉnh sẵn sàng bán.

### 11 Worker Agents — mỗi Agent một việc

| Agent | Công việc |
|-------|-----------|
| **Offer** | Nghiên cứu thị trường, phân tích đối thủ, đóng gói sản phẩm |
| **Brand** | Brand book + logo SVG + bộ màu/font website |
| **Post Content** | Bài đăng FB/IG/LinkedIn + carousel 10 slide + quote card |
| **Simple Reels** | Video ngắn 15-30s 1 cảnh, MP4 ready upload TikTok/Reels |
| **Leads Funnel** | Trang opt-in + PDF lead magnet + email 7-day nurture *(bundled)* |
| **Sale Funnel** | Trang bán hàng + SePay payment + auto-delivery email *(bundled)* |
| **Booking Funnel** | Trang đặt lịch + email confirm + reminder *(bundled)* |
| **CRM & Affiliate** | Setup affiliate program + tracking + member dashboard |
| **Ads Content** | Ad copy + headlines + creative brief (FB/TikTok/Google) |
| **Sale DM** | Kịch bản inbox/Zalo: response, objection, closing, follow-up |
| **Analysis** | Báo cáo doanh thu + social analytics + đề xuất tối ưu |

---

## 📦 Bạn cũng nhận được

### Customer Portal (tặng kèm — ship đầy đủ feature)

- **Next.js + Supabase + Vercel** — self-host, data thuộc về bạn 100%
- **Quản lý orders + customers + affiliate** — dashboard đẹp
- **Auto-deliver sản phẩm** sau khi khách thanh toán SePay
- **Magic link login** cho khách (Resend)
- **Email sequences** (Brevo): lead nurture, onboarding, abandoned cart

Coach Agent **tự setup giúp bạn** — bạn chỉ cần:
1. Tạo 3 API token (Supabase + Vercel + Resend) — *5 phút*
2. Paste vào prompt khi Coach hỏi
3. Đợi Coach chạy ~15 phút
4. Cấu hình webhook SePay (paste URL) — *3 phút*

→ **Customer Portal online + chạy hoàn toàn tự động** sau ~25 phút setup.

---

## 🛠 Yêu cầu hệ thống

| Phần mềm | Bắt buộc |
|----------|----------|
| **Node.js 18+** | ✅ — kit chạy script Node |
| **Claude Code** (hoặc Cursor / Antigravity) | ✅ — IDE chạy AI Agent |
| **Tài khoản Supabase** (free tier OK) | ✅ — database Portal |
| **Tài khoản Vercel** (free tier OK) | ✅ — hosting Portal |
| **Tài khoản Resend** (free 3000 emails/tháng) | ✅ — magic link |
| **Tài khoản SePay** | ✅ — nhận payment VietQR |
| **Tài khoản Brevo** (free 300 emails/ngày) | Khuyến nghị | nếu muốn email sequences |
| **Tài khoản Telegram Bot** | Khuyến nghị | nhận thông báo đơn hàng |
| **API key OpenAI** | Tuỳ chọn | nếu muốn generate image cho content |

---

## 📋 Commands

Sau khi `/start` xong, bạn có thể dùng:

| Command | Để làm gì |
|---------|-----------|
| `/coach` | Mở Coach giữa chừng — hỏi "tiếp theo làm gì" hoặc tạo plan mới |
| `/offer` | Đóng gói sản phẩm + research |
| `/brand` | Update brand identity / logo |
| `/content post` | Tạo bài đăng + carousel |
| `/content reels` | Tạo video ngắn 1 cảnh |
| `/funnel leads` | Build phễu thu lead (opt-in + magnet + nurture) |
| `/funnel sales` | Build phễu bán hàng (sales page + payment + delivery) |
| `/funnel booking` | Build phễu đặt lịch tư vấn |
| `/ads` | Tạo ad copy cho FB/TikTok/Google |
| `/sales` | Tạo kịch bản DM/inbox/Zalo |
| `/analyze` | Báo cáo doanh thu + đề xuất tối ưu |
| `/setup` | Re-run setup từng tích hợp (Supabase, SePay, ...) |

---

## 📁 Cấu trúc kit

```
ai-business-kit-basic-v1.0.0/
├── CLAUDE.md                    ← instructions cho AI assistant
├── README.md                    ← file này
├── BUSINESS.md                  ← thông tin business (Coach giúp điền)
├── THEME.md                     ← brand colors/fonts (Coach giúp điền)
├── .env.example                 ← template env vars
├── agents/                      ← 12 AI Agent definitions
│   ├── coach/
│   ├── offer/
│   ├── brand/
│   └── ...
├── skills/                      ← thư viện capability dùng chung
│   ├── copywriting/
│   ├── coach/
│   ├── setup/
│   ├── content/
│   ├── funnel/
│   ├── email-marketing/
│   ├── sales/
│   ├── ads/
│   ├── slide-html/
│   ├── design/
│   ├── analysis/
│   ├── deliver/
│   └── integrations/
├── apps/
│   └── customer-portal/         ← Customer Portal (Next.js)
│       ├── App.tsx
│       ├── supabase/
│       ├── setup.mjs
│       └── ...
├── .claude/
│   └── commands/                ← slash commands
└── output/                      ← Agent ghi output ra đây
    ├── offer/
    ├── content/
    └── funnel/
```

---

## 🚀 Roadmap sử dụng kit (30 ngày)

Coach Agent sẽ tạo plan cụ thể cho **business của bạn**. Đây là ví dụ chung:

| Tuần | Mục tiêu | Agent dùng |
|------|----------|------------|
| **1** | Setup + Đóng gói offer | Coach (onboarding + Portal) → Offer → Brand |
| **2** | Build phễu đầu tiên | Sale Funnel hoặc Leads Funnel + CRM setup |
| **3** | Tạo content & ads | Post Content + Simple Reels + Ads Content |
| **4** | Bán + Phân tích | Sale DM (chốt khách inbox) + Analysis |

---

## ❓ FAQ

**Q: Tôi không biết code, dùng được không?**
A: Được. Coach Agent hướng dẫn bạn từng bước, bạn chỉ cần trả lời câu hỏi tiếng Việt. Mọi script tự động chạy.

**Q: Customer Portal có tốn tiền hosting không?**
A: Không. Supabase free tier (500MB DB) + Vercel free tier (100GB bandwidth) đủ cho ~10.000 khách. Khi scale lên có thể upgrade.

**Q: Có support không?**
A: Có. Email: support@... — phản hồi trong 24h. Group Zalo private cho khách BASIC.

**Q: Có thể upgrade lên PRO sau không?**
A: Có. Chuyển khoản phần chênh lệch (1.300.000 VND) — tự động unlock PRO agents thêm vào cùng kit.

**Q: Kit này khác gì các template miễn phí khác?**
A: Đây là **AI Agent system**, không phải template tĩnh. Mỗi lần bạn dùng, Agent tự sinh nội dung phù hợp với business của bạn — không phải copy-paste template cứng.

---

## 📞 Liên hệ & Support

- **Email**: support@... (cập nhật trong BUSINESS.md của tác giả)
- **Group Zalo BASIC**: link gửi sau khi mua
- **Documentation**: đọc `CLAUDE.md` để hiểu chi tiết các Agent

---

**Chúc bạn ra đơn đầu tiên thành công! 🚀**
