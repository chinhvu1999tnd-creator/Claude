# VN Typography Reference

Loaded in Phase 3 when deck language = tiếng Việt or song ngữ.

## Font Tiers

| Tier | Font | Google Fonts URL param | Dùng khi |
|---|---|---|---|
| **Tier 1** | Be Vietnam Pro | `family=Be+Vietnam+Pro:wght@400;600;700` | Mọi deck VN — display + body |
| **Tier 1** | Lexend | `family=Lexend:wght@400;600;700` | Deck nhiều text, webinar |
| **Tier 1** | Nunito | `family=Nunito:wght@400;600;700;800` | Course content, onboarding |
| **Tier 1 Serif** | Playfair Display | `family=Playfair+Display:wght@700;800` | Editorial deck, pitch cao cấp — headline only, pair with Tier 1 body |
| Tier 2 | Inter | `family=Inter:wght@400;600;700` | EN-primary deck, neutral |
| Tier 2 | DM Sans | `family=DM+Sans:wght@400;600;700` | EN-primary có VN elements |
| **Avoid** | Fraunces | — | Thiếu glyph VN |
| **Avoid** | Cormorant Garamond | — | Thiếu glyph VN |
| **Avoid** | Bodoni Moda | — | Thiếu glyph VN |

## Google Fonts CDN Pattern

Use one `<link>` tag in `<head>`. Example for Be Vietnam Pro:

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet">

This is the ONLY allowed external call in the output HTML.

## Use Case → Font Pairing

| Use Case | Font (display) | Font (body) | Template candidates |
|---|---|---|---|
| Content FB/Zalo carousel | Be Vietnam Pro 700 | Be Vietnam Pro 400 | Bold Poster, People's Platform, Creative Mode |
| Webinar / khóa học live | Lexend 700 | Lexend 400 | Signal, Blue Professional, Playful |
| Lead magnet PDF | Nunito 800 | Nunito 400 | Retro Zine, Pin & Paper, Scatterbrain |
| Pitch / proposal cao cấp | Playfair Display 700 | Be Vietnam Pro 400 | Vellum, Signal, Emerald Editorial |
| Onboarding học viên | Nunito 800 | Nunito 400 | Capsule, Daisy Days, Playful |

## Override Rule

If chosen template uses an Avoid-list font (Fraunces, Cormorant, Bodoni):
1. Keep the template's color palette and layout exactly as-is
2. Replace ONLY the font with the Tier 1 recommendation for the use case
3. Adjust letter-spacing and line-height if needed (serif → sans transition may need tightening)

## clamp() Reference for Vietnamese Text

Vietnamese diacritics add visual height. Use these clamp ranges:

| Element | clamp() |
|---|---|
| Hero headline | `clamp(2.5rem, 6vw, 5rem)` |
| Section title | `clamp(1.8rem, 4vw, 3rem)` |
| Body text | `clamp(1rem, 2vw, 1.4rem)` |
| Caption / label | `clamp(0.75rem, 1.5vw, 1rem)` |
