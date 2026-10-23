tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        accent:   '#c9a84c',
        silver:   '#a8a89e',
        alert:    '#c0392b',
        bg:       '#0c0c0a',
        surface:  '#141412',
        raised:   '#1c1c19',
        ink:      '#f5f0e8',
        body:     '#c8c4b8',
        subtle:   '#7a7870',
        faint:    '#2a2a26',
      },
      borderRadius: {
        btn:  '2px',
        card: '4px',
        xl2:  '6px',
        xl3:  '8px',
      },
      fontSize: {
        display: ['clamp(3rem,7vw,6rem)',   { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1:      ['clamp(2rem,4.5vw,3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        h2:      ['clamp(1.5rem,3vw,2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        label:   ['10px',                    { lineHeight: '1',   letterSpacing: '0.18em',  fontWeight: '400' }],
        metric:  ['clamp(2rem,5vw,4rem)',    { lineHeight: '1',   letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'live':    'live-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      transitionDuration: {
        '350': '350ms',
        '500': '500ms',
      },
      boxShadow: {
        luxury: '0 4px 32px rgba(0,0,0,0.4)',
        card:   '0 2px 16px rgba(0,0,0,0.32)',
      },
    },
  },
};
