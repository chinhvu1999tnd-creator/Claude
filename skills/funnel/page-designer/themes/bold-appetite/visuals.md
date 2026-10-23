# Bold Appetite — Visuals Reference

## Food Photography Slots

### Hero Full-Bleed
```html
<div class="hero-photo-slot">
  <!-- Replace src with actual food photography -->
  <img src="[FOOD_HERO_IMAGE]" 
       alt="[Dish name]"
       class="hero-photo"
       style="filter: sepia(0.15) saturate(1.2) brightness(0.95);">
  <!-- Gradient overlay for text contrast -->
  <div class="hero-overlay"></div>
</div>
```
```css
.hero-photo-slot {
  position: relative;
  width: 60%;
  height: 100vh;
  overflow: hidden;
}
.hero-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.15) saturate(1.2) brightness(0.95);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to left,
    rgba(26,16,8,0) 0%,
    rgba(26,16,8,0.7) 100%
  );
}
```

### Food Card Thumbnail
```html
<div class="food-thumb" style="width:80px;height:80px;border-radius:12px;overflow:hidden;">
  <img src="[ITEM_IMAGE]" style="width:100%;height:100%;object-fit:cover;filter:sepia(0.15) saturate(1.2);">
</div>
```

### Feature Card (4:3 ratio)
```html
<div class="food-feature" style="aspect-ratio:4/3;border-radius:20px;overflow:hidden;">
  <img src="[FEATURE_IMAGE]" style="width:100%;height:100%;object-fit:cover;filter:sepia(0.15) saturate(1.2) brightness(0.92);">
</div>
```

### Warm Filter Reference
```css
/* Standard warm food filter */
filter: sepia(0.15) saturate(1.2) brightness(0.95);

/* Deeper warmth for hero */
filter: sepia(0.20) saturate(1.25) brightness(0.90);

/* Subtle for backgrounds */
filter: sepia(0.10) saturate(1.1) brightness(0.85);
```

---

## Organic Food SVG Illustrations

### Steam Wisps (for hot dishes)
```svg
<svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 70 C15 55 25 50 20 35 C15 20 25 15 20 5" 
        stroke="#e8742a" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
  <path d="M30 70 C30 52 18 48 22 33 C26 18 18 12 22 2" 
        stroke="#e8742a" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
  <path d="M45 70 C45 56 35 51 40 36 C45 21 35 16 40 6" 
        stroke="#e8742a" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>
</svg>
```

### Herb / Leaf Sprig (sway animation)
```svg
<svg class="animate-sway" width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 58 C20 40 20 20 20 8" stroke="#8a7560" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="12" cy="25" rx="10" ry="6" fill="#4a6741" opacity="0.8" transform="rotate(-30 12 25)"/>
  <ellipse cx="28" cy="18" rx="10" ry="6" fill="#4a6741" opacity="0.8" transform="rotate(25 28 18)"/>
  <ellipse cx="14" cy="10" rx="8" ry="5" fill="#5a7a50" opacity="0.7" transform="rotate(-20 14 10)"/>
</svg>
```

### Chopsticks Icon
```svg
<svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="2" width="3" height="44" rx="1.5" fill="#e8742a" transform="rotate(-5 6 2)"/>
  <rect x="23" y="2" width="3" height="44" rx="1.5" fill="#e8742a" transform="rotate(5 23 2)"/>
</svg>
```

### Bowl / Plate Icon
```svg
<svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="28" rx="30" ry="10" fill="#2e1e0a" stroke="#3d2d1a" stroke-width="1.5"/>
  <path d="M4 26 C4 14 16 6 32 6 C48 6 60 14 60 26" fill="#231608" stroke="#3d2d1a" stroke-width="1.5"/>
  <ellipse cx="32" cy="10" rx="18" ry="5" fill="#1a1008" stroke="#3d2d1a" stroke-width="1"/>
</svg>
```

### Fork Icon (for ratings instead of stars)
```svg
<svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <line x1="4" y1="2" x2="4" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="8" y1="2" x2="8" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="12" y1="2" x2="12" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M4 8 C4 11 12 11 12 8" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <line x1="8" y1="10" x2="8" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

### Chili Pepper Badge
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 17 C6 17 3 13 4 9 C5 5 9 3 12 4 C14 5 14 7 13 8 C16 7 18 9 17 12 C16 15 13 17 10 17Z" 
        fill="#c0392b"/>
  <path d="M12 4 C13 2 15 1 16 2" stroke="#4a6741" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

### Leaf / Fresh Badge
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 17 C5 17 2 12 3 7 C4 3 9 1 14 3 C17 5 17 10 14 13 C12 16 10 17 10 17Z" 
        fill="#4a6741" opacity="0.9"/>
  <path d="M10 17 C10 12 10 7 10 3" stroke="#5a8a50" stroke-width="1" stroke-linecap="round"/>
  <path d="M10 10 C8 8 6 9 5 11" stroke="#5a8a50" stroke-width="0.8" stroke-linecap="round"/>
  <path d="M10 13 C12 11 14 12 15 14" stroke="#5a8a50" stroke-width="0.8" stroke-linecap="round"/>
</svg>
```

---

## Menu-Inspired Typography Layouts

### Classic Menu Item
```html
<div class="menu-item" style="display:flex;align-items:baseline;gap:8px;padding:16px 0;border-bottom:1px solid #3d2d1a;">
  <div style="flex:1;">
    <div style="font-family:'Fraunces',serif;font-style:italic;font-size:1.1rem;color:#f5ead8;">
      Bò Lúc Lắc
    </div>
    <div style="font-family:'DM Sans',sans-serif;font-size:0.85rem;color:#8a7560;margin-top:4px;">
      Thăn bò Mỹ, tiêu đen Campuchia, rau mầm
    </div>
  </div>
  <div style="font-family:'DM Mono',monospace;color:#e8742a;font-size:1rem;white-space:nowrap;">
    285K
  </div>
</div>
```

### Menu Category Header
```html
<div class="menu-category-header" style="padding:12px 0;margin-bottom:8px;">
  <span style="font-family:'DM Sans',sans-serif;font-size:0.7rem;font-weight:600;
               letter-spacing:0.15em;text-transform:uppercase;color:#8a7560;">
    ── Món Chính ──
  </span>
</div>
```

### Price Display Variants
```html
<!-- Standard price -->
<span style="font-family:'DM Mono',monospace;color:#e8742a;">285.000đ</span>

<!-- Compact price -->
<span style="font-family:'DM Mono',monospace;color:#e8742a;">285K</span>

<!-- Price with original crossed out -->
<span style="font-family:'DM Mono',monospace;color:#8a7560;text-decoration:line-through;margin-right:8px;">350K</span>
<span style="font-family:'DM Mono',monospace;color:#e8742a;">285K</span>
```

---

## Chef Portrait Treatment

```html
<div class="chef-portrait" style="position:relative;display:inline-block;border-radius:20px;overflow:hidden;">
  <img src="[CHEF_IMAGE]" style="width:100%;height:auto;filter:sepia(0.20) saturate(1.1) brightness(0.88);">
  <!-- Warm overlay -->
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(26,16,8,0.6) 0%,rgba(26,16,8,0) 50%);"></div>
  <!-- Name plate -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;">
    <div style="font-family:'Fraunces',serif;font-style:italic;color:#f5ead8;font-size:1.2rem;">Chef Nguyễn Văn Minh</div>
    <div style="font-family:'DM Sans',sans-serif;font-size:0.8rem;color:#d4c4a8;">12 năm kinh nghiệm · Singapore & Paris</div>
  </div>
</div>
```

---

## Food Rating — Fork + Star Icons

```html
<div class="food-rating" style="display:flex;align-items:center;gap:6px;">
  <!-- Fork icons instead of stars -->
  <span style="color:#f5c842;font-size:1rem;">🍴🍴🍴🍴🍴</span>
  <!-- Or SVG fork icons -->
  <span style="font-family:'DM Mono',monospace;color:#f5c842;font-size:0.9rem;">4.9</span>
  <span style="font-family:'DM Sans',sans-serif;font-size:0.8rem;color:#8a7560;">(2,400 đánh giá)</span>
</div>
```

### Fork SVG Rating (inline)
```html
<div style="display:flex;gap:4px;color:#f5c842;">
  <!-- Repeat fork SVG 5 times, color #f5c842 for full, #3d2d1a for empty -->
  <svg width="14" height="20" viewBox="0 0 16 24" fill="none">
    <line x1="4" y1="2" x2="4" y2="8" stroke="#f5c842" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="8" y1="2" x2="8" y2="8" stroke="#f5c842" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="12" y1="2" x2="12" y2="8" stroke="#f5c842" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M4 8 C4 11 12 11 12 8" stroke="#f5c842" stroke-width="1.5" fill="none"/>
    <line x1="8" y1="10" x2="8" y2="22" stroke="#f5c842" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</div>
```

---

## Ingredient Sourcing Map

Visual element showing provenance of ingredients — creates trust and premiumness:

```html
<div class="sourcing-map" style="background:#231608;border-radius:20px;padding:32px;border:1px solid #3d2d1a;">
  <h3 style="font-family:'Fraunces',serif;color:#f5ead8;margin-bottom:24px;">Nguyên liệu từ nguồn</h3>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;">
    
    <div style="text-align:center;">
      <!-- Location pin icon -->
      <div style="font-size:1.5rem;margin-bottom:8px;">📍</div>
      <div style="font-family:'Fraunces',serif;font-style:italic;color:#e8742a;font-size:0.95rem;">Đà Lạt</div>
      <div style="font-family:'DM Sans',sans-serif;font-size:0.78rem;color:#8a7560;">Rau sạch · Nấm</div>
    </div>
    
    <div style="text-align:center;">
      <div style="font-size:1.5rem;margin-bottom:8px;">📍</div>
      <div style="font-family:'Fraunces',serif;font-style:italic;color:#e8742a;font-size:0.95rem;">Phan Thiết</div>
      <div style="font-family:'DM Sans',sans-serif;font-size:0.78rem;color:#8a7560;">Hải sản tươi</div>
    </div>
    
    <div style="text-align:center;">
      <div style="font-size:1.5rem;margin-bottom:8px;">📍</div>
      <div style="font-family:'Fraunces',serif;font-style:italic;color:#e8742a;font-size:0.95rem;">Mỹ Quốc</div>
      <div style="font-family:'DM Sans',sans-serif;font-size:0.78rem;color:#8a7560;">Thăn bò Wagyu</div>
    </div>
    
    <div style="text-align:center;">
      <div style="font-size:1.5rem;margin-bottom:8px;">📍</div>
      <div style="font-family:'Fraunces',serif;font-style:italic;color:#e8742a;font-size:0.95rem;">Campuchia</div>
      <div style="font-family:'DM Sans',sans-serif;font-size:0.78rem;color:#8a7560;">Tiêu Kampot</div>
    </div>
    
  </div>
</div>
```

---

## SVG Placeholder Slots

Use these for development/prototyping before real photography:

### Hero Placeholder (food bowl with steam)
```html
<div style="width:100%;height:100%;background:#2e1e0a;display:flex;align-items:center;justify-content:center;border-radius:20px;">
  <svg width="200" height="220" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Bowl -->
    <ellipse cx="100" cy="160" rx="85" ry="25" fill="#3d2d1a"/>
    <path d="M20 155 C20 125 55 105 100 105 C145 105 180 125 180 155" fill="#231608" stroke="#3d2d1a" stroke-width="2"/>
    <!-- Food surface -->
    <ellipse cx="100" cy="108" rx="70" ry="18" fill="#e8742a" opacity="0.3"/>
    <!-- Steam wisps -->
    <path d="M70 100 C70 82 82 78 76 60 C70 42 82 38 76 22" stroke="#e8742a" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M100 100 C100 80 88 76 94 56 C100 36 88 32 94 16" stroke="#e8742a" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
    <path d="M130 100 C130 82 118 78 124 60 C130 42 118 38 124 22" stroke="#e8742a" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>
    <!-- Garnish dots -->
    <circle cx="85" cy="112" r="4" fill="#4a6741" opacity="0.8"/>
    <circle cx="115" cy="108" r="3" fill="#4a6741" opacity="0.7"/>
    <circle cx="100" cy="104" r="3.5" fill="#c0392b" opacity="0.7"/>
  </svg>
</div>
```

### Menu Item Placeholder (60×60)
```html
<div style="width:60px;height:60px;background:#2e1e0a;border-radius:12px;display:flex;align-items:center;justify-content:center;">
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="18" r="12" fill="#3d2d1a" stroke="#e8742a" stroke-width="1" opacity="0.6"/>
    <ellipse cx="16" cy="10" rx="8" ry="3" fill="#3d2d1a" stroke="#e8742a" stroke-width="1" opacity="0.4"/>
  </svg>
</div>
```
