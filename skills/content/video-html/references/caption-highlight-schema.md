# Caption-Highlight Schema — Patching Contract

> Loaded by `prompts/html-generator.md` (pipeline-only — chỉ liên quan Bước 7 render-mp4.mjs).
> Mô tả CHÍNH XÁC schema mà `render-mp4.mjs` inject vào `compositions/components/caption-highlight.html`.
>
> Bạn (AI sinh HTML scene) **KHÔNG cần** generate caption — nó tự inject ở Bước 7. Doc này để:
> 1. Debug khi caption sai (sai word? lệch timing?)
> 2. Hiểu vì sao snippet phải chừa ≥ 280px bottom padding
> 3. Customize style caption nếu cần

═══════════════════════════════════════════════════════════════════
1. TRANSCRIPT.JSON (input của patch)
═══════════════════════════════════════════════════════════════════

`render-mp4.mjs` build từ `alignment.json` + cumulative scene start times → ghi vào `transcript.json`:

```json
[
  { "text": "Cú",      "start": 0.000, "end": 0.180 },
  { "text": "sốc",     "start": 0.180, "end": 0.420 },
  { "text": "Google",  "start": 1.100, "end": 1.560 },
  { "text": "thổi",    "start": 2.000, "end": 2.220 },
  { "text": "bay",     "start": 2.220, "end": 2.480 }
]
```

**Quy tắc:**
- Word-level (không phải character)
- `start` / `end` absolute trong toàn video (đã cộng cumulative scene start)
- Order theo thứ tự nói

**Fallback (khi không có alignment.json):**
- `buildFallbackTranscript()` spread đều words trong scene proportionally
- Caption vẫn hiển thị, nhưng KHÔNG sync chính xác per-word

═══════════════════════════════════════════════════════════════════
2. PATCH TARGETS (caption-highlight.html bị patch những gì)
═══════════════════════════════════════════════════════════════════

| Target | Regex pattern (rough) | Giá trị mới |
|--------|----------------------|-------------|
| Viewport meta | `content="width=\d+, height=\d+"` | `width=${W}, height=${H}` (1080×1920 cho 9:16) |
| CSS html/body dimensions | `width: 1920px; height: 1080px;` | `width: ${W}px; height: ${H}px;` |
| `.hl-group` bottom (portrait only) | `bottom: 140px;` → `bottom: 200px;` | Đẩy caption lên cao tránh che mặt |
| `.hl-group` padding (portrait only) | `padding: 0 100px;` → `padding: 0 60px;` | Hẹp lại cho 1080px wide |
| Root `data-duration` | `data-duration="\d+"` | `data-duration="${totalDuration}"` |
| `var WORDS = [...]` JS literal | Replace toàn bộ | Inject WORDS array (xem mục 3) |
| `var RAW_GROUPS = [...]` JS literal | Replace toàn bộ | Inject RAW_GROUPS array (xem mục 4) |
| `nextStart` fallback `8.0` | Hardcoded | Replace bằng `totalDuration.toFixed(2)` |

═══════════════════════════════════════════════════════════════════
3. WORDS ARRAY (JS literal inject vào script)
═══════════════════════════════════════════════════════════════════

```javascript
var WORDS = [
  { text: "Cú", start: 0.000, end: 0.180 },
  { text: "sốc", start: 0.180, end: 0.420 },
  { text: "Google", start: 1.100, end: 1.560 }
  // ... tất cả words trong transcript ...
];
```

Mỗi word object: `{ text: string, start: number(s), end: number(s) }`.

═══════════════════════════════════════════════════════════════════
4. RAW_GROUPS ARRAY (phụ đề được group 4 words mỗi line)
═══════════════════════════════════════════════════════════════════

Words được group lại thành chunk 4 từ (để 1 line caption không quá dài).

```javascript
var RAW_GROUPS = [
  [0, 3],   // line 1 = words[0..3] (4 từ)
  [4, 7],   // line 2 = words[4..7]
  [8, 11],  // ...
  [12, 14]  // line cuối có thể < 4 từ
];
```

Mỗi group là `[wordStartIndex, wordEndIndex]` inclusive (index vào `WORDS` array).

`groupWords(transcript, 4)` trong render-mp4.mjs tạo grouping này.

**Hệ quả:** mỗi 4 từ → 1 caption line hiển thị → next line khi tới `nextStart`.

═══════════════════════════════════════════════════════════════════
5. RENDER OUTPUT (cách caption hiện ra)
═══════════════════════════════════════════════════════════════════

Component `caption-highlight` (HyperFrames built-in) render:
- Style: Montserrat 800 weight, uppercase, font-size lớn
- Background: red pill behind active word (TikTok-style highlight)
- Animation: GSAP-driven wipe per word
- Position (portrait 9:16): `bottom: 200px`, `padding: 0 60px`
- Track-index 10 → above all scene clips

═══════════════════════════════════════════════════════════════════
6. BOTTOM PADDING REQUIREMENT (cho scene snippet)
═══════════════════════════════════════════════════════════════════

Vì caption overlay đè lên scene clip, scene HTML PHẢI chừa space đáy:

| Aspect | Bottom padding tối thiểu |
|--------|--------------------------|
| 9:16 (1080×1920) portrait | **≥ 280px** (caption ở `bottom: 200px` + line height ~80px) |
| 16:9 (1920×1080) landscape | **≥ 180px** |

Nếu đặt content quan trọng (số, headline, CTA) vào vùng này → caption sẽ che.

═══════════════════════════════════════════════════════════════════
7. THAY CAPTION STYLE (15 styles available)
═══════════════════════════════════════════════════════════════════

HyperFrames có 15 caption-highlight variants. Mặc định dùng red pill TikTok-style.

Khác variant có sẵn (chạy `npx hyperframes list-components` để xem):
- `caption-highlight` — red pill wipe (default)
- `caption-bouncing` — bounce in word
- `caption-typing` — typewriter effect
- `caption-glow` — glow ring per word
- ... (xem HyperFrames docs)

Để dùng variant khác: edit `render-mp4.mjs` line ~127 (`captionDiv` template) → đổi `data-composition-src` path.

═══════════════════════════════════════════════════════════════════
8. DEBUG TIPS
═══════════════════════════════════════════════════════════════════

| Triệu chứng | Nguyên nhân | Fix |
|------------|-------------|-----|
| Caption sai word (vd "T á m" thay vì "Tám") | Alignment trả diacritics riêng | Check `scripts/infer-timestamps.mjs` concat logic |
| Caption lệch timing | `alignment.json` cumulative sai | Check scene start times trong render-mp4.mjs |
| Caption không hiện | `transcript.json` rỗng / WORDS replace fail | Check regex `/var WORDS = \[[\s\S]*?\];/` match trong caption-highlight.html |
| Caption che content | Scene snippet không chừa 280px bottom | Tăng `padding-bottom` của `.scene-content-{id}` |
| Caption hiển thị toàn video | KHÔNG có RAW_GROUPS → fallback show all | Verify `groupWords()` chạy đúng |
