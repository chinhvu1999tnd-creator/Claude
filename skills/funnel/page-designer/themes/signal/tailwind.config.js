/**
 * signal — Tailwind Config
 * Aesthetic: Condensed Editorial · Stark · Precise
 * Brand color: #B6FF00 — same accent as dark-bold-neon, completely different feel
 */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display:   ['"Barlow Condensed"', 'sans-serif'],
        body:      ['"Source Serif 4"', 'Georgia', 'serif'],
        mono:      ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        btn:  '3px',   /* sharp — editorial, not startup */
        card: '4px',
        xl2:  '6px',
        xl3:  '8px',
      },
      fontSize: {
        'display': ['clamp(3.5rem,8vw,7rem)',          { lineHeight:'0.95', letterSpacing:'-0.02em', fontWeight:'800' }],
        'h2':      ['clamp(2rem,4.5vw,3.5rem)',        { lineHeight:'1.0',  letterSpacing:'-0.02em', fontWeight:'800' }],
        'h3':      ['clamp(1.25rem,2vw,1.75rem)',      { lineHeight:'1.15', letterSpacing:'-0.01em', fontWeight:'600' }],
        'label':   ['0.7rem',                          { lineHeight:'1',    letterSpacing:'0.14em',  fontWeight:'500' }],
        'metric':  ['clamp(2.5rem,5vw,4.5rem)',        { lineHeight:'1',    letterSpacing:'-0.03em', fontWeight:'800' }],
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'live':    'live-pulse 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16,1,0.3,1)',
      },
    }
  }
}
