/**
 * bright-learn — Tailwind Config
 *
 * SCOPE: Font · Layout · Animation ONLY
 * Colors → CSS variables in :root (not here)
 *
 * Why: Tailwind CDN bakes colors at parse time.
 * CSS vars change at runtime → only CSS vars are truly themeable.
 * Rule: NEVER define colors here. Use style="color:var(--token)" in HTML.
 */

tailwind.config = {
  theme: {
    extend: {

      /* ── Fonts ──────────────────────────────────────────
         Plus Jakarta Sans: display/headings — modern, rounded feel, friendly authority
         Inter: body copy — highly legible at small sizes
         DM Mono: prices, labels, stats — readable mono
         No Playfair — editorial serif doesn't fit education context
      ──────────────────────────────────────────────────── */
      fontFamily: {
        display:   ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:      ['Inter', 'system-ui', 'sans-serif'],
        mono:      ['"DM Mono"', 'monospace'],
      },

      /* ── Border radius ─────────────────────────────────
         Significantly rounder than dark-bold-neon (6px) —
         conveys approachable, friendly, safe-to-learn
      ──────────────────────────────────────────────────── */
      borderRadius: {
        btn:  '10px',
        card: '16px',
        xl2:  '20px',
        xl3:  '28px',
      },

      /* ── Font size scale ──────────────────────────────── */
      fontSize: {
        'display': ['clamp(2.5rem,6.5vw,5rem)',        { lineHeight:'1.05', letterSpacing:'-0.035em', fontWeight:'800' }],
        'h1':      ['clamp(1.875rem,4.5vw,3rem)',      { lineHeight:'1.1',  letterSpacing:'-0.025em', fontWeight:'800' }],
        'h2':      ['clamp(1.5rem,3.5vw,2.25rem)',     { lineHeight:'1.15', letterSpacing:'-0.02em',  fontWeight:'700' }],
        'h3':      ['clamp(1.125rem,2vw,1.375rem)',    { lineHeight:'1.3',  letterSpacing:'-0.01em',  fontWeight:'600' }],
        'label':   ['11px',                             { lineHeight:'1',    letterSpacing:'0.08em',   fontWeight:'600' }],
        'metric':  ['clamp(2rem,4.5vw,3.25rem)',       { lineHeight:'1',    letterSpacing:'-0.03em',  fontWeight:'800' }],
      },

      /* ── Animations ────────────────────────────────────
         Gentler, softer than dark-bold-neon — no aggressive blobs
      ──────────────────────────────────────────────────── */
      animation: {
        'float':     'float 5s ease-in-out infinite',
        'float-2':   'float 6s ease-in-out infinite 1.5s',
        'fade-up':   'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':   'fade-in 0.4s ease both',
        'bounce-sm': 'bounce-sm 2s ease-in-out infinite',
        'live':      'live-pulse 2s ease-in-out infinite',
      },

      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16,1,0.3,1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

    }
  }
}
