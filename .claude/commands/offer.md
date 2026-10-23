---
description: Offer Agent — nghiên cứu thị trường, phân tích đối thủ, đóng gói offer
argument-hint: [ý định tự nhiên] VD: "research niche coaching" | "phân tích đối thủ X" | "đóng gói khóa học Y"
agent: offer
---

<args>$ARGUMENTS</args>

## Intent Detection

Đọc <args> và xác định task:

| Tín hiệu trong args | Task |
|--------------------|------|
| "research", "nghiên cứu", "validate", "niche", "tìm hướng", "thị trường", "tiềm năng" | → **market-research** |
| "competitor", "đối thủ", "cạnh tranh", "so sánh", "phân tích [tên người/brand]" | → **competitor-analysis** |
| "build", "xây", "đóng gói", "offer", "pricing", "giá", "value stack", "sản phẩm" | → **offer-packaging** |
| Không rõ | → Hỏi: "Anh/chị muốn: (A) Nghiên cứu niche, (B) Phân tích đối thủ, hay (C) Đóng gói offer?" |

---

## Execution

### market-research
1. Đọc `BUSINESS.md` — lấy audience và niche context
2. Load `agents/offer/agent.md`
3. Load `skills/offer/market-research/SKILL.md` + references/
4. Extract topic/niche từ args (phần sau tín hiệu intent)
5. Thực hiện: demand validation → keyword signals → competitor scan → niche score
6. Output: Market Research Report + Go / Cautious Go / No-Go verdict

### competitor-analysis
1. Đọc `BUSINESS.md`
2. Load `agents/offer/agent.md`
3. Load `skills/offer/competitor-analysis/SKILL.md` + references/
4. Extract tên đối thủ hoặc niche từ args
5. Thực hiện: profile đối thủ → gap analysis → positioning opportunity
6. Output: Competitor Analysis Report + positioning recommendation

### offer-packaging
1. Đọc `BUSINESS.md` — lấy sản phẩm, audience, kết quả KH
2. Load `agents/offer/agent.md`
3. Load `skills/offer/offer-packaging/SKILL.md` + references/
4. Extract tên sản phẩm/offer từ args
5. Thực hiện: core offer → value stack → pricing → headline + positioning statement
6. Output: Complete Offer Package

---

## Ví Dụ Hoạt Động

```
/offer research niche coaching sức khoẻ phụ nữ sau sinh
→ market-research | topic = "coaching sức khoẻ phụ nữ sau sinh"

/offer phân tích đối thủ Võ Tuấn Kiệt và niche Facebook Ads
→ competitor-analysis | target = "Võ Tuấn Kiệt, niche FB Ads"

/offer đóng gói khóa học TikTok Ads giá 2 triệu
→ offer-packaging | product = "khóa học TikTok Ads, 2.000.000đ"

/offer tôi muốn validate ý tưởng dạy Canva cho chủ shop
→ market-research | topic = "dạy Canva cho chủ shop"
```

---

## Output

Sau khi hoàn thành, **lưu kết quả vào file** tại:

```
output/offer/[YYYY-MM-DD]-[task]-[topic-slug].md

Ví dụ:
output/offer/2026-05-09-research-coaching-suc-khoe.md
output/offer/2026-05-09-competitor-fb-ads-market.md
output/offer/2026-05-09-offer-package-fbads-course.md
```

**Dùng Write tool để tạo file** — không chỉ hiện trong conversation.
