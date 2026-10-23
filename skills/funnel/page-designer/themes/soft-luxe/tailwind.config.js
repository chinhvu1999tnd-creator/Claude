/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './patterns/**/*.html',
    './templates/**/*.html',
    '../../**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        accent:   '#c9956a',
        blush:    '#f0c8b8',
        mauve:    '#a87e8a',
        alert:    '#b03030',
        bg:       '#fdf8f5',
        surface:  '#f8f0eb',
        raised:   '#f2e6df',
        ink:      '#2c2218',
        body:     '#6b5042',
        subtle:   '#a89080',
        faint:    '#e8d5cc',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Lato', 'system-ui', 'sans-serif'],
        accent:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'btn':   '12px',
        'card':  '20px',
        'large': '28px',
        'pill':  '9999px',
      },
      boxShadow: {
        'soft':   '0 4px 24px rgba(44,34,24,0.08)',
        'lifted': '0 8px 40px rgba(44,34,24,0.12)',
        'deep':   '0 16px 64px rgba(44,34,24,0.16)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'fade-up':    'fadeUp 0.7s ease forwards',
        'petal-spin': 'petalSpin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        petalSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      lineHeight: {
        'tight-display': '1.15',
        'relaxed-body':  '1.75',
      },
      letterSpacing: {
        'label':   '0.08em',
        'display': '-0.01em',
      },
    },
  },
  plugins: [],
};
