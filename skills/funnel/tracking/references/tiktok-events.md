# TikTok Events API v1.3 — Reference

## Endpoint

```
POST https://business-api.tiktok.com/open_api/v1.3/pixel/track/
Content-Type: application/json
Access-Token: {access_token}
```

## Payload Structure

```json
{
  "pixel_code": "CXXXXXXXXXXXXXXXXX",
  "event": "CompletePayment",
  "timestamp": "2024-01-15T10:30:00+07:00",
  "event_id": "uuid-for-dedup",
  "context": {
    "page": {
      "url": "https://funnel.example.com/thank-you"
    },
    "user": {
      "email": "sha256_hashed_email",
      "phone_number": "sha256_hashed_phone"
    },
    "ip": "1.2.3.4",
    "user_agent": "Mozilla/5.0..."
  },
  "properties": {
    "value": 997000,
    "currency": "VND"
  }
}
```

## PII Hashing Rules

- **Email:** lowercase + trim → SHA-256 hex
- **Phone:** digits only (VN: `84912345678`) → SHA-256 hex

## Event Name Mapping

| Unified | TikTok Event |
|---|---|
| Lead | SubmitForm |
| InitiateCheckout | InitiateCheckout |
| Purchase | CompletePayment |
| PageView | PageView |
| ViewContent | ViewContent |

## Deduplication

- Browser: `ttq.track('EventName', data)` — TikTok auto-assigns event_id
- Server: gửi cùng `event_id` trong payload → TikTok dedup trong 24 giờ

## Access Token

Lấy từ: TikTok Ads Manager → Assets → Events → Pixel → Settings → Generate Access Token
