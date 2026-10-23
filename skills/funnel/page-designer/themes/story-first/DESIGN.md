# Story First — Design Reference

## Theme Identity

**Name:** Story First  
**Mood:** Authentic · Vulnerable · Inspiring · Human  
**Best for:** Author, podcaster, life coach, mindset coach, wellness coach, YouTuber/content creator building community

---

## The Core Philosophy: Story Before Pitch

This theme is built around one insight: **people don't buy expertise — they buy belonging**.

The structural difference from every other personal brand theme is the **4-phase emotional arc** that replaces the traditional hero → features → pricing → CTA flow.

### The 4-Phase Arc

```
1. RESONANCE    → "You understand exactly how I feel"
2. STORY        → "You've been where I am — and you got through it"
3. TRANSFORMATION → "Here's what changed and what I learned"
4. INVITATION   → "Come with me — not to follow, but to walk alongside"
```

Every page section maps to one of these phases. The opening story must appear **before** the hero section — this is non-negotiable. Visitors decide in 3 seconds whether they feel seen; logic comes after.

---

## Typography System

### Font Stack

| Role | Font | Weights |
|------|------|---------|
| **Display** | Libre Baskerville | 400 (regular), 700 (bold), 400 italic |
| **Body** | Nunito Sans | 300 (light), 400 (regular), 600 (semibold) |
| **Labels/Meta** | Libre Franklin | 400, 600 |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300;400;600&family=Libre+Franklin:wght@400;600&display=swap" rel="stylesheet">
```

### Typography Roles

**Libre Baskerville (display):**
- All H1, H2, H3 headings
- Section labels that carry emotional weight
- Pull quotes (ALWAYS italic — this is the signal for vulnerability)
- Book/podcast titles

**Libre Baskerville Italic — the vulnerability signal:**
> Use italic Baskerville for the most emotionally honest moments: the moment of failure, the breakthrough insight, the most human sentence. This is the typographic equivalent of a pause in speech.

Examples of italic-appropriate copy:
- *"Năm 2019, tôi mất tất cả và không biết mình là ai nữa."*
- *"Phát triển bản thân không phải là trở thành người khác — mà là trở về với chính mình."*
- *"Câu hỏi đó đã thay đổi mọi thứ với tôi."*

**Nunito Sans 300 (body):**
- All paragraph text — light weight creates openness and breathing room
- Testimonial body text (not the pull quote)
- FAQ answers
- Feature descriptions

**Libre Franklin (labels):**
- Category tags, eyebrow labels ("Podcast · Coach · Author")
- Date/time/price metadata
- Navigation items

### Type Scale

```css
/* Hero headline */
font-size: clamp(2.5rem, 6.5vw, 4.75rem);
line-height: 1.12;
font-family: 'Libre Baskerville', serif;
font-weight: 400; /* Regular — not bold — reads as confident, not aggressive */

/* Section headline */
font-size: clamp(1.875rem, 4.5vw, 3.5rem);
line-height: 1.18;

/* Pull quote */
font-size: clamp(1.25rem, 2.5vw, 1.875rem);
font-style: italic;
line-height: 1.45;

/* Body */
font-family: 'Nunito Sans', sans-serif;
font-weight: 300;
font-size: 1rem;
line-height: 1.75; /* More open than dense content themes */
```

---

## Color System

### Palette

```css
:root {
  --accent:      #c0553d;  /* Terracotta-coral — warm, human, grounded */
  --accent-rgb:  192, 85, 61;
  --accent-text: #ffffff;
  --slate:       #3d5a80;  /* Slate blue — calm, reflective, depth */
  --slate-rgb:   61, 90, 128;
  --sage:        #6b8f71;  /* Sage green — growth, healing, nature */
  --sage-rgb:    107, 143, 113;
  --bg:          #fdfbf8;  /* Warm paper white */
  --surface:     #f5f0ea;  /* Warm off-white */
  --raised:      #ede6dc;  /* Card bg */
  --ink:         #2c1f14;  /* Warm dark brown */
  --body:        #5c4838;  /* Warm brown */
  --subtle:      #9c8878;  /* Muted warm */
  --faint:       #ddd0c4;  /* Warm border */
  --rim:         rgba(192,85,61,0.18);
}
```

### Color Role Guide

| Color | Hex | Use |
|-------|-----|-----|
| Terracotta | `#c0553d` | Primary accent, CTA buttons, pull quote borders, numbers — warm and human, not aggressive |
| Slate blue | `#3d5a80` | Secondary sections, depth moments, credibility indicators, links |
| Sage green | `#6b8f71` | Checkmarks, growth/healing content, wellness tags, nature accents |
| Warm paper | `#fdfbf8` | Page background — never pure white, always warm |
| Surface | `#f5f0ea` | Cards, alternating section backgrounds |
| Raised | `#ede6dc` | Elevated cards, testimonial blocks |
| Warm ink | `#2c1f14` | Headline text — warm brown, not cold black |

### Color Guardrails

**Use terracotta accent for:**
- Primary CTA button background
- Pull quote left border (4px)
- Section counter numbers
- Stat numbers in stats bar
- Featured card border/highlight

**Do NOT use terracotta for:**
- Section backgrounds (too assertive for this theme — use surface or raised)
- Body text
- Decorative blobs filling entire areas

**Use slate for:**
- Secondary CTA buttons
- Depth/reflection sections (e.g., milestone timeline)
- Secondary information cards
- Background of contrast sections (use with white text)

**Use sage for:**
- Checkmark icons in pricing/features
- "Growth" or "healing" content tags
- Nature SVG accents

---

## Backgrounds & Surfaces

### Background Layers

**Page background (`var(--bg)` = `#fdfbf8`):**
The page never uses pure white. The warm undertone makes it feel like high-quality paper — physically comfortable to read, like a well-loved book.

**Surface sections (`var(--surface)`):**
Used for alternating sections (stats bar, testimonial area). Adds depth without visual aggression.

**Raised cards (`var(--raised)`):**
Cards sit on top of surface sections. The layering creates a subtle paper-stack effect.

**Paper texture overlay:**
```css
.paper-texture {
  background-image: url("data:image/svg+xml,..."); /* see tailwind.config.js */
  background-size: 300px 300px;
}
```
Apply sparingly — only to 1-2 surface sections per page, at ~2.5% opacity.

### Gradient Accents (subtle only)

```css
/* Warm sunrise gradient — hero background option */
background: linear-gradient(160deg, #fdfbf8 0%, #f5f0ea 60%, #ede6dc 100%);

/* Slate depth gradient — for contrast sections */
background: linear-gradient(160deg, #3d5a80 0%, #2d4560 100%);
```

---

## Shape Language

### Border Radius

```css
--radius-btn:  12px;  /* Buttons — friendly, not pill (too soft), not sharp (wrong mood) */
--radius-card: 18px;  /* Cards */
--radius-img:  22px;  /* Portrait frame, media slots */
--radius-tag:  999px; /* Eyebrow tags/badges — pill shape for labels */
```

### Shadows (warm-tinted, never cold gray)

```css
/* Standard card */
box-shadow: 0 4px 20px rgba(44,31,20,0.08);

/* Elevated card / hover state */
box-shadow: 0 6px 28px rgba(44,31,20,0.12);

/* Terracotta accent glow — for featured elements */
box-shadow: 0 4px 20px rgba(192,85,61,0.22);

/* Slate depth — for contrast section cards */
box-shadow: 0 4px 20px rgba(61,90,128,0.15);
```

### Dividers

Use dashed or double-line dividers — they feel more organic than solid lines:
```css
/* Warm dashed divider */
border-top: 1.5px dashed var(--faint);

/* Terracotta accent rule */
border-left: 4px solid var(--accent); /* for pull quotes */
```

---

## SVG Accent System

Story First uses **organic, nature-inspired SVG motifs** as light decorative elements. These are never the main visual — they support the warm, grounded aesthetic.

### Approved Motifs

**Leaf/branch:**
```svg
<path d="M10 50C10 50 30 20 60 25C90 30 85 60 60 65C40 68 20 55 10 50Z"
      fill="rgba(107,143,113,0.12)" stroke="var(--sage)" stroke-width="1.5"
      stroke-linecap="round"/>
```

**Circle/wave (growth, continuity):**
```svg
<circle cx="50" cy="50" r="45" fill="none"
        stroke="rgba(192,85,61,0.10)" stroke-width="1.5" stroke-dasharray="4 3"/>
```

**Organic blob (portrait frame decoration):**
```svg
<ellipse cx="50%" cy="50%" rx="48%" ry="45%"
         style="border-radius:60% 40% 55% 45%/48% 52% 48% 52%;
                fill:rgba(192,85,61,0.08)"/>
```

### Usage Rules
- Max 2-3 SVG accents per section
- Always low opacity (0.08–0.15 fill, 0.25–0.40 stroke)
- Never behind body text — decorative bg only
- Corner placement preferred (top-right, bottom-left)
- Sage for nature/growth sections, terracotta for emotional/story sections

---

## Interaction States

### Buttons

```css
/* Primary — terracotta */
.btn-primary {
  background: var(--accent);
  color: white;
  border-radius: 12px;
  padding: 14px 28px;
  transition: all 0.25s ease;
}
.btn-primary:hover {
  background: #a8432c;  /* Slightly deeper on hover */
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(192,85,61,0.30);
}

/* Secondary — outline */
.btn-secondary {
  border: 1.5px solid var(--faint);
  color: var(--body);
  background: transparent;
  border-radius: 12px;
}
.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(192,85,61,0.05);
}
```

### Cards

```css
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(44,31,20,0.12);
}
/* No abrupt changes — 0.3s ease for all card transitions */
transition: all 0.3s ease;
```

---

## Scroll Reveal Animation

```js
// Gentle reveal — staggered fade-up
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100); // 100ms stagger per element
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});
```

---

## Story-First Structural Rules

### Page Order (MANDATORY)

```
1. Announcement bar
2. Navigation
3. OPENING STORY SECTION  ← Must come before hero
4. Hero section
5. Credibility / Media features
6. Stats bar
7. Milestone timeline (emotional arc)
8. Services / Offerings
9. Testimonials (transformation focus)
10. Pricing
11. Guarantee
12. CTA strip
13. FAQ
14. Footer
```

### Copy Tone Guardrails

**Language to use:**
- "Tôi muốn đồng hành cùng bạn" (not "Join now")
- "Bắt đầu từ đây" (not "Get started today")
- "Chia sẻ hành trình" (not "Course content")
- "Cộng đồng" (not "customers" or "students")
- "Mời bạn" (invitation, not command)
- "Nếu bạn cảm thấy..." (conditional empathy, not pressure)

**Language to avoid:**
- "LIMITED TIME OFFER"
- "DON'T MISS OUT"
- Countdown timers with pressure framing
- Superlatives without evidence ("the BEST," "ONLY program")
- Corporate jargon ("leverage," "synergy," "ROI-focused")
- Aggressive urgency language

### Testimonial Selection Criteria

Story-first testimonials focus on **emotional transformation**, not just outcomes:

- GOOD: "Tôi học được cách yêu thương bản thân sau nhiều năm chạy theo kỳ vọng của người khác."
- LESS IDEAL: "Tôi kiếm thêm 50 triệu/tháng sau khóa học."

Both can be real — but lead with the emotional transformation, add the practical result second.

---

## Differentiators vs. Related Themes

| Aspect | Story First | Warm Authority | Bold Persona | Minimal Mono |
|--------|------------|----------------|--------------|--------------|
| Energy | Vulnerable, human | Professional, warm | Confident, bold | Editorial, cold |
| Structure | Story before pitch | Authority before pitch | Hook before pitch | Design first |
| Headlines | Baskerville (literary) | Lora (editorial) | Heavy sans (impact) | Geometric sans |
| Emotional arc | Explicit 4-phase | Implicit credential build | Transformation promise | Expertise proof |
| CTA language | Invitation | Direction | Challenge | Statement |
| Best avatar | Life coach, author, podcaster | Business coach, consultant | Speaker, trainer | Designer, creative |

---

## What NOT to Do

| Forbidden | Why |
|-----------|-----|
| Sharp rectangular corners (0px radius) | Feels corporate, cold |
| Pure black (`#000000`) | Aggressive — use warm ink `#2c1f14` |
| Pure white backgrounds | Clinical — always warm paper |
| Countdown timers with "OFFER ENDS IN" framing | Creates anxiety vs. trust |
| Aggressive red for urgency | The terracotta accent is earthy, not alarm-red |
| Dense paragraphs (no spacing) | Story needs breathing room |
| Bullet-heavy feature lists without narrative | Lists without story feel like a brochure |
| Hero section first (before opening story) | Violates the emotional arc — kills resonance |
| "Buy now" language | Use "join," "start," "come along" |
| Dark backgrounds for primary sections | This theme is warm paper — save dark for 1 accent section max |

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Opening Story | `var(--bg)` flat | Clean warm paper — let the words breathe |
| Hero | `.bg-stack-hero` | Accent glow top + dots — subtle on warm paper |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 | `var(--bg)` flat | Milestone timeline — no pattern, narrative clarity |
| Main content 2 | `var(--surface)` flat | Services/offerings — warm alternating |
| Experience/Process | `var(--bg)` flat | Story-driven content — minimal visual noise |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots — earned trust from below |
| Pricing/Offer | `var(--surface)` flat | Gentle invitation — no aggressive glow |
| Guarantee | `var(--bg)` flat | No distraction |
| FAQ | `var(--surface)` flat | Clean |
| CTA Strip | Warm earthy solid (`var(--accent)` terracotta) | Invitation, not command |
| Footer | `var(--bg)` flat | No pattern |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Xen kẽ stacked ↔ flat. Very minimal patterns — only Hero and Testimonials use bg-stack. All other sections are flat for narrative immersion and emotional breathing room.

---

## Motion Style

**Intensity:** Subtle

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero portrait / author photo | `.float-lg` | 8s | Very slow, wide float — feels like turning a page, not hovering in space |
| Opening story section | `.reveal .delay-2` | 0.7s | Delayed reveal — the story earns its appearance, it doesn't rush in |
| Milestone timeline / story sections | `.reveal .delay-1/2/3/4/5` | 0.7s | Long stagger (150ms) between each story moment — paced like chapters |
| Standard cards | `.card-lift` | 0.3s | Gentle 2px lift — warm and human, not sharp |
| Testimonial blocks | `.reveal .delay-1/2/3` | 0.7s | Each testimonial fades in alone — emotional weight is individual |
| Leaf / nature SVG accent motifs | `.float-delay-1` / `.float-delay-2` | 9s | Offset, very slow drift on botanical accents — organic stillness |

### Theme motion rules

- Motion must feel like turning pages in a book — slow, deliberate, weight-bearing
- `.float-lg` on the portrait uses a long 8s duration; the float range should be small (6–8px) despite the class name — the motion is long in time, not large in space
- Stagger delays on story sections should be 150ms minimum — readers need time between emotional moments
- The scroll reveal threshold should be low (`0.10–0.12`) — sections enter before they're fully in view, like a paragraph coming into peripheral vision
- All continuous animations loop on duration ≥ 7s — nothing should feel restless or urgent
- Card lift on hover is the only interaction-triggered motion; everything else is scroll or load driven

### Không dùng (off-limits cho theme này)

- `.shimmer-border`, `.shimmer-border-slow` — shimmer suggests commerce/sale, which conflicts with this invitation-based tone
- `.blob`, `.blob-accent`, `.blob-cyan`, `.blob-purple` — blobs are visually assertive; this theme is paper-quiet
- `.scan-line` — cold technical scan is the antithesis of warm vulnerability
- `.btn-glow` — glowing buttons feel promotional, not invitational
- `.icon-breathe` — pulsing icons make the page feel like an app; this is a book, not a dashboard
- `.dot-pulse`, `.animate-live` — urgency signals violate the "no pressure" tone guardrail
- `.flow-line-h`, `.flow-line-v` — directional flow lines feel like a sales funnel; wrong for narrative immersion
- `.bg-mesh-animated` — animated backgrounds are distracting during intimate reading
