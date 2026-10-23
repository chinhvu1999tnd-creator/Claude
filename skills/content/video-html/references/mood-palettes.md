# Mood Palettes — Visual Design Principles

> Loaded by `prompts/html-generator.md`. Defines palette per mood + typography + glow rules + background patterns.
> Ported verbatim from prompts.ts PHẦN 3 (lines 174-210).

═══════════════════════════════════════════════════════════════════
PHẦN 3 — VISUAL DESIGN PRINCIPLES
═══════════════════════════════════════════════════════════════════

PALETTE THEO MOOD (tham khảo, có thể tinh chỉnh):

  dramatic     : bg radial #0a0a14 → #1a0e08, accent #FF3838 / #FFD93D
  energetic    : bg radial #0f1f0a → #1a2a14, accent #DFFF00 / #BFFF00
  calm         : bg #0e1410 → #14201a, accent #9DFF66 / #66E5FF
  tech         : bg #050a08 → #0f1f1a, accent #39FF14 / #00FFFF (neon green/cyan)
  luxury       : bg #0a0a05 → #1a1408, accent #DFFF00 / #FFD700 (gold)
  mystery      : bg radial #0e0a14 → #050208, accent #BFFF00 / #B266FF
  playful      : bg #14140a → #0a1414, accent #DFFF00 / #FF66B2
  inspiring    : bg #0a0e0f → #14201a, accent #CCFF00 / #66E5FF
  breaking     : bg #0a0000 → #2a0808, accent #FF0000 / #FFD700 (red flash)
  dark         : bg #050505 → #0a0a0a, accent #FFFFFF + tiny color highlight

TYPOGRAPHY (cinematic):
  Headline       : 100-160px, weight 800-900, letter-spacing -0.02em, line-height 1.0
  Sub-headline   : 60-80px, weight 600-700
  Body/quote     : 36-48px, weight 500
  Label/chip     : 24-32px, weight 600, uppercase, letter-spacing 0.1em
  Number reveal  : 200-280px (siêu lớn), weight 900
  Callout box    : 28-36px trong padded box

GLOW / TEXT-SHADOW:
  Strong glow  : text-shadow: 0 0 40px <accent>, 0 0 20px <accent>
  Soft glow    : text-shadow: 0 0 20px <accent>40 (40 = 25% alpha)
  Solid neon   : color <accent>, text-shadow 0 0 30px currentColor

BACKGROUND PATTERNS:
  Radial glow         : radial-gradient(ellipse at 30% 20%, <hot> 0%, <dark> 70%)
  Linear cinematic    : linear-gradient(135deg, <a> 0%, <b> 100%)
  Stars/particles     : <div class="stars"> + 20-50 spans absolute positioned
  Grid lines          : background-image với linear-gradient repeating
  Conic accent        : conic-gradient(from 45deg, ...)

## Brand Override (kit-specific)

Khi `BUSINESS.md` có `voice_signature` hoặc `THEME.md` có `--brand-primary` / `--brand-accent`:
- Override palette mood → dùng brand colors
- Vẫn giữ bg dark, swap accent
- Font heading: load từ `THEME.md.--font-heading` thay system-ui
