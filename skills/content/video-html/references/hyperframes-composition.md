# HyperFrames Composition — Snippet Syntax & Timeline Lifecycle

> Loaded by `prompts/html-generator.md` (always-load). Định nghĩa CHÍNH XÁC cách 1 scene snippet phải compose để chạy được trong pipeline `render-mp4.mjs` (HyperFrames + GSAP + Chromium).
>
> Trước đây info này nằm rải rác trong skeleton + anti-patterns. Gom 1 chỗ để AI có ground truth.

═══════════════════════════════════════════════════════════════════
1. PIPELINE TỔNG QUAN (để bạn hiểu mình đang sinh cái gì)
═══════════════════════════════════════════════════════════════════

```
scenes/scene-1.html  ┐
scenes/scene-2.html  ├─→ render-mp4.mjs compose →  index.html  →  npx hyperframes render  →  silent.mp4
scenes/scene-N.html  ┘                                                                     ↓
                                                                                ffmpeg + voice + SFX
                                                                                           ↓
                                                                                       final.mp4
```

Mỗi `scenes/scene-{i}.html` là **SNIPPET**, KHÔNG phải document hoàn chỉnh.
`render-mp4.mjs` wrap chúng vào `index.html` template có sẵn (xem mục 5).

═══════════════════════════════════════════════════════════════════
2. SNIPPET ROOT STRUCTURE (BẮT BUỘC)
═══════════════════════════════════════════════════════════════════

```html
<div class="clip"
     data-scene-id="scene-{i}"
     data-start="0"
     data-duration="{D}"
     data-track-index="1">
  <div class="scene-content-scene-{i}">
    <!-- visual content: end-state layout -->
  </div>
  <style>
    /* scoped CSS — xem mục 3 */
  </style>
  <script>
    /* GSAP timeline IIFE — xem mục 4 */
  </script>
</div>
```

**Attributes giải thích:**

| Attribute | Giá trị | Mô tả |
|-----------|---------|-------|
| `class="clip"` | Bắt buộc literal `clip` | HyperFrames detect element này là 1 clip |
| `data-scene-id` | `scene-{i}` (kebab) | Unique ID — dùng làm prefix CSS scoping + key cho `window.__timelines` |
| `data-start` | `0` | render-mp4.mjs SẼ OVERRIDE khi ghép vào index.html (theo cumulative start) — bạn để 0 |
| `data-duration` | Số giây thực của scene | render-mp4.mjs giữ giá trị này |
| `data-track-index` | `1` | Track layer (1 = base scene layer; 10 = caption overlay; 0 = video bg) |

═══════════════════════════════════════════════════════════════════
3. CSS SCOPING (BẮT BUỘC — tránh leak giữa scenes)
═══════════════════════════════════════════════════════════════════

Mọi selector PHẢI có prefix `.clip[data-scene-id="scene-{i}"]`:

```css
.clip[data-scene-id="scene-{i}"] {
  width: 100%; height: 100%;
  background: <gradient/radial/solid — BẮT BUỘC có màu>;
  position: relative; overflow: hidden;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
.clip[data-scene-id="scene-{i}"] .scene-content-scene-{i} {
  width: 100%; height: 100%;
  /* CẤU TRÚC PADDING — KHÔNG được đảo:
     top:    160-200px  (đối xứng visual với caption space)
     side:   80px (9:16) hoặc 120px (16:9)
     bottom: 320px (9:16, dành cho caption-highlight) hoặc 220px (16:9)
     Bottom > top vì caption overlay → để center xuất hiện tự nhiên ở giữa, top thêm 60-100px */
  padding: 180px 80px 320px 80px;  /* 9:16 vertical */
  /* padding: 120px 120px 220px 120px;  cho 16:9 horizontal */

  display: flex; flex-direction: column;
  justify-content: center;  /* BẮT BUỘC — KHÔNG dùng flex-start, KHÔNG dùng space-between */
  align-items: stretch;
  gap: 32px;
  box-sizing: border-box;
}
.clip[data-scene-id="scene-{i}"] .my-headline {
  /* ... */
}
```

**LÝ DO:** Tất cả scenes share cùng 1 `index.html`. Nếu CSS class `.headline` không scope, scene 2 sẽ inherit/override styles của scene 1 → visual rối loạn.

═══════════════════════════════════════════════════════════════════
4. GSAP TIMELINE LIFECYCLE (CỰC KỲ QUAN TRỌNG)
═══════════════════════════════════════════════════════════════════

```html
<script>
  (function() {
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });

    // Tất cả tween phải:
    //   1. dùng gsap.from() (entrance — không exit)
    //   2. selector có prefix .clip[data-scene-id="scene-{i}"]
    //   3. có offset thời gian rõ ràng (giây thứ 3 của arguments)

    tl.from('.clip[data-scene-id="scene-{i}"] .bg-stars',
            { opacity: 0, duration: 0.8 }, 0);
    tl.from('.clip[data-scene-id="scene-{i}"] .headline',
            { y: 80, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.5);
    // ... thêm tween entrance khác ...

    window.__timelines["scene-{i}"] = tl;
  })();
</script>
```

**Lifecycle render-mp4.mjs tạo trong `index.html`:**

```javascript
const __masterTl = gsap.timeline({ paused: true });
document.querySelectorAll('[data-scene-id]').forEach(el => {
  const sceneId = el.dataset.sceneId;
  const startTime = parseFloat(el.dataset.start) || 0;
  if (window.__timelines[sceneId]) {
    __masterTl.add(window.__timelines[sceneId], startTime);  // ← add scene tl vào master tại data-start
  }
});
window.__timelines["main"] = __masterTl;  // ← HyperFrames đợi key "main" trước khi render
```

**Hệ quả KỸ THUẬT:**

1. KHÔNG được `play()` timeline của bạn — master sẽ schedule và play.
2. KHÔNG được dùng `repeat: -1` (vô hạn) — HyperFrames không biết khi nào dừng frame capture. Dùng `repeat: Math.ceil(duration / cycle) - 1`.
3. KHÔNG được dùng `setTimeout` / `async` / `Promise` — HyperFrames seek frame-by-frame, không tick real-time.
4. KHÔNG được dùng `Math.random()` / `Date.now()` — non-deterministic, frame N render khác nhau giữa các lần.
5. PHẢI wrap trong IIFE — biến `tl` không leak ra global, không conflict với scenes khác.
6. PHẢI register `window.__timelines["scene-{i}"] = tl` — nếu quên, scene KHÔNG render (master không add được).

═══════════════════════════════════════════════════════════════════
5. INDEX.HTML WRAPPER (auto-generated bởi render-mp4.mjs — đừng tạo)
═══════════════════════════════════════════════════════════════════

Đây là cái render-mp4.mjs sinh ra — bạn KHÔNG cần generate. Nhưng nên hiểu để biết snippet của mình fit vào đâu:

```html
<!doctype html>
<html>
  <head>
    <meta viewport ... />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/..."></script>
    <style>html, body { ... }</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}">

      <!-- Scene clips từ scenes/*.html — INSERTED HERE -->
      <div class="clip" data-scene-id="scene-1" data-start="0" data-duration="3.2" data-track-index="1">...</div>
      <div class="clip" data-scene-id="scene-2" data-start="3.2" data-duration="2.8" data-track-index="1">...</div>

      <!-- Audio tracks -->
      <audio src="audio/scene-1.mp3" data-start="0" data-duration="3.2"></audio>

      <!-- Caption overlay -->
      <div class="clip"
           data-composition-src="./compositions/components/caption-highlight.html"
           data-start="0"
           data-duration="{total}"
           data-track-index="10"></div>

    </div>
    <script>
      // Master timeline — composes children
      const __masterTl = gsap.timeline({ paused: true });
      document.querySelectorAll('[data-scene-id]').forEach(el => {
        const sceneId = el.dataset.sceneId;
        const startTime = parseFloat(el.dataset.start) || 0;
        if (window.__timelines[sceneId]) {
          __masterTl.add(window.__timelines[sceneId], startTime);
        }
      });
      window.__timelines["main"] = __masterTl;
    </script>
  </body>
</html>
```

═══════════════════════════════════════════════════════════════════
6. TRACK INDEX (z-order)
═══════════════════════════════════════════════════════════════════

| Track index | Loại | Note |
|-------------|------|------|
| `0` | Video background (Pexels b-roll) | Optional, đặt sau scene-content layer |
| `1` | Scene clips (default) | Mọi scene snippet dùng track-index 1 |
| `10` | Caption overlay | render-mp4.mjs tự inject, đừng touch |

═══════════════════════════════════════════════════════════════════
7. ANTI-PATTERNS (KHÔNG BAO GIỜ làm)
═══════════════════════════════════════════════════════════════════

- ❌ Output full `<!DOCTYPE html>...</html>` — phải SNIPPET only
- ❌ Include `<script src="...gsap...">` — đã có ở wrapper
- ❌ Quên `window.__timelines["{SCENE_ID}"] = tl` register
- ❌ Quên scope CSS / GSAP selector với prefix `.clip[data-scene-id="..."]`
- ❌ Dùng `play()` / `pause()` / `seek()` trên timeline — master controls
- ❌ `repeat: -1`, `setTimeout`, `Math.random()`, `Date.now()`
- ❌ `gsap.to(el, { opacity: 0 })` exit animation — transition do framework lo
- ❌ Animate `width/height/visibility/display` — dùng `scale` / `opacity`
- ❌ Đặt content quan trọng < 280px (9:16) hoặc < 180px (16:9) từ bottom — caption overlay sẽ che
- ❌ `justify-content: flex-start` → content cluster ở top, vùng giữa-dưới trống lỗng. PHẢI dùng `justify-content: center`.
- ❌ Padding top = 100px (quá nhỏ so với bottom 320px → visual lệch lên rất nặng). PHẢI dùng top 160-200px cho 9:16.
- ❌ Margin-top: auto trên element cuối để "đẩy xuống đáy" — gây content stretch + uneven gap. Dùng equal gap + center thay thế.
