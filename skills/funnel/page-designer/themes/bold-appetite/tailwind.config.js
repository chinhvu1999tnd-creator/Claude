/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./patterns/**/*.html",
    "./templates/**/*.html",
    "../../**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        accent:  "#e8742a",
        yellow:  "#f5c842",
        cream:   "#f5ead8",
        alert:   "#c0392b",
        bg:      "#1a1008",
        surface: "#231608",
        raised:  "#2e1e0a",
        ink:     "#f5ead8",
        body:    "#d4c4a8",
        subtle:  "#8a7560",
        faint:   "#3d2d1a",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(3rem,8vw,7rem)",   { lineHeight: "1.05" }],
        "display-xl":  ["clamp(2.25rem,6vw,5rem)", { lineHeight: "1.08" }],
        "display-lg":  ["clamp(1.75rem,4vw,3.5rem)",{ lineHeight: "1.1"  }],
      },
      borderRadius: {
        btn:  "6px",
        card: "12px",
        img:  "20px",
      },
      boxShadow: {
        "warm-glow": "0 4px 24px rgba(232,116,42,0.20)",
        "warm-lg":   "0 8px 48px rgba(232,116,42,0.25)",
        "warm-sm":   "0 2px 12px rgba(232,116,42,0.15)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%":       { transform: "rotate(2deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },
      animation: {
        sway:     "sway 4s ease-in-out infinite",
        "fade-up":    "fade-up 0.7s ease forwards",
        "fade-in":    "fade-in 0.5s ease forwards",
        shimmer:  "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
