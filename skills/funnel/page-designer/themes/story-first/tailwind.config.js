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
        accent:  "#c0553d",  /* Terracotta-coral — warm, human, grounded */
        slate:   "#3d5a80",  /* Slate blue — calm, reflective, depth */
        sage:    "#6b8f71",  /* Sage green — growth, healing, nature */
        bg:      "#fdfbf8",  /* Warm paper white */
        surface: "#f5f0ea",  /* Warm off-white */
        raised:  "#ede6dc",  /* Card bg */
        ink:     "#2c1f14",  /* Warm dark brown */
        body:    "#5c4838",  /* Warm brown */
        subtle:  "#9c8878",  /* Muted warm */
        faint:   "#ddd0c4",  /* Warm border */
      },
      fontFamily: {
        display: ['"Libre Baskerville"', "Georgia", "serif"],
        body:    ['"Nunito Sans"', "system-ui", "sans-serif"],
        label:   ['"Libre Franklin"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(2.5rem,6.5vw,4.75rem)",  { lineHeight: "1.12" }],
        "display-xl":  ["clamp(1.875rem,4.5vw,3.5rem)",  { lineHeight: "1.18" }],
        "display-lg":  ["clamp(1.5rem,3vw,2.5rem)",      { lineHeight: "1.22" }],
      },
      borderRadius: {
        btn:  "12px",  /* Friendly, organic */
        card: "18px",  /* Softer card corners */
        img:  "22px",  /* Portrait & media frames */
      },
      boxShadow: {
        /* Warm brown-tinted shadows — no harsh black */
        "warm":    "0 4px 20px rgba(44,31,20,0.08)",
        "warm-md": "0 6px 28px rgba(44,31,20,0.10)",
        "warm-lg": "0 8px 40px rgba(44,31,20,0.12)",
        "accent":  "0 4px 20px rgba(192,85,61,0.22)",
        "accent-lg":"0 8px 28px rgba(192,85,61,0.28)",
        "slate":   "0 4px 20px rgba(61,90,128,0.15)",
      },
      backgroundImage: {
        /* Very subtle warm paper grain — lighter than dark themes */
        "paper": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E\")",
        /* Subtle warm gradient for surface sections */
        "surface-warm": "linear-gradient(135deg, #f5f0ea 0%, #ede6dc 100%)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        /* Gentler float than bold themes — organic, breathing feel */
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-5px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%":       { transform: "translateY(-4px) rotate(1deg)" },
        },
        /* Soft reveal — like turning a page */
        "reveal": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.8s ease forwards",
        "fade-in":    "fade-in 0.6s ease forwards",
        float:        "float 5s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        reveal:       "reveal 0.7s ease forwards",
      },
    },
  },
  plugins: [],
};
