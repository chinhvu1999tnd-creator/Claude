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
        accent:  "#b5732a",
        forest:  "#2d5016",
        "warm-red": "#9b2335",
        bg:      "#fdf9f4",
        surface: "#f7f1e8",
        raised:  "#efe6d8",
        ink:     "#1e160a",
        body:    "#4a3520",
        subtle:  "#8a7560",
        faint:   "#ddd0be",
      },
      fontFamily: {
        display: ["Lora", "Georgia", "serif"],
        body:    ["Source Sans 3", "system-ui", "sans-serif"],
        mono:    ["Source Code Pro", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(2.75rem,7vw,5.5rem)",  { lineHeight: "1.08" }],
        "display-xl":  ["clamp(2rem,5vw,4rem)",        { lineHeight: "1.1"  }],
        "display-lg":  ["clamp(1.5rem,3.5vw,2.75rem)", { lineHeight: "1.15" }],
      },
      borderRadius: {
        btn:  "10px",
        card: "16px",
        img:  "20px",
      },
      boxShadow: {
        "warm":    "0 4px 24px rgba(30,22,10,0.08)",
        "warm-md": "0 6px 32px rgba(30,22,10,0.10)",
        "warm-lg": "0 8px 48px rgba(30,22,10,0.12)",
        "accent":  "0 4px 20px rgba(181,115,42,0.25)",
        "accent-lg":"0 8px 32px rgba(181,115,42,0.30)",
      },
      backgroundImage: {
        /* Very subtle paper grain — lighter than bold-appetite's dark grain */
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-6px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease forwards",
        "fade-in": "fade-in 0.5s ease forwards",
        float:     "float 4s ease-in-out infinite",
        pulse:     "pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
