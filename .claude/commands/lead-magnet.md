---
description: Tạo lead magnet độc lập (PDF checklist, cheat sheet, mini-course, quiz, template, swipe file) — không cần build funnel
argument-hint: [topic/type] VD: "checklist 30 câu hỏi đánh giá business" | "cheat sheet pottery" | "quiz tinh dầu"
agent: lead-magnet
---

<args>$ARGUMENTS</args>

## Vai trò

Tạo lead magnet asset standalone cho user chỉ muốn freebie, không cần full funnel.

## Pre-check

```
BUSINESS.md filled? (cần audience để magnet target đúng)
  → Trống → nhắc /start trước (hoặc hỏi nhanh audience + sản phẩm)
THEME.md filled? (cần brand cho PDF đẹp)
  → Trống → gợi ý /brand, hoặc dùng default minimal
```

## Execution

1. Load `agents/lead-magnet/agent.md`
2. Load `skills/content/lead-magnet/SKILL.md` (shared skill)
3. Detect magnet type từ args (KHÔNG menu cứng):
   - "checklist" → PDF checklist
   - "cheat sheet" → 1-2 trang dense PDF
   - "mini-course" / "khoá mini" → outline + video links
   - "quiz" → HTML interactive
   - "template" → file tải về + guide
   - "swipe file" / "bộ mẫu" → collection examples
   - Mơ hồ → hỏi mở (6 type)
4. Generate qua skill → apply THEME.md → render PDF (export-pdf.mjs cross-platform)
5. Output: `output/lead-magnet/{date}/{slug}/`
6. Suggest (không ép): "Muốn build opt-in page thu lead từ magnet này? → /funnel leads"

## Output

`output/lead-magnet/{YYYY-MM-DD}/{slug}/` — magnet.pdf + source.html + caption.md + SUMMARY.md

## Boundary

❌ KHÔNG build opt-in page/email — đó là /funnel leads
❌ KHÔNG dùng export-pdf.sh — dùng export-pdf.mjs (cross-platform)
❌ KHÔNG quên soft pitch slide cuối → sản phẩm chính
