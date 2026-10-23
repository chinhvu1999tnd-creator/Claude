/**
 * trust-navy — Tailwind Config
 *
 * SCOPE: Font · Layout · Animation ONLY
 * Colors → CSS variables in :root (not here)
 */

tailwind.config = {
  theme: {
    extend: {

      /* ── Fonts ──────────────────────────────────────────
         IBM Plex Serif: display/headings — gravitas, authority, finance
         IBM Plex Sans:  body copy — technical clarity, institutional
         IBM Plex Mono:  rates, metrics, data — precision
         No decorative fonts — everything is functional
      ──────────────────────────────────────────────────── */
      fontFamily: {
        display:   ['"IBM Plex Serif"', 'Georgia', 'serif'],
        body:      ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono:      ['"IBM Plex Mono"', 'monospace'],
      },

      /* ── Border radius ─────────────────────────────────
         Minimal radius — authoritative, institutional feel
         Opposite of bright-learn's generous rounding
      ──────────────────────────────────────────────────── */
      borderRadius: {
        btn:  '4px',
        card: '6px',
        xl2:  '8px',
        xl3:  '10px',
      },

      /* ── Font size scale ──────────────────────────────── */
      fontSize: {
        'display': ['clamp(2.25rem,5.5vw,4.5rem)',      { lineHeight:'1.1',  letterSpacing:'-0.025em', fontWeight:'700' }],
        'h1':      ['clamp(1.75rem,4vw,2.75rem)',        { lineHeight:'1.15', letterSpacing:'-0.02em',  fontWeight:'700' }],
        'h2':      ['clamp(1.375rem,3vw,2rem)',          { lineHeight:'1.2',  letterSpacing:'-0.015em', fontWeight:'600' }],
        'h3':      ['clamp(1rem,1.8vw,1.25rem)',         { lineHeight:'1.4',  letterSpacing:'-0.01em',  fontWeight:'600' }],
        'label':   ['10px',                              { lineHeight:'1',    letterSpacing:'0.12em',   fontWeight:'500' }],
        'metric':  ['clamp(1.75rem,4vw,3rem)',           { lineHeight:'1',    letterSpacing:'-0.03em',  fontWeight:'700' }],
      },

      /* ── Animations ────────────────────────────────────
         Minimal — no blobs, no floats, no bounce
         Only fade-up for reveal, live-pulse for status
      ──────────────────────────────────────────────────── */
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'live':    'live-pulse 2s ease-in-out infinite',
      },

      transitionTimingFunction: { 'expo': 'cubic-bezier(0.16,1,0.3,1)' },
      transitionDuration: { '250': '250ms', '350': '350ms' },

    }
  }
}
