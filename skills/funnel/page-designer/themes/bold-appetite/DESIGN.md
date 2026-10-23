# Bold Appetite — Design Reference

## Theme Identity

**Name:** Bold Appetite  
**Mood:** Rich · Indulgent · Warm · Artisan Premium  
**Best for:** Premium restaurant, upscale cafe, artisan food brand, culinary course, food delivery premium  
**Avoid:** Healthcare, tech, formal B2B, children's brands

---

## Color System

```css
:root {
  --accent:      #e8742a;  /* Cam lửa — primary CTA, prices, highlights */
  --accent-rgb:  232, 116, 42;
  --accent-text: #ffffff;
  --yellow:      #f5c842;  /* Vàng ấm — ratings, badges, bonus callouts */
  --yellow-rgb:  245, 200, 66;
  --cream:       #f5ead8;  /* Kem vàng — headings, light accent */
  --alert:       #c0392b;  /* Red — urgency, limited seats */
  --bg:          #1a1008;  /* Nâu tối ấm — main canvas */
  --surface:     #231608;  /* Cards, sections (slightly lighter) */
  --raised:      #2e1e0a;  /* Raised cards, modals */
  --ink:         #f5ead8;  /* Primary text on dark */
  --body:        #d4c4a8;  /* Body text, descriptions */
  --subtle:      #8a7560;  /* Muted labels, captions */
  --faint:       #3d2d1a;  /* Borders, dividers */
  --rim:         rgba(232,116,42,0.22);  /* Card border glow */
}
```

### Color Usage Rules
- **Never use pure white (`#ffffff`) for backgrounds** — kills the warm restaurant ambiance
- **Never use cold grays** — all neutrals must be warm-tinted
- **Orange (`--accent`):** CTAs, prices, active states, divider accents, icon highlights
- **Yellow (`--yellow`):** Star ratings, "Chef's Choice" badges, feature callouts, gold highlights
- **Cream (`--ink`, `--cream`):** Main headings, hero copy, nav links
- **Dark shades alternate:** `--bg` → `--surface` → `--raised` creates depth without light sections

---

## Typography

### Font Stack
```
Display:  Fraunces (Google Fonts) — editorial serif with optical sizing
Body:     DM Sans — clean, modern legibility on dark
Mono:     DM Mono — prices, table data, codes
```

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Typography Rules
- **Fraunces 700** — all section headings, hero headlines
- **Fraunces italic** — food item names, chef quotes, emphasis phrases (creates appetite appeal)
- **DM Sans 400/500** — body copy, navigation, labels, descriptions
- **DM Sans 600** — sub-headings, UI labels, button text
- **DM Mono 400/500** — ALL prices (VND amounts), table data, seat counts

### Scale
| Token | Size | Use |
|-------|------|-----|
| display-2xl | clamp(3rem, 8vw, 7rem) | Hero headline |
| display-xl  | clamp(2.25rem, 6vw, 5rem) | Section heading |
| display-lg  | clamp(1.75rem, 4vw, 3.5rem) | Card heading |
| xl | 1.25rem | Sub-headings |
| base | 1rem | Body |
| sm | 0.875rem | Labels, captions |
| xs | 0.75rem | Fine print |

---

## Grain Texture

Every section uses a subtle noise overlay to evoke:
- Artisan, handcrafted feel
- Aged paper / restaurant menu texture
- Premium print quality

### Implementation
```html
<!-- Apply as pseudo-element or overlay div -->
<div class="grain-overlay"></div>
```

```css
.grain-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}

/* Or as background-image mix */
section {
  background-image: 
    url("data:image/svg+xml,..."),  /* grain */
    linear-gradient(to bottom, var(--bg), var(--surface));
}
```

**Opacity rules:**
- Default: `0.04` — barely visible, atmospheric
- Maximum: `0.07` — for strong CTA sections
- Never exceed `0.08` — becomes distracting

---

## Photography Treatment

### Warm Filter (CSS)
All food images get this filter to warm, unify, and make food look more appetizing:
```css
.food-image {
  filter: sepia(0.15) saturate(1.2) brightness(0.95);
}
```

### Full-Bleed Slots
- Hero: `100vw × 100vh` image taking 50–65% of screen width (right panel)
- Feature cards: `100%` width, `aspect-ratio: 4/3` or `3/2`
- Menu items: `80×80px` square thumbnails (rounded 12px)

### Overlay Technique
For text over images:
```css
.image-overlay {
  background: linear-gradient(
    to right,
    rgba(26,16,8,0.92) 40%,
    rgba(26,16,8,0.4)  70%,
    rgba(26,16,8,0.1) 100%
  );
}
```

---

## Card Backgrounds

Three card levels based on elevation:
```
Level 0 (canvas):  bg: #1a1008
Level 1 (surface): bg: #231608  + border: 1px solid #3d2d1a
Level 2 (raised):  bg: #2e1e0a  + border: 1px solid rgba(232,116,42,0.22)
Level 3 (featured): bg: #2e1e0a + box-shadow: 0 4px 24px rgba(232,116,42,0.20)
```

### Card Rules
- Border radius: `12px` standard, `20px` large image cards
- Featured card always gets `--rim` border + warm glow shadow
- Hover: `transform: translateY(-2px)` + slightly brighter `--rim` border

---

## Menu-Style Layout

Inspired by printed restaurant menus:

```
Item Name (Fraunces italic, left)     ......     285K (DM Mono, right)
Short description in DM Sans body text, 2 lines max
```

### Separator
Use dot leaders or orange line:
```css
.menu-dots {
  flex: 1;
  border-bottom: 1px dotted var(--faint);
  margin: 0 12px;
  margin-bottom: 6px;
}
```

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — warm amber glow sets appetite mood |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 (Rooms/Features/Problem) | `.bg-stack-section` | Light accent + dots |
| Main content 2 (Grid/Agents/Solution) | `.bg-stack-section-grid` | Light accent + grid |
| Experience/Process/How it works | `.bg-stack-dual` | Dual glow + dots |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots — warm amber glow reinforces artisan warmth |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid |
| Guarantee | `var(--surface)` flat | Trust, no distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip (final) | Warm amber/red solid | Override per theme — `var(--accent)` or deep warm solid |
| Footer | `var(--bg)` flat | No pattern |

**Note (bold-appetite theme):** `.bg-stack-trust` with warm amber glow is particularly effective for the Testimonials section — the bottom-origin glow feels like candlelight rising, reinforcing the artisan dining atmosphere. Accent overlays use `--accent` (cam lửa) tone which renders as warm amber depth on the dark brown canvas.

**4-Phase Arc (emotional journey):**

| Phase | Section Order | BG | Purpose |
|-------|-------------|----|---------| 
| **Hunger** | Announcement + Nav + Hero | `--bg` | Trigger desire, establish brand |
| **Desire** | Stats + Menu Showcase | `--surface` | Show the offering, build appetite |
| **Trust** | Story + Testimonials + Guarantee | `.bg-stack-trust` / `--surface` | Credibility, chef authenticity |
| **Reservation** | Packages + Availability CTA + Footer | `--bg` | Convert, close |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Phải xen kẽ `var(--bg)` ↔ `var(--surface)` và stacked ↔ flat.

---

## Shadows & Glows

```css
/* Featured card */
box-shadow: 0 4px 24px rgba(232,116,42,0.20);

/* Large featured */
box-shadow: 0 8px 48px rgba(232,116,42,0.25);

/* Subtle */
box-shadow: 0 2px 12px rgba(232,116,42,0.15);

/* Button hover */
box-shadow: 0 4px 20px rgba(232,116,42,0.35);
```

---

## Border Radius System

| Use | Radius |
|-----|--------|
| Buttons | `6px` |
| Input fields | `6px` |
| Standard cards | `12px` |
| Image cards, large | `20px` |
| Badges/pills | `999px` |
| Avatars | `50%` |

---

## Animation Guidelines

| Animation | Timing | Use |
|-----------|--------|-----|
| `fade-up` | 0.7s ease | Section entry, card reveal |
| `fade-in` | 0.5s ease | Overlay elements |
| `sway` | 4s ease-in-out infinite | Decorative leaf/herb elements |
| Hover scale | 0.2s ease | Image cards, CTAs |
| Hover translate | 0.2s ease | Feature cards (lift effect) |

Scroll reveal: Use `IntersectionObserver` with `fade-up` class toggle.

---

## Button System

```css
/* Primary — accent orange */
.btn-primary {
  background: var(--accent);
  color: var(--accent-text);
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 20px rgba(232,116,42,0.35);
  transform: translateY(-1px);
}

/* Secondary — ghost cream */
.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--faint);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  padding: 13px 27px;
  border-radius: 6px;
}
.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
```

---

## Guardrails — Do Not

- No clinical white backgrounds
- No cold blue/purple/green tones
- No geometric, hard-edged illustrations
- No corporate stock photography treatment
- No sans-serif for food item names (always Fraunces italic)
- No pure black (#000) — always warm dark browns
- No flat, unshaded icons — use warm color fills
- No countdown timers with digital displays — use natural seat availability instead

---

## Motion Style

**Intensity:** Medium

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Food photography hero / feature cards | `.float-sm` | 3.5s | Gentle vertical bob — food looks freshly plated, alive on screen |
| Menu item cards on hover | `.card-lift-accent` | 0.2s | Lift + warm orange shadow increase — inviting, "reach for it" impulse |
| Hero background ambient glow | `.blob-accent` (amber override) | 10s | Single blob behind hero — override to `rgba(232,116,42,0.09)` warm amber |
| Food category icons | `.icon-breathe` | 3s | Slow scale pulse — makes categories feel warm and alive, like a flame |
| Section content blocks | `.reveal` | 0.6s | Standard scroll fade-up for all section content |
| Menu section items | `.reveal` + `.delay-1` → `.delay-3` | 0.6s | Staggered entry — dishes appearing one by one like being brought to the table |

### Theme motion rules

- `.float-sm` on food photography creates the visual illusion of aroma and freshness — use 3.5s+ duration
- `.card-lift-accent` uses the orange `--accent` color for the shadow glow — reinforces warmth
- Blob color MUST be overridden to amber/orange tones — `rgba(232,116,42,0.09)` — never default neon/cyan/purple
- `.icon-breathe` on food category icons at 3s duration feels like a gentle flame or a simmering pot
- `.reveal` stagger for menu items should feel like dishes being served — a natural, unhurried sequence
- Grain overlay and motion coexist — the grain is static texture, motion is layered on top

### Không dùng (off-limits cho theme này)

- `.scan-line` — tech/dashboard aesthetic completely wrong for warm F&B context
- `.flow-line-h`, `.flow-line-v` — pipeline animations feel industrial kitchen, not premium dining
- `.shimmer-border` — neon shimmer breaks the warm artisan premium mood
- `.bg-mesh-animated` — multi-color animated mesh is too tech/abstract for a food brand
- `.blob-purple`, `.blob-cyan` — cold colors destroy the warm amber/brown atmosphere
- `.btn-glow` with default neon colors — if used at all, override strictly to `rgba(232,116,42,0.4)` warm glow
