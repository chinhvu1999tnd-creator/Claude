---
name: content-lead-magnet
description: Tạo lead magnet asset (PDF checklist, mini-course, cheat sheet, quiz, template, swipe file). Shared skill — dùng bởi Lead Magnet Agent (standalone) + Leads Funnel Agent (bundled).
---

# Lead Magnet Skill

## Khi Nào Dùng

- **Lead Magnet Agent** (`/lead-magnet`) — standalone, user chỉ muốn tạo magnet
- **Leads Funnel Agent** (`/funnel leads`) — bundled, magnet là 1 phần phễu

→ Single source of truth cho logic tạo magnet. Sửa 1 chỗ, cả 2 agent update.

## Nguyên Tắc

1. **Specific > generic**: magnet phải target niche + audience cụ thể (opt-in rate gấp 2-3x)
2. **Deliver value thật**: free nhưng phải đáng giá → build trust → soft pitch cuối
3. **Brand consistent**: apply THEME.md (color, font, logo)
4. **Soft pitch cuối**: slide/section cuối → CTA về sản phẩm chính (không hard sell)

## 7 Magnet Types

| Type | Format | Generation | Best for |
|------|--------|-----------|----------|
| **PDF Checklist** | 10-15 slide PDF | slide-html → PDF | "X bước/điều cần làm" |
| **Mini-course** | Outline + video links | PDF + video script | Educational, build authority |
| **Cheat Sheet** | 1-2 trang dense PDF | slide-html → PDF | Quick reference, tool/shortcut |
| **Quiz** | HTML interactive | HTML page | "Bạn thuộc nhóm nào?" engagement |
| **Template** | File tải về (Notion/Sheet/Doc) | Template + hướng dẫn | Save time, plug-and-play |
| **Swipe File** | Collection examples PDF | slide-html → PDF | "20 mẫu X để copy" |
| **Resource List** | Curated list PDF | slide-html → PDF | "50 tools/nguồn cho X" |

## Magnet Examples theo Niche (cho user pick gần nhất)

### Coach / Educator
- Checklist: "30 câu hỏi đánh giá business trong 10 phút"
- Mini-course: "3 video — tìm niche không tốn 1 đồng"
- Template: "Content calendar 30 ngày"

### E-commerce / Physical
- Style guide: "7 cách phối tinh dầu cho 7 ngày"
- Quiz: "Tinh dầu nào hợp bạn? (3 câu — 30s)"
- Discount: "Code FIRST15 giảm 15% đơn đầu"

### Service / Freelance
- Template: "Email template chốt khách lần đầu (5 scenarios)"
- Calculator: "Tool tính giá freelance fair"
- Audit: "1-2 trang feedback website free"

### Digital product
- Sample: "Free 1 trang từ template Notion 25-dashboard"
- Comparison: "Notion vs Obsidian — bảng 10 tiêu chí"

### Health / Wellness
- Meal plan: "Plan 7 ngày low-carb cho mẹ bỉm sữa VN"
- Routine: "Buổi sáng 15 phút cho người busy"

## Generation Flow

### PDF magnet (checklist/cheat sheet/swipe/resource)

```
Bước 1: Đọc BUSINESS.md (audience, voice, USP) + THEME.md (brand)

Bước 2: Magnet strategy
  → Detect type từ user input HOẶC hỏi:
    "Magnet anh/chị muốn là gì? (checklist / cheat sheet / mini-course / template / quiz / swipe file)"
  → Confirm value proposition: "[Audience] sẽ [đạt được X] sau khi đọc"

Bước 3: Generate slide deck (10-15 slide)
  → Load skills/slide-html/SKILL.md
  → Structure:
    - Cover: title đập + "Cho [audience] muốn [outcome]" + logo
    - Slide 2-3: Problem (vấn đề khách gặp)
    - Slide 4-12: Value/steps (1 ý/slide, 30 từ + visual)
    - Slide 13-14: Bonus tips
    - Slide 15: Soft pitch CTA → sản phẩm chính + discount code subscriber
  → Apply THEME.md (palette, font, logo)

Bước 4: Render PDF (CROSS-PLATFORM)
  → node skills/slide-html/scripts/export-pdf.mjs {html} {output.pdf}
  → ⚠️ Dùng .mjs (Node) — chạy Win/Mac/Linux. KHÔNG dùng .sh

Bước 5: Output
  → output/lead-magnet/{date}/{slug}/magnet.pdf
  → output/lead-magnet/{date}/{slug}/source.html (để edit sau)
  → output/lead-magnet/{date}/{slug}/caption.md (copy promote magnet)
```

### Quiz magnet (interactive)

```
→ Load skills/slide-html (HTML interactive mode)
→ Build quiz HTML: 3-5 câu → result categories → CTA opt-in/sản phẩm
→ Output: output/lead-magnet/{date}/{slug}/quiz.html (deploy được)
```

### Template magnet (file tải về)

```
→ Generate template content (Notion structure / Google Sheet layout / Doc)
→ Output hướng dẫn + link template (user tự share Notion/Sheet)
→ Hoặc PDF "how to use template" + template link
```

## Output Convention

`output/lead-magnet/{YYYY-MM-DD}/{slug}/`
- `magnet.pdf` (hoặc quiz.html / template-guide.pdf)
- `source.html` (edit lại nếu cần)
- `caption.md` (copy promote: FB post / DM / ads)
- `SUMMARY.md` (magnet type + value prop + soft pitch target)

## Soft Pitch (slide cuối — quan trọng)

Mỗi magnet kết bằng CTA về sản phẩm chính:
```
Slide cuối:
"Nếu bạn muốn đi sâu hơn:
 → [Tên sản phẩm chính] — [1 dòng value]
 → Discount {code} cho người tải magnet này
 → [Link sản phẩm]"
```
→ Magnet free build trust → convert sang paid. KHÔNG hard sell, chỉ soft invite.

## Boundary

❌ KHÔNG tạo magnet generic ("7 cách tăng doanh thu") — phải specific niche + audience
❌ KHÔNG skip soft pitch slide cuối — magnet không có CTA = lead nguội
❌ KHÔNG dùng export-pdf.sh (Unix only) — dùng export-pdf.mjs (cross-platform)
❌ KHÔNG quên apply THEME.md — magnet phải branded, không generic template
