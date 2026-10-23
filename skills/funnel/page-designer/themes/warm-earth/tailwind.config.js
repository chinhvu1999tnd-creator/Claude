/**
 * warm-earth — Tailwind Config
 * Fonts · Layout · Animation ONLY. Colors → CSS :root vars.
 */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display:   ['Nunito', 'system-ui', 'sans-serif'],       // Rounded, friendly, artisan
        body:      ['"Source Sans 3"', 'system-ui', 'sans-serif'], // Clean, legible, warm
        mono:      ['"Source Code Pro"', 'monospace'],           // Prices, metrics
        script:    ['"Caveat"', 'cursive'],                      // Accent quotes, hand-feel labels
      },
      borderRadius: {
        btn:  '8px',
        card: '12px',
        xl2:  '16px',
        xl3:  '20px',
        pill: '9999px',
      },
      fontSize: {
        'display': ['clamp(2.25rem,5.5vw,4.25rem)',  { lineHeight:'1.1',  letterSpacing:'-0.02em',  fontWeight:'800' }],
        'h1':      ['clamp(1.75rem,4vw,3rem)',        { lineHeight:'1.15', letterSpacing:'-0.015em', fontWeight:'700' }],
        'h2':      ['clamp(1.375rem,3vw,2rem)',       { lineHeight:'1.2',  letterSpacing:'-0.01em',  fontWeight:'700' }],
        'h3':      ['clamp(1.05rem,2vw,1.25rem)',     { lineHeight:'1.35', letterSpacing:'0em',      fontWeight:'600' }],
        'label':   ['11px',                           { lineHeight:'1',    letterSpacing:'0.06em',   fontWeight:'600' }],
        'metric':  ['clamp(1.75rem,4vw,2.75rem)',     { lineHeight:'1',    letterSpacing:'-0.02em',  fontWeight:'800' }],
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'float-2':   'float 7s ease-in-out infinite 2s',
        'fade-up':   'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'live':      'live-pulse 2s ease-in-out infinite',
        'sway':      'sway 4s ease-in-out infinite',
      },
      transitionTimingFunction: { 'expo': 'cubic-bezier(0.16,1,0.3,1)' },
      transitionDuration: { '250': '250ms', '350': '350ms' },
    }
  }
}
