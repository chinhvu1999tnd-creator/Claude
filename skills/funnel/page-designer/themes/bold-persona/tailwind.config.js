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
        accent:   "#e8533a",
        electric: "#1a56db",
        alert:    "#dc2626",
        bg:       "#ffffff",
        surface:  "#f9fafb",
        raised:   "#f3f4f6",
        ink:      "#111827",
        body:     "#374151",
        subtle:   "#9ca3af",
        faint:    "#e5e7eb",
      },
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["Space Mono", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(3rem,8vw,6.5rem)",    { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-xl":  ["clamp(2.25rem,6vw,4.5rem)",  { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-lg":  ["clamp(1.75rem,4vw,3rem)",    { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-md":  ["clamp(1.4rem,3vw,2.25rem)",  { lineHeight: "1.2",  letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        btn:  "8px",
        card: "14px",
        pill: "9999px",
      },
      boxShadow: {
        "card":        "0 4px 20px rgba(0,0,0,0.08)",
        "card-hover":  "0 8px 32px rgba(0,0,0,0.12)",
        "accent-glow": "0 4px 20px rgba(232,83,58,0.30)",
        "accent-lg":   "0 8px 40px rgba(232,83,58,0.35)",
        "electric":    "0 4px 16px rgba(26,86,219,0.25)",
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
        "diagonal": "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(232,83,58,0.03) 20px, rgba(232,83,58,0.03) 21px)",
      },
      backgroundSize: {
        "dot-grid": "24px 24px",
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
        "float-portrait": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-8px)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":       { opacity: "0.6", transform: "scale(0.8)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up":        "fade-up 0.65s ease forwards",
        "fade-in":        "fade-in 0.5s ease forwards",
        "float-portrait": "float-portrait 5s ease-in-out infinite",
        "pulse-dot":      "pulse-dot 1.8s ease-in-out infinite",
        "count-up":       "count-up 0.7s ease forwards",
        "slide-in":       "slide-in 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};
