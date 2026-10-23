# Meta Conversions API — Reference

## Endpoint

```
POST https://graph.facebook.com/v19.0/{pixel_id}/events
Content-Type: application/json
```

## Payload Structure

```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1700000000,
    "event_id": "uuid-for-dedup",
    "action_source": "website",
    "event_source_url": "https://funnel.example.com/thank-you",
    "user_data": {
      "em": ["sha256_hashed_email"],
      "ph": ["sha256_hashed_phone_e164"],
      "client_ip_address": "1.2.3.4",
      "client_user_agent": "Mozilla/5.0..."
    },
    "custom_data": {
      "value": 997000,
      "currency": "VND",
      "order_id": "SEPAY-REF-12345"
    }
  }],
  "access_token": "EAA..."
}
```

## PII Hashing Rules

- **Email:** lowercase + trim → SHA-256 hex
- **Phone:** E.164 format (VN: `84912345678`, không có `+`) → SHA-256 hex
- Luôn hash — không gửi plain text PII

## Deduplication

- Browser pixel fire: `fbq('track', 'EventName', data, { eventID: 'uuid' })`
- CAPI fire: `event_id: 'uuid'` (cùng UUID)
- Meta tự dedup trong 48 giờ nếu `event_id` giống nhau

## Test Events

Thêm `"test_event_code": "TEST12345"` vào payload → events hiện trong Events Manager → Test Events tab.
Xóa `test_event_code` trước khi go live.

## Common Errors

| Code | Meaning | Fix |
|---|---|---|
| 190 | Invalid access token | Kiểm tra token chưa expire, đúng Pixel |
| 100 | event_time quá cũ (>7 ngày) | Dùng `Math.floor(Date.now() / 1000)` |
| 200 | Pixel not found | Kiểm tra pixel_id đúng |
