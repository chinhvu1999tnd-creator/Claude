---
name: integrations-sepay-query
description: Query doanh thu + số dư real-time từ SePay API (bank = source of truth). Dùng cho /revenue command + Analysis Agent natural language revenue queries.
---

# SePay Query Skill — Revenue Chat

## Khi Nào Dùng

- User gõ `/revenue` (today/week/month/balance)
- Analysis Agent detect intent revenue trong chat: "doanh thu hôm nay?", "số dư?", "có đơn mới không?"
- `/analyze revenue --sepay` — dùng bank data thay Portal data

## Tại sao SePay > Portal cho revenue

| Nguồn | Cái gì | Khi nào dùng |
|-------|--------|--------------|
| Portal Supabase | Chỉ đơn QUA funnel | Track conversion funnel |
| **SePay API** | TẤT CẢ tiền về tài khoản (funnel + manual + offline) | **Doanh thu thực = bank truth** |

→ Hỏi "doanh thu thực bao nhiêu" → SePay. Hỏi "funnel convert thế nào" → Portal.

## Setup

Cần `SEPAY_API_TOKEN` trong `.env`:
- Lấy tại: https://my.sepay.vn → API Access → tạo token
- KHÁC với `SEPAY_WEBHOOK_API_KEY` (webhook auth)
- Nếu thiếu → Agent hỏi user add, hoặc hướng dẫn `references/get-api-token.md`

## API Module

Dùng `sepay-client.mjs`:

```javascript
import { getRevenue, getBalance, getNewSince, dateRange, formatVND } from './sepay-client.mjs'

// Doanh thu tuần
const { dateMin, dateMax } = dateRange('week')
const rev = await getRevenue({ dateMin, dateMax })
// → { totalIn, totalOut, net, count, balance, transactions }

console.log(`Tuần này: ${formatVND(rev.totalIn)} (${rev.count} giao dịch)`)
console.log(`Số dư: ${formatVND(rev.balance)}`)
```

## Natural Language Query Mapping

| User hỏi | Function | Period |
|----------|----------|--------|
| "doanh thu hôm nay" | getRevenue | today |
| "tuần này thu bao nhiêu" | getRevenue | week |
| "tháng này doanh thu" | getRevenue | month |
| "số dư tài khoản" | getBalance | — |
| "có đơn mới không" | getNewSince(lastId) | since last check |
| "tháng này so tháng trước" | getRevenue × 2 | month + last-month |

## Response Format

```
User: "doanh thu hôm nay bao nhiêu?"

Agent:
💰 Doanh thu hôm nay ({date}):
- Tiền vào: 5.970.000 VND (3 giao dịch)
- Số dư hiện tại: 47.250.000 VND

Chi tiết:
1. 1.997.000 VND - 09:15 (mã ORDERS042)
2. 1.997.000 VND - 11:30 (mã ORDERS043)
3. 1.976.000 VND - 14:20 (mã ORDERS044)
```

```
User: "tháng này so tháng trước?"

Agent:
📊 So sánh:
- Tháng này (đến {date}): 24.500.000 VND (12 đơn)
- Tháng trước: 18.200.000 VND (9 đơn)
- Tăng trưởng: +34.6% revenue, +33% đơn ↑

→ Đà tốt! Em đề xuất /analyze optimize để tìm cách scale tiếp.
```

## "Có đơn mới không?" — track since_id

Lưu last checked transaction id vào `output/analysis/.sepay-last-id`:
```
1. Lần đầu hỏi → getRevenue today → lưu max(id) vào file
2. Lần sau "có đơn mới không?" → getNewSince(lastId) → đếm new
3. Update lastId
```

## Error Handling

| Lỗi | Fallback |
|-----|---------|
| SEPAY_API_TOKEN missing | Hỏi user add token / hướng dẫn lấy |
| 401 invalid token | "Token sai/hết hạn, tạo lại tại my.sepay.vn" |
| Network error | Retry 1 lần, sau đó báo user |
| Empty transactions | "Chưa có giao dịch nào trong khoảng này" |

## References

- `references/get-api-token.md` — lấy SEPAY_API_TOKEN

## Boundary

❌ KHÔNG cache revenue quá 5 phút — user muốn real-time
❌ KHÔNG log/save SEPAY_API_TOKEN ra file output
❌ KHÔNG nhầm SEPAY_API_TOKEN (query) với SEPAY_WEBHOOK_API_KEY (webhook auth)
