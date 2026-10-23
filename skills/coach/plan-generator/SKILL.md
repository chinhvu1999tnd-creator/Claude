---
name: coach-plan-generator
description: Tạo plan N-bước dựa trên mục tiêu user — match với plan templates có sẵn hoặc generate từ scratch. Output bảng plan rõ ràng cho user duyệt.
---

# Coach Plan Generator Skill

## Khi Nào Dùng

- User nói mục tiêu cụ thể: "muốn bán X", "muốn thu lead cho Y", "muốn launch khoá học"
- `/coach plan "<mục tiêu>"` được gọi
- Sau onboarding xong, Coach cần generate plan cho mục tiêu user vừa khai
- User gõ `/coach next` mà không có active plan

---

## Nguyên Tắc

1. **Đọc context trước khi plan**: BUSINESS.md (sản phẩm, khách) + output/ (đã làm gì rồi) → KHÔNG plan lại bước user đã làm
2. **Plan ngắn, cụ thể**: 5-10 bước, mỗi bước 1 dòng nói rõ Agent nào + output file gì
3. **Time estimate thật**: Không hứa "2 giờ xong" nếu plan 8 bước cần research thị trường — ghi total time honest
4. **Template > Generate**: Match với template có sẵn trước (4 template phổ biến), chỉ generate from scratch nếu mục tiêu lạ

---

## 4 Plan Templates phổ biến

### Template 1: "Bán sản phẩm X" → Sales Funnel Plan

**Use when**: User nói "bán", "sales page", "bán khoá học", "bán dịch vụ", "ra đơn"

```
Bước 1: Offer Agent — đóng gói sản phẩm + research giá (60 phút)
  → Output: output/offer/{date}/offer-package.md

Bước 2: Brand Agent — verify THEME.md, tạo logo nếu thiếu (15-30 phút)
  → Output: output/brand/{date}/brand-book.html + logo.svg

Bước 3: Sale Funnel Agent — build sales page (90-120 phút)
  → Output: output/funnel/{date}/sales-page/ (HTML deployed)
  → Bundled: payment SePay + delivery email + Telegram notify

Bước 4: Post Content Agent — 5 bài giới thiệu sản phẩm (45 phút)
  → Output: output/content/{date}/posts/ (FB/IG/LinkedIn)

Bước 5: Simple Reels Agent — 3 video ngắn 1 cảnh (30 phút)
  → Output: output/content/{date}/reels/*.mp4

Bước 6: Ads Content Agent — 5 ad copy cho FB/TikTok (30 phút)
  → Output: output/ads/{date}/ad-copies.md

Bước 7: Sale DM Agent — 7 kịch bản chốt qua inbox (20 phút)
  → Output: output/sales/{date}/dm-scripts.md

Bước 8: CRM & Affiliate Agent — setup CRM + tracking pixel (15 phút)
  → Output: snippet trong sales page + Customer Portal connected

Bước 9: Analysis Agent — setup baseline metrics + dashboard (10 phút)
  → Output: output/analysis/{date}/baseline.md

Total: ~5-7 giờ work (chia 2-3 ngày), bán được trong 1 tuần.
```

### Template 2: "Thu lead cho khoá học X" → Leads Funnel Plan

**Use when**: User nói "thu lead", "opt-in", "lead magnet", "email list", "free webinar đăng ký"

```
Bước 1: Offer Agent — research audience + đóng gói lead magnet (45 phút)
  → Output: ý tưởng PDF/checklist + value proposition cho opt-in

Bước 2: Brand Agent — verify THEME.md (15 phút)

Bước 3: Leads Funnel Agent — build opt-in page + auto-generate PDF magnet + setup 7-day nurture (120 phút)
  → Output: opt-in page deployed + PDF + 5 emails nurture

Bước 4: Post Content Agent — 5 bài driving traffic về opt-in (45 phút)

Bước 5: Ads Content Agent — 3 ad copy lead gen (20 phút)

Bước 6: Analysis Agent — setup lead tracking + conversion baseline (10 phút)

Total: ~4 giờ work, list-building chạy được trong 2 ngày.
```

### Template 3: "Đặt lịch tư vấn 1-1" → Booking Funnel Plan

**Use when**: User nói "đặt lịch", "booking", "tư vấn 1-1", "discovery call", "coaching session"

```
Bước 1: Offer Agent — đóng gói gói tư vấn + xác định free vs paid (30 phút)

Bước 2: Brand Agent — verify (15 phút)

Bước 3: Booking Funnel Agent — build trang booking + Cal.com/Calendly setup + email confirm + reminder (90 phút)
  → Output: booking page deployed + email sequence

Bước 4: Post Content Agent — 5 bài positioning expert (60 phút)

Bước 5: Sale DM Agent — kịch bản DM mời booking + follow-up (20 phút)

Bước 6: Analysis Agent — setup booking conversion tracking (10 phút)

Total: ~3-4 giờ work.
```

### Template 4: "Chỉ muốn build brand + content" → Content Plan

**Use when**: User nói "chưa có sản phẩm", "muốn build personal brand", "tạo content trước"

```
Bước 1: Offer Agent — research niche + position personal brand (60 phút)

Bước 2: Brand Agent — full brand book + logo (45 phút)

Bước 3: Post Content Agent — 10 bài content pillar (90 phút)

Bước 4: Simple Reels Agent — 5 video ngắn (60 phút)

Bước 5: Analysis Agent — baseline social analytics (10 phút)

Total: ~4-5 giờ. Sau 30 ngày posting, anh/chị có audience để bán sản phẩm sau.
```

---

## Generate từ Scratch (khi 4 template không khớp)

**Nếu mục tiêu user không match template**, tự generate:

1. **Identify mục tiêu** — user muốn output cuối cùng là gì?
2. **Backward plan** — từ mục tiêu, ngược về các bước cần làm
3. **Match từng bước với Agent có sẵn trong BASIC** (12 agent — không recommend agent của tier PRO/ALL)
4. **Time estimate** dựa trên rubric:
   - Agent research/strategy: 30-60 phút
   - Agent build trang (funnel): 60-120 phút
   - Agent tạo content (post/reels): 30-60 phút
   - Agent setup integration: 10-15 phút

**Nếu generate xong mà cần Agent tier PRO/ALL** (vd: Webinar, Launch, Community):
- Note rõ trong plan: "Bước X cần Webinar Funnel Agent — có trong gói PRO"
- Suggest alternative: "Hoặc dùng Booking Funnel (BASIC) cho 1-1 webinar"

---

## Format Output Plan

Hiển thị cho user dạng bảng đẹp:

```
📋 Plan: [Mục tiêu cụ thể]

| Bước | Agent | Việc | Thời gian | Output |
|------|-------|------|-----------|--------|
| 1 | Offer | Đóng gói sản phẩm | 60 phút | offer-package.md |
| 2 | Brand | Verify brand | 15 phút | brand-book.html |
| ... |

⏱  Tổng: ~5-7 giờ work (chia 2-3 ngày)
🎯 Mục tiêu: Sẵn sàng bán trong 1 tuần

Anh/chị duyệt plan này không?
(A) OK chạy luôn Bước 1
(B) Em sửa Bước [X] thành...
(C) Để em làm sau, save plan thôi
```

---

## Save Plan

Sau khi user approve:

**Path**: `output/coach/active-plan.md`

**Content**: Plan đầy đủ + status mỗi bước (pending/in-progress/done/skipped)

Khi user gõ `/coach next` → đọc file này, identify bước "in-progress" hoặc "pending" đầu tiên → execute.

## Suggest /kit-help cuối plan

Sau khi plan completed (tất cả steps done), append vào response cuối:

```
"🎉 Plan '{tên plan}' đã hoàn thành!

Tóm tắt deliverables:
- {list outputs từ output/}

💡 Tip:
- Gõ `/kit-help` để xem TẤT CẢ commands có thể dùng tiếp
- Gõ `/coach plan '<mục tiêu mới>'` để tạo plan tiếp
- Gõ `/analyze optimize` để em đề xuất 3 actions optimize tuần tới"
```

---

## Edge Cases

**Plan có bước đã làm rồi:**
- Đọc output/ folder
- Detect: output/offer/{date}/ đã có → Bước Offer = ✓ DONE
- Plan output sẽ pre-mark các bước done, không bắt user làm lại

**User muốn skip Bước X:**
- OK, mark `skipped` trong active-plan.md
- Note rủi ro: "Bước X bị skip có thể ảnh hưởng Bước Y. Em vẫn tiếp tục Bước Y?"

**User reset plan giữa chừng:**
- `/coach plan "[mục tiêu mới]"` → archive plan cũ → output/coach/plan-{date}-archived.md
- Tạo plan mới
