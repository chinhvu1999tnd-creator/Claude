---
name: slide-html
description: Generate beautiful single-file HTML slide decks with 34 template aesthetics. Vietnamese typography support built-in. Use for content marketing carousels, webinar decks, lead magnets, pitch decks, onboarding slides.
---

# slide-html — HTML Slide Deck Generator

Creates self-contained HTML slide decks. Single output file. No build step.

**Triggers:** "tạo slide", "làm deck", "slide presentation", "slide html", "bài thuyết trình", "tạo deck"

---

## Phase 0 — Intent Detection

Scan user's message for:

| Signal | Path |
|---|---|
| `.pptx` file path | → PPT Convert (Phase 5 first, then Phase 1) |
| "cải thiện", "enhance", existing `.html` path | → Enhance (skip to Phase 3 with existing file) |
| Anything else | → New deck (continue to Phase 1) |

---

## Phase 1 — Content Discovery

Ask these 4 questions **one at a time**, wait for each answer:

1. **Mục đích:** "Deck này dùng để làm gì?"
   Options: Content FB/Zalo · Webinar/khóa học · Pitch/proposal · Onboarding học viên · Khác

2. **Số slides:** "Khoảng bao nhiêu slides?"
   Options: Ít hơn 10 · 10–20 · Hơn 20

3. **Content:** "Bạn có outline hoặc nội dung sẵn chưa?"
   Options: Có (paste vào) · Chưa, AI tự đề xuất

   *If "Chưa": propose a standard outline based on mục đích from question 1:*
   - Content FB/Zalo: Hook → Problem → Solution (3 points) → CTA
   - Webinar/khóa học: Title → Agenda → 3–5 Content sections → Q&A → CTA
   - Pitch/proposal: Problem → Solution → Results/Proof → Offer → CTA
   - Onboarding: Welcome → What you get → How it works → Next steps → Community

4. **Ngôn ngữ:** "Ngôn ngữ chính của deck?"
   Options: Tiếng Việt · Tiếng Anh · Song ngữ

---

## Phase 2 — Style Discovery

**Load now:** `skills/slide-html/templates/index.json`
**Load now:** `skills/slide-html/STYLE_PRESETS.md`

**Steps:**

1. Use STYLE_PRESETS.md Quick Decision Matrix to identify 2–3 template categories
2. From `index.json`, filter by `occasion`, `mood`, `best_for` — pick 3 best candidates
3. For each candidate, read:
   - `skills/slide-html/templates/{slug}/design.md`
   - `skills/slide-html/templates/{slug}/template.json`
4. Generate 3 **animated title-slide HTML preview files**:
   - Save to `.claude-design/slide-previews/preview-{n}-{slug}.html`
   - Each preview: `height: 100vh`, animated entrance, user's actual deck title
   - Recreate the template's aesthetic (palette + fonts + layout) — **DO NOT copy HTML from template files**
   - If VN content + template font is in Avoid list → override with Tier 1 VN font
5. Open all 3 previews:
   ```
   open .claude-design/slide-previews/preview-1-*.html .claude-design/slide-previews/preview-2-*.html .claude-design/slide-previews/preview-3-*.html
   ```
6. Ask user to choose

---

## Phase 3 — Generate Full Deck

**Load now:**
- `skills/slide-html/references/viewport-base.css`
- `skills/slide-html/references/animation-patterns.md`
- `skills/slide-html/references/html-template.md`
- `skills/slide-html/references/vn-typography.md` ← only if VN or song ngữ

**Generate** a single self-contained HTML file. Output path:

```
output/slides/YYYY-MM-DD/{deck-slug}.html
```

Where `YYYY-MM-DD` = today's date, `deck-slug` = kebab-case deck title.

**Hard constraints — enforce on every slide, no exceptions:**

| Rule | Requirement |
|---|---|
| Slide height | `height: 100vh; overflow: hidden` |
| Font sizes | `clamp(min, preferred, max)` only — never fixed px |
| Content density | Max 6 bullets · OR 1 large stat · OR 1 quote per slide |
| VN font | Tier 1 only (see vn-typography.md) |
| Self-contained | All CSS + JS inline — zero runtime external deps |
| Google Fonts | One `<link>` in `<head>` — only allowed external call |
| Visual elements | Every content slide ≥ 1 non-text visual (icon, chart, media slot, or ornament) |
| Inline editing | Always include Edit Mode — never ask user — see spec below |
| Presenter Mode | Always include — never ask user — see spec below |
| Layer reveal | Every `[data-anim]` element is a layer — reveal one group per Next in presenter |
| Speaker notes | Every `<section class="slide">` must have `data-notes="..."` attribute |

---

### Visual Elements Standard

Every slide must contain at least one non-text visual element. Choose by slide type:

| Slide type | Required visual |
|---|---|
| Cover / Chapter | Template ornament (e.g., gold rule + decorative mark) |
| Agent / Feature | 1 inline SVG icon (Heroicons or Tabler) beside headline or kicker |
| Stats / Numbers | Visual weight: oversized numeral, CSS bar fill, or icon grid |
| Process / Steps | Numbered visual steps with connecting line or arrow SVG |
| Comparison | Divider line + column header accents |
| Demo / Placeholder | Labeled media slot — NOT a bare empty box (see Media Slots below) |
| Q&A / CTA | Decorative display text or brand mark |

**Media slots — always labeled and positioned:**

Every image/video placeholder must carry a semantic label so the presenter knows what to swap in:

```html
<!-- Use this pattern — never a plain empty div -->
<div class="media-slot" data-slot="SCREENSHOT">
  <span class="slot-label">[ SCREENSHOT ]</span>
</div>
```

Slot type vocabulary: `PHOTO` · `SCREENSHOT` · `PRODUCT` · `RESULT` · `VIDEO` · `PORTRAIT` · `DIAGRAM`

Position media slots in the layout at build time — don't leave placement decisions to the user. Suggest placement in a comment above the slot: `<!-- Replace with [type]: [what to show] -->`.

**Inline SVG icons:**

Use Heroicons outline style (MIT license, no external dependency). Embed as inline `<svg>` directly in HTML — no external icon CDN. Size with `width: clamp(1rem, 2vw, 2rem)`. Color with `currentColor` so it inherits the slide's text color.

---

### Inline Editing Standard

**Always include Edit Mode in every output. No exceptions. Never ask the user.**

Implementation: follow `html-template.md` → "Inline Editing Implementation" section exactly. Do NOT re-invent.

Summary of required behavior:

| Feature | Behavior |
|---|---|
| Trigger | `E` key (when not editing text) + floating button with 400ms hotzone |
| Text editing | `contenteditable="true"` added to all text elements on activate |
| Image editing | Click any `.media-slot` → `<input type="file">` picker → `FileReader` → base64 swap |
| Auto-save | `localStorage.setItem(deckSlug, outerHTML)` on every `input` / `blur` event |
| Export | `Ctrl+S` in edit mode → strip all edit state → download clean `.html` |
| Visual cue | Thin dashed outline on editable elements; edit banner at top |

**Edit state must be stripped before export** — see `html-template.md` `exportFile()` pattern. File saved to disk must open with zero edit chrome visible.

Restore on reload: `localStorage.getItem(deckSlug)` → if found, ask user "Restore last session?" before overwriting.

---

---

### Presenter Mode Standard

**Always include in every output. Never ask the user. Toggle with `P` key or button.**

#### Layout

```
┌────────────────────────────────┬──────────────┐
│                                │  Script/Notes │
│   Current slide (scaled 16:9)  │  (top 58%)   │
│   `#ps-main` — overflow:hidden ├──────────────┤
│                                │  Next slide  │
│   `#ps-deck-wrap` — zoom here  │  preview     │
│                                │  (bot 42%)   │
└────────────────────────────────┴──────────────┘
     72% width                       28% width
```

- Grid: `grid-template-columns: 72fr 28fr; grid-template-rows: 1fr` — single row, no bottom strip
- `#ps-main`: `overflow: hidden` — clips zoom
- `#ps-deck-wrap`: `overflow: visible; transition: transform .4s ease` — zoom applied here
- Scale slide to 16:9 fit: `scale = min(availW/100vw, availH/100vh)`, `transform-origin: top left`
- `goTo(n)` in presenter mode updates presenter view only — does **not** scroll the deck

#### Speaker Notes

Every `<section class="slide">` must have a `data-notes` attribute with the speaker script:

```html
<section class="slide dark" data-notes="Script nói cho slide này...">
```

Notes are displayed in the sidebar panel and update on slide change.

---

### Layer Reveal Standard

**In Presenter Mode, `[data-anim]` elements are the layers — hidden until manually revealed.**

#### How it works

1. When a slide renders in presenter mode: **do NOT add `is-active`** to the clone — all `[data-anim]` elements start at `opacity: 0`
2. Group elements by `--d` value (inline style `style="--d:2"`): same `--d` = same group, reveals together
3. Each **Next** action: reveal next group by adding `.layer-revealed` → triggers animation, then advance to next slide when all groups done
4. **Prev** always goes to previous slide, restarting layers from group 0

#### CSS required

```css
/* Individual layer trigger — no parent is-active needed */
[data-anim="fade-up"].layer-revealed  { animation: fadeUp   .55s var(--ease) 0ms forwards; }
[data-anim="fade-in"].layer-revealed  { animation: fadeIn   .45s ease        0ms forwards; }
[data-anim="rule"].layer-revealed     { animation: growRule .35s ease        0ms forwards; }
[data-anim="scale-in"].layer-revealed { animation: scaleIn  .55s var(--ease) 0ms forwards; }
[data-anim="reveal-r"].layer-revealed { animation: revealRight .55s var(--ease) 0ms forwards; }
```

#### Layer counter UI

Show in notes header: dots `●●○○` + `N / Total` text + Next button label changes:
- While layers remain: `Reveal (2/6) →`
- All layers done: `Next slide →`

---

### Presenter Zoom Standard

**Click anywhere on the slide in Presenter Mode → zoom in at that exact point.**

```javascript
function handleZoom(e) {
  const wrap = document.getElementById('ps-deck-wrap');
  if (zoomed) {
    wrap.style.transform = ''; wrap.style.transformOrigin = '';
    wrap.classList.remove('zoomed'); zoomed = false; return;
  }
  const rect = wrap.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
  const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
  wrap.style.transformOrigin = x + '% ' + y + '%';
  wrap.style.transform = 'scale(2.2)';
  wrap.classList.add('zoomed'); zoomed = true;
}
```

- `#ps-deck-wrap` gets `cursor: zoom-in` / `.zoomed { cursor: zoom-out }`
- Click again OR `Esc` → zoom out
- `#ps-main` clips with `overflow: hidden` so zoom never bleeds into sidebar
- Zoom resets automatically when advancing slides

---

**Navigation JS** (inline in output `<script>`):

```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});
// Touch swipe: deltaX > 50 = next, deltaX < -50 = prev
```

---

## Phase 4 — Delivery

1. Open deck in browser (substitute the actual date and slug):
   ```
   open output/slides/YYYY-MM-DD/{deck-slug}.html
   ```
2. Tell user:
   - **Normal mode:** `← →` / Space / swipe để chuyển slide
   - **Presenter Mode:** nhấn `P` → sidebar script + next preview + layer reveal từng bước
   - **Zoom (trong Presenter):** click vào slide → zoom vào điểm đó, click lại → zoom out
   - **Edit Mode:** nhấn `E` → click text để sửa, click ảnh để thay → `Ctrl+S` lưu file sạch
3. Offer optional:
   - **PDF (cross-platform — Win/Mac/Linux):** `node skills/slide-html/scripts/export-pdf.mjs output/slides/YYYY-MM-DD/{deck-slug}.html`
     - ⚠️ Dùng `.mjs` (Node) — chạy mọi OS. File `.sh` chỉ là Unix fallback.
   - **Deploy:** `vercel deploy --prod` trong folder deck (cross-platform CLI, không dùng deploy.sh)

---

## Phase 5 — PPT Convert *(nice-to-have)*

Triggered when Phase 0 detects `.pptx` file path.

**Check dependency:**
```
python3 -c "import pptx" 2>/dev/null || echo "MISSING: run pip install python-pptx"
```

If missing → prompt user to install before continuing.

**Extract content:**
```
python3 skills/slide-html/scripts/extract-pptx.py /path/to/file.pptx
```

**Read extracted content:**
```bash
cat extracted-slides.json
```
Parse the slide titles and content from the JSON. Use this as the outline for Phase 1 question 3 (content). Skip Phase 1 question 3 (answer = "Có, đã extract từ PPT") and go directly to Phase 1 question 4 (language).

---

## Output Format

| Property | Value |
|---|---|
| File | `output/slides/YYYY-MM-DD/{deck-slug}.html` |
| Dependencies | None at runtime (Google Fonts CDN only) |
| Navigation | `← →` / Space / swipe (normal mode) |
| Presenter Mode | `P` key → sidebar layout: script (top 58%) + next preview (bot 42%) |
| Layer Reveal | Next reveals one `[data-anim]` group per click; advances slide when all done |
| Zoom | Click slide in Presenter Mode → zoom 2.2× at click point; click again to reset |
| Edit Mode | `E` key or top-left hotzone → click text to edit, click media slot to replace image |
| Speaker notes | `data-notes` attribute on each `<section class="slide">` |
| Auto-save | `localStorage` — restores last session on reload |
| Export | `Ctrl+S` in Edit Mode → clean `.html` download (edit state stripped) |
| PDF | `@media print` → 1 slide = 1 page |

---
