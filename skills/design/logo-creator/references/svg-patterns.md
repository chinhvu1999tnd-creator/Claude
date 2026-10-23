# SVG Patterns & Techniques

Reference cho Logo Creator skill — các pattern, snippet và kỹ thuật SVG tái sử dụng.

---

## 1. Lettermark

### Đơn giản — 1-3 chữ cái
```svg
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="80" rx="16" fill="#141413"/>
  <text x="40" y="52" font-family="Inter, sans-serif" font-size="32"
        font-weight="900" fill="#B6FF00" text-anchor="middle"
        letter-spacing="-2">AB</text>
</svg>
```

### Với underline accent
```svg
<text x="40" y="46" ...>OPC</text>
<rect x="14" y="52" width="52" height="2.5" rx="1.25" fill="#B6FF00"/>
```

### Split-weight (bold + light)
```svg
<text font-weight="900" fill="#faf9f5">OPC</text>
<text font-weight="300" fill="#b0aea5"> AI</text>
```

---

## 2. Geometric Shapes

### Circle với inner element
```svg
<circle cx="40" cy="40" r="28" stroke="#B6FF00" stroke-width="2.5" fill="none"/>
<circle cx="40" cy="40" r="8" fill="#B6FF00"/>
```

### Triangle / Network
```svg
<polygon points="40,12 68,56 12,56" fill="none" stroke="#B6FF00" stroke-width="2.5"/>
```

### Hexagon
```svg
<polygon points="40,10 62,22.5 62,47.5 40,60 18,47.5 18,22.5"
         fill="none" stroke="#B6FF00" stroke-width="2"/>
```

### Diamond
```svg
<polygon points="40,12 68,40 40,68 12,40" fill="none" stroke="#B6FF00" stroke-width="2"/>
```

---

## 3. Abstract / Organic

### Arc / Orbit
```svg
<path d="M 20 40 A 20 20 0 1 1 60 40" stroke="#B6FF00" stroke-width="3"
      fill="none" stroke-linecap="round"/>
```

### Wave
```svg
<path d="M 10 40 Q 25 20 40 40 Q 55 60 70 40"
      stroke="#B6FF00" stroke-width="3" fill="none"/>
```

### Spiral-like
```svg
<path d="M 40 40 m -20 0 a 20 20 0 1 1 40 0 a 14 14 0 1 1 -28 0 a 8 8 0 1 1 16 0"
      stroke="#B6FF00" stroke-width="2" fill="none"/>
```

---

## 4. Icon + Wordmark (Horizontal)

ViewBox: `0 0 200 60`

```svg
<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon bên trái -->
  <rect x="8" y="8" width="44" height="44" rx="10" fill="#1E1E1C"/>
  <circle cx="30" cy="30" r="12" stroke="#B6FF00" stroke-width="2" fill="none"/>
  <circle cx="30" cy="30" r="4" fill="#B6FF00"/>
  <!-- Text bên phải -->
  <text x="62" y="28" font-family="Inter" font-size="16" font-weight="900"
        fill="#faf9f5">BRAND</text>
  <text x="62" y="46" font-family="Inter" font-size="11" font-weight="400"
        fill="#b0aea5" letter-spacing="2">TAGLINE</text>
</svg>
```

---

## 5. Badge / Emblem

```svg
<!-- Circle badge -->
<circle cx="40" cy="40" r="34" stroke="#B6FF00" stroke-width="2" fill="#1E1E1C"/>
<circle cx="40" cy="40" r="28" stroke="#B6FF00" stroke-width="0.75" fill="none" opacity="0.4"/>
<text x="40" y="44" text-anchor="middle" font-size="14" font-weight="900" fill="#faf9f5">BRAND</text>
```

---

## 6. Network / AI / Tech Pattern

```svg
<!-- Nodes connected — triangle of 3 dots -->
<circle cx="40" cy="20" r="4" fill="#B6FF00"/>
<circle cx="20" cy="55" r="4" fill="#B6FF00"/>
<circle cx="60" cy="55" r="4" fill="#B6FF00"/>
<line x1="40" y1="20" x2="20" y2="55" stroke="#B6FF00" stroke-width="1.5" opacity="0.6"/>
<line x1="40" y1="20" x2="60" y2="55" stroke="#B6FF00" stroke-width="1.5" opacity="0.6"/>
<line x1="20" y1="55" x2="60" y2="55" stroke="#B6FF00" stroke-width="1.5" opacity="0.6"/>
```

---

## 7. Color Layering

### Primary accent + ghost
```svg
<rect ... fill="#B6FF00"/>                    <!-- solid primary -->
<rect ... fill="#B6FF00" opacity="0.15"/>     <!-- ghost layer -->
<rect ... stroke="#B6FF00" fill="none"/>      <!-- outline only -->
```

### Multi-color accent
```svg
<circle ... fill="#B6FF00"/>   <!-- primary -->
<circle ... fill="#00C2FF"/>   <!-- secondary -->
<circle ... fill="#A855F7"/>   <!-- tertiary -->
```

---

## 8. Composition Rules

- **Padding:** Ít nhất 8px margin từ edge của viewBox
- **Visual center:** Hơi cao hơn trung tâm toán học (optical center)
- **Stroke width:** 1.5–3px cho 80×80 viewBox
- **Text size trong 80×80:** Title 24-32px, subtitle 10-12px
- **Contrast:** Text/element trên nền tối → dùng màu sáng (#faf9f5, accent)

---

## 9. Common Backgrounds

```svg
<!-- Dark rounded square (app icon style) -->
<rect width="80" height="80" rx="16" fill="#141413"/>

<!-- No background (transparent) — không có rect -->

<!-- Surface color -->
<rect width="80" height="80" rx="16" fill="#1E1E1C"/>

<!-- Circle background -->
<circle cx="40" cy="40" r="40" fill="#141413"/>
```

---

## 10. Standalone SVG Header

Khi ghi file SVG, luôn dùng header đầy đủ:

```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg width="80" height="80" viewBox="0 0 80 80"
     xmlns="http://www.w3.org/2000/svg"
     role="img" aria-label="[Brand Name] Logo">
  <!-- content -->
</svg>
```
