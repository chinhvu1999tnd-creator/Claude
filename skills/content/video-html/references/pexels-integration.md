# Pexels Integration cho video-html v3

> Loaded by `prompts/image-planner.md` + `scripts/fetch-pexels.mjs`.
> Optional — skip nếu không có `PEXELS_API_KEY` trong `.env`.

## API Endpoints

### Search Photos

```
GET https://api.pexels.com/v1/search?query={QUERY}&per_page=5&orientation={portrait|landscape}
Headers:
  Authorization: $PEXELS_API_KEY
```

### Search Videos

```
GET https://api.pexels.com/videos/search?query={QUERY}&per_page=3&orientation={portrait|landscape}
Headers:
  Authorization: $PEXELS_API_KEY
```

## Response Structure (Photo)

```json
{
  "photos": [
    {
      "id": 1234,
      "src": {
        "original": "https://...jpg",
        "large2x": "https://...jpg",
        "large": "https://...jpg",
        "medium": "https://...jpg"
      },
      "alt": "...",
      "photographer": "...",
      "url": "https://www.pexels.com/photo/..."
    }
  ]
}
```

Use `src.large2x` cho hi-res hoặc `src.large` cho balanced size.

## Response Structure (Video)

```json
{
  "videos": [
    {
      "id": 1234,
      "video_files": [
        { "quality": "hd", "width": 1920, "height": 1080, "link": "..." }
      ],
      "duration": 15
    }
  ]
}
```

Pick video_file với `quality: "hd"` matching aspect ratio.

## Query Best Practices

Per `IMAGE_PLANNER_SYSTEM` rules (prompts.ts:1185-1215):

- Query CỰC NGẮN — 2-5 từ tiếng Anh
- Concrete (không trừu tượng): ✅ "japanese temple", ❌ "ancient japanese temple at sunset"
- Tránh cliché: ✅ "startup team meeting", ❌ "success"

## Rate Limits

- Free tier: 200 requests/hour
- Sequential calls trong fetch-pexels.mjs (không batch parallel)

## Aspect Mapping

| Skill aspect | Pexels `orientation` |
|--------------|---------------------|
| `9:16` | `portrait` |
| `16:9` | `landscape` |

## Error Codes

| Status | Action |
|--------|--------|
| 401 | STOP, check PEXELS_API_KEY in .env |
| 429 | Sleep 60s, retry 1 time |
| 404 | Skip scene (no asset) — log warn, continue |

## Hard Gate

Nếu `PEXELS_API_KEY` thiếu trong `.env`:
- Skip Bước 3a (image planner) and Bước 3b (fetch)
- SKILL.md continue without assets — vẫn produce mp4 với HTML+GSAP only
- Print warn message một lần
