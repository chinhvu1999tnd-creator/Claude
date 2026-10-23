# UTM Capture — Spec

## Parameters Tracked

| Param | Mô tả |
|---|---|
| `utm_source` | Nguồn traffic (facebook, tiktok, google, zalo, email) |
| `utm_medium` | Loại kênh (cpc, social, email, organic) |
| `utm_campaign` | Tên campaign |
| `utm_content` | Ad creative variant |
| `utm_term` | Keyword (Google Search) |

## Storage

1. **localStorage** key: `utm_data` — JSON string, persist cross-session
2. **Cookie** name: `utm_data` — expire 30 ngày, path=/

Ghi đè: nếu URL có UTM params mới → overwrite cả localStorage lẫn cookie.
Nếu URL không có UTM → đọc từ storage (giữ attribution từ lần đầu đến).

## Implementation (trong tracking.js)

```js
// On every page load
var params = new URLSearchParams(window.location.search);
var utm = {};
['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k) {
  if (params.get(k)) utm[k] = params.get(k);
});

if (Object.keys(utm).length > 0) {
  // New UTM detected — overwrite
  localStorage.setItem('utm_data', JSON.stringify(utm));
  document.cookie = 'utm_data=' + encodeURIComponent(JSON.stringify(utm))
    + '; max-age=' + (30*24*60*60) + '; path=/; SameSite=Lax';
} else {
  // No UTM in URL — read from storage
  try { utm = JSON.parse(localStorage.getItem('utm_data') || '{}'); } catch(e) {}
}
```

## Kèm theo Events

UTM data được merge vào mọi event payload:
- Browser events: merge vào `payload` trước khi fire
- Server events: browser gửi UTM trong POST body, server forward lên CAPI
