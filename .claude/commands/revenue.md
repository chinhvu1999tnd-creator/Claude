---
description: Query doanh thu + số dư real-time từ SePay (bank = source of truth). Chat hỏi tự nhiên hoặc /revenue today|week|month|balance
argument-hint: (trống = menu) | "today" | "week" | "month" | "balance" | câu hỏi tự nhiên "doanh thu hôm nay?"
agent: analysis
---

<args>$ARGUMENTS</args>

## Vai trò

Quick access query doanh thu thực từ SePay API (tiền về tài khoản ngân hàng). Khác `/analyze revenue` (Portal funnel data) — `/revenue` là **bank truth**.

## Pre-check

```
1. SEPAY_API_TOKEN có trong .env?
   → KHÔNG → "Em cần SePay API token để xem doanh thu. 
              Lấy tại my.sepay.vn → API Access (~2 phút), add vào .env: SEPAY_API_TOKEN=...
              Xem: skills/integrations/sepay-query/references/get-api-token.md"
   → CÓ → tiếp tục
```

## Execution

Load `skills/integrations/sepay-query/SKILL.md` + dùng `sepay-client.mjs`.

### Intent từ args

| args | Action |
|------|--------|
| trống | Show menu nhanh + doanh thu hôm nay |
| `today` / "hôm nay" | getRevenue period=today |
| `week` / "tuần" | getRevenue period=week |
| `month` / "tháng" | getRevenue period=month |
| `balance` / "số dư" | getBalance |
| "có đơn mới" | getNewSince(lastId) |
| "tháng này so tháng trước" | getRevenue month + last-month → compare |
| Câu hỏi tự nhiên khác | Parse intent → map period → query |

### Default (`/revenue` trống)

```
💰 Doanh thu hôm nay ({date}):
- Tiền vào: {formatVND(totalIn)} ({count} giao dịch)
- Số dư: {formatVND(balance)}

Hỏi thêm:
- /revenue week — tuần này
- /revenue month — tháng này
- /revenue balance — chỉ số dư
- Hoặc hỏi tự nhiên: "tháng này so tháng trước?"
```

### Execute query (ví dụ today)

```javascript
import { getRevenue, dateRange, formatVND } from 'skills/integrations/sepay-query/sepay-client.mjs'
const { dateMin, dateMax } = dateRange('today')
const rev = await getRevenue({ dateMin, dateMax })
// Show: totalIn, count, balance + chi tiết transactions
```

### Output format

```
💰 Doanh thu {period} ({date range}):
- Tiền vào: {totalIn} VND ({count} giao dịch)
- Số dư hiện tại: {balance} VND
{nếu period > today: so sánh với kỳ trước nếu user hỏi}

Chi tiết giao dịch:
1. {amount} - {time} (mã {code})
...
```

## Boundary

❌ KHÔNG cache > 5 phút — real-time
❌ KHÔNG log SEPAY_API_TOKEN
❌ KHÔNG nhầm với SEPAY_WEBHOOK_API_KEY
❌ Nếu user hỏi "funnel convert thế nào" → đó là /analyze funnel (Portal), không phải /revenue (bank)
