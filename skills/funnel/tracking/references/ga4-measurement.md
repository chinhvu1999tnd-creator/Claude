# GA4 Measurement Protocol v2 — Reference

## Endpoint

```
POST https://www.google-analytics.com/mp/collect?measurement_id={G-XXXXXXXXXX}&api_secret={secret}
Content-Type: application/json
```

## Payload Structure

```json
{
  "client_id": "unique_client_identifier",
  "events": [{
    "name": "purchase",
    "params": {
      "transaction_id": "SEPAY-REF-12345",
      "value": 997000,
      "currency": "VND",
      "items": [{
        "item_name": "Tên sản phẩm",
        "price": 997000,
        "quantity": 1
      }]
    }
  }]
}
```

## client_id

- Browser events: GA4 auto-manages qua cookie `_ga`
- Server events: dùng `event_id` (uuid) làm `client_id` — đủ để GA4 track session
- Không cần user_id cho anonymous purchase tracking

## API Secret

Lấy từ: GA4 → Admin → Data Streams → chọn stream → Measurement Protocol API Secrets → Create

## Event Name Mapping

| Unified | GA4 Event |
|---|---|
| PageView | page_view |
| ViewContent | view_item |
| Lead | generate_lead |
| InitiateCheckout | begin_checkout |
| Purchase | purchase |
| Scroll depth | scroll (param: percent_scrolled) |
| Time on page | timing_complete |

## VND Currency

GA4 chấp nhận VND. value = số nguyên VND (997000, không phải 997.0).
Currency code: `"VND"` (ISO 4217).

## Validation

Test với: `https://www.google-analytics.com/debug/mp/collect?...` (debug endpoint) → trả về JSON validation report.
