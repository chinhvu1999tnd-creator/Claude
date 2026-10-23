# ElevenLabs Integration cho video-html v2

## API Endpoints

### With-timestamps TTS (chính)

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps

Headers:
  xi-api-key: $ELEVENLABS_API_KEY
  Content-Type: application/json
  Accept: application/json

Body:
{
  "text": "Voice script tiếng Việt...",
  "model_id": "eleven_turbo_v2_5",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": true
  }
}

Response:
{
  "audio_base64": "...",
  "alignment": {
    "characters": ["T","á","m",...],
    "character_start_times_seconds": [0.0, 0.08, ...],
    "character_end_times_seconds": [0.08, 0.14, ...]
  }
}
```

**Model bắt buộc: `eleven_turbo_v2_5`** — chỉ model này render tiếng Việt đẹp. Các model khác (`eleven_multilingual_v2`, etc.) không support VN tốt.

### List voices

```
GET https://api.elevenlabs.io/v1/voices
Headers: xi-api-key: $ELEVENLABS_API_KEY
```

Trả về list voices của account user. Script `list-voices.mjs` cache vào `voices-cache.json`.

## Voice Settings Explanation

| Field | Range | Mô tả |
|-------|-------|-------|
| `stability` | 0.0-1.0 | 0 = expressive (cảm xúc dao động), 1 = stable (monotone). Default 0.5. |
| `similarity_boost` | 0.0-1.0 | Cao = bám voice gốc, có thể bring noise. Default 0.75. |
| `style` | 0.0-1.0 | Chỉ cho v2 models. Tăng exaggeration của style. Default 0.0. |
| `use_speaker_boost` | bool | Improve clarity. Default true. |

## Error Codes

| Status | Nguyên nhân | Xử lý |
|--------|-------------|-------|
| 401 | API key sai/expired | STOP, check `.env`, hướng dẫn lấy key tại https://elevenlabs.io/app/settings/api-keys |
| 403 | Account suspended / payment issue | STOP, check account status |
| 422 | Body sai format | STOP, log body để debug |
| 400 (`voice_not_found`) | voice_id sai | STOP, chạy `list-voices.mjs` |
| 429 | Rate limit | Sleep 5s, retry 3 lần; vẫn fail → STOP, suggest upgrade plan |
| 500 | Server error | Retry 1 lần |

## Cost (Starter plan rate)

- ~$0.15 / 1,000 characters
- Average video (8 scenes × 50 chars) = 400 chars → ~$0.06 / video
- Free tier: 10k chars/tháng = ~25 videos
- Starter $5/tháng: 30k chars = ~75 videos
- Creator $22/tháng: 100k chars = ~250 videos

Cost được skill report ở Bước 7.

## Vietnamese Voices (gợi ý)

Chạy `list-voices.mjs` để xem voices của account user. Một số voice phổ biến VN:

- **Lily** — female, soft business
- **Bella** — female, warm friendly
- **Charlie** — male, energetic
- **Antoni** — male, calm professional

(IDs sẽ khác cho mỗi account — chạy `list-voices.mjs` để biết chính xác.)

### API Key Permissions

Để chạy `list-voices.mjs` lấy danh sách voices từ account, key cần permission `voices_read`. Một số key chỉ có TTS write permission — script sẽ fall back về list 6 voice mặc định (Rachel, Domi, Bella, Antoni, Charlie, Lily). 6 voice này đều support tiếng Việt qua `eleven_turbo_v2_5`.

Để bật `voices_read` permission: https://elevenlabs.io/app/settings/api-keys → edit key → enable Voices Read.

## Diacritics Handling

ElevenLabs có thể tách dấu tiếng Việt ("á" → ["a", "´"]) trong `characters[]`. Script `infer-timestamps.mjs` xử lý bằng concat + indexOf.

## Sequential, not parallel

ElevenLabs rate limits:
- Free: 4 concurrent requests
- Starter: 10 concurrent
- Creator+: cao hơn

Skill gọi tuần tự (1 scene/request) — 6-10 scenes × 3s/request = ~30s tổng. Đơn giản, không phải quản lý concurrency.
