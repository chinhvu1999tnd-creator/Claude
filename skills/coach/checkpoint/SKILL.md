---
name: coach-checkpoint
description: L2 execution flow — gọi Agent worker, đợi output, dừng review, hỏi user approve/sửa/skip, rồi tiếp bước. Đây là cốt lõi orchestration L2 của Coach.
---

# Coach Checkpoint Skill

## Khi Nào Dùng

Sau khi user approve plan từ `plan-generator/`, Coach chuyển sang execute mode. Mỗi bước trong plan đi qua flow này.

---

## Nguyên Tắc Vàng (Không Vi Phạm)

1. **MỘT BƯỚC, MỘT CHECKPOINT** — không bao giờ chạy 2 agent liên tiếp không dừng
2. **DỪNG TRƯỚC KHI TIẾP** — output bước N phải được user approve trước khi gọi agent bước N+1
3. **KHÔNG TỰ APPROVE** — Coach không bao giờ "thay" user duyệt output
4. **ROLLBACK SAFE** — nếu user reject, không tự động xoá output cũ — save vào output/{agent}/{date}-v2/

---

## Flow chi tiết (cho 1 bước)

```
[Step N: Đang chạy]
  ↓
1. Coach announce: "Bước N/T: Em bắt đầu chạy [Agent X] giờ. Việc cụ thể: [mô tả]. Thời gian estimate: [N phút]."
  ↓
2. User confirm "OK chạy" (hoặc skip nếu user đã pre-approve toàn plan)
  ↓
3. Coach invoke Agent X:
   - Đọc lại BUSINESS.md + THEME.md (latest)
   - Load agents/{agent-x}/agent.md
   - Load skills tương ứng
   - Execute task với params từ plan
  ↓
4. Agent X chạy, output ra output/{agent-x}/{date}/...
  ↓
5. Coach announce: "✓ Bước N xong. Output: [link tới file]. 
   Anh/chị xem thử và cho em biết: [A] Duyệt, [B] Sửa, [C] Skip Bước N+1"
  ↓
6. Wait for user response
  ↓
   ├─ [A] Duyệt:
   │    → Mark Bước N = ✓ done trong active-plan.md
   │    → Coach: "OK, em chuyển sang Bước N+1. Em bắt đầu nhé?"
   │    → Back to step 1 cho bước kế
   │
   ├─ [B] Sửa:
   │    → Coach hỏi: "Sửa gì cụ thể ạ?"
   │    → User feedback
   │    → Coach invoke Agent X lại với feedback → output v2
   │    → Quay lại step 5
   │
   └─ [C] Skip:
        → Coach warn: "Skip Bước N có thể ảnh hưởng Bước [Y, Z] vì [lý do]. 
           Anh/chị chắc chắn skip không?"
        → Y: mark skipped → tiếp Bước N+1 (warn user)
        → N: quay lại step 5
```

---

## Save checkpoint state

**File**: `output/coach/active-plan.md`

**Format**:
```markdown
# Active Plan — [Mục tiêu]
Started: 2026-05-27 10:30
Target: Sẵn sàng bán trong 1 tuần

## Steps

- [x] Bước 1: Offer Agent — đóng gói sản phẩm — DONE 2026-05-27 11:45
      Output: output/offer/2026-05-27/offer-package.md
      Approved by user at 2026-05-27 12:00

- [x] Bước 2: Brand Agent — verify THEME — DONE 2026-05-27 12:15
      Output: output/brand/2026-05-27/brand-book.html
      Approved by user

- [~] Bước 3: Sale Funnel Agent — IN PROGRESS (started 2026-05-27 14:00)
      Output: pending

- [ ] Bước 4: Post Content Agent — PENDING

...
```

Mỗi lần user duyệt hoặc skip, update file này NGAY (không batch).

---

## Audit Log

**File**: `output/coach/checkpoints-{YYYY-MM-DD}.md`

Append mỗi sự kiện checkpoint:

```
[2026-05-27 11:45:23] Step 1 completed
  Agent: offer-agent
  Output: output/offer/2026-05-27/offer-package.md
  Duration: 1h 15min
  Status: pending review

[2026-05-27 12:00:14] Step 1 approved by user
  Notes: "Giá có thể tăng lên 1.5tr"
  Action: update BUSINESS.md, proceed to Step 2
```

→ Dùng cho debug nếu user complain "kit chạy kỳ"

---

## Special Cases

### User vắng giữa chừng (kit idle 30 phút giữa 2 step)

Khi user gõ `/coach next` lần kế:
- Đọc active-plan.md
- "Em thấy Bước 3 vẫn chưa làm. Anh/chị muốn em chạy Bước 3 (Sale Funnel) tiếp không, hay đổi mục tiêu?"

### Output Agent worker bị fail

- Coach catch error → log vào checkpoints-{date}.md
- Coach: "Bước N gặp lỗi: [error]. Em đề xuất:
   (A) Retry — em chạy lại Agent
   (B) Skip bước này, làm thủ công sau
   (C) Debug — xem chi tiết log"

### User muốn "fast forward" — đã có sẵn output trước đó

- Coach detect khi user nói "Bước này anh đã có rồi, paste em xem"
- User paste file path hoặc content
- Coach mark step done, không re-execute

### Plan dài (8+ bước) — user mệt giữa chừng

- Sau Bước 4 hoặc 5, Coach proactive hỏi: "Anh/chị cần nghỉ không? Em save plan, lúc nào quay lại gõ /coach next là tiếp."

---

## Tone trong checkpoint

- **Khi announce bắt đầu**: nhẹ nhàng, time estimate honest
  > "Bước 3/8: Em chạy Sale Funnel Agent. Việc này hơi lâu (~90 phút) vì cần build sales page + setup payment + email delivery. Em chạy giờ nhé?"

- **Khi done**: praise nhẹ + chỉ rõ output
  > "✓ Xong rồi anh/chị. Sales page deployed tại [URL]. Em đã setup:
   > - SePay webhook → confirm payment tự động
   > - Email delivery sau khi mua
   > - Telegram alert mỗi đơn về
   > Anh/chị xem trang xong cho em biết duyệt nhé?"

- **Khi reject**: không defensive, hỏi cụ thể
  > "OK anh/chị muốn sửa gì? Mô tả cụ thể giúp em (vd: 'Heading section đổi thành...', 'Bonus thêm 1 cái...')"

---

## Boundary

❌ KHÔNG chạy 2 step liên tiếp không có user approval giữa chừng (kể cả user đã "pre-approve toàn plan")
❌ KHÔNG hide error — nếu Agent fail, show user
❌ KHÔNG skip update active-plan.md sau mỗi action — state phải luôn fresh
❌ KHÔNG retry quá 2 lần — sau 2 lần fail, đề xuất debug hoặc skip
