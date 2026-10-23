/**
 * dark-bold-neon — Tailwind Config
 *
 * SCOPE: Font · Layout · Animation ONLY
 * Colors → CSS variables in base.css :root (not here)
 *
 * Why: Tailwind CDN bakes colors at parse time.
 * CSS vars change at runtime → only CSS vars are truly themeable.
 * Rule: NEVER define colors here. Use style="color:var(--token)" in HTML.
 */

tailwind.config = {
  theme: {
    extend: {

      /* ── Fonts ──────────────────────────────────────────
         Single source. Change here + Google Fonts link = done.
         Inter Tight: display/headings (900 weight, tight tracking)
         Inter: body copy
         JetBrains Mono: labels, prices, code
         Playfair Display: editorial pull quotes (italic, max 1×/page)
      ──────────────────────────────────────────────────── */
      fontFamily: {
        display:   ['"Inter Tight"', 'Inter', 'sans-serif'],
        body:      ['Inter', 'sans-serif'],
        mono:      ['"JetBrains Mono"', 'monospace'],
        editorial: ['"Playfair Display"', 'serif'],
      },

      /* ── Border radius ─────────────────────────────────
         Layout token only — no color.
      ──────────────────────────────────────────────────── */
      borderRadius: {
        btn:  '6px',
        card: '10px',
        xl2:  '16px',
        xl3:  '24px',
      },

      /* ── Font size scale ───────────────────────────────
         Fluid clamp sizes with pre-baked lineHeight + letterSpacing.
         Use class="text-display" "text-h1" "text-h2" "text-label"
      ──────────────────────────────────────────────────── */
      fontSize: {
        'display': ['clamp(3rem,7.5vw,6rem)',         { lineHeight:'1.0',  letterSpacing:'-0.04em', fontWeight:'900' }],
        'h1':      ['clamp(2rem,5vw,3.25rem)',       { lineHeight:'1.1',  letterSpacing:'-0.03em', fontWeight:'800' }],
        'h2':      ['clamp(1.625rem,3.8vw,2.5rem)', { lineHeight:'1.15', letterSpacing:'-0.025em',fontWeight:'700' }],
        'h3':      ['clamp(1.1875rem,2.2vw,1.5rem)',{ lineHeight:'1.3',  letterSpacing:'-0.015em',fontWeight:'700' }],
        'label':   ['11px',                          { lineHeight:'1',    letterSpacing:'0.12em',  fontWeight:'500' }],
        'metric':  ['clamp(2rem,4.5vw,3.25rem)',    { lineHeight:'1',    letterSpacing:'-0.04em', fontWeight:'900' }],
      },

      /* ── Animations ────────────────────────────────────
         Keyframes defined in base.css for CDN compatibility.
         These just wire up the animation names as Tailwind utilities.
      ──────────────────────────────────────────────────── */
      animation: {
        'blob':      'blob-drift 10s ease-in-out infinite',
        'blob-2':    'blob-drift 12s ease-in-out infinite 3s',
        'blob-3':    'blob-drift 14s ease-in-out infinite 6s',
        'fade-up':   'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'live':      'live-pulse 2s ease-in-out infinite',
        'orb-float': 'orb-float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'shimmer':   'shimmer 1.8s linear infinite',
      },

      /* ── Transition timing ─────────────────────────────*/
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
