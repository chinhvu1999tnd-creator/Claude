/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./patterns/**/*.html",
    "./templates/**/*.html",
    "../../**/*.html",
    "../../../output/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        display:  ["'Barlow Condensed'", "sans-serif"],
        body:     ["'Barlow'", "sans-serif"],
        label:    ["'Barlow Semi Condensed'", "sans-serif"],
      },
      fontSize: {
        "10xl": ["10rem",  { lineHeight: "1" }],
        "9xl":  ["8rem",   { lineHeight: "1" }],
        "8xl":  ["6rem",   { lineHeight: "1" }],
        "7xl":  ["4.5rem", { lineHeight: "1" }],
      },
      fontWeight: {
        black: "900",
      },
      colors: {
        accent:   "#ff2d2d",
        yellow:   "#f5c500",
        grey:     "#2a2a2a",
        alert:    "#ff6b00",
        bg:       "#0e0e0e",
        surface:  "#141414",
        raised:   "#1e1e1e",
        ink:      "#ffffff",
        body:     "#cccccc",
        subtle:   "#888888",
        faint:    "#2a2a2a",
      },
      borderRadius: {
        btn:  "4px",
        card: "6px",
        none: "0px",
      },
      boxShadow: {
        "red-glow":    "0 4px 20px rgba(255,45,45,0.35)",
        "red-glow-lg": "0 8px 40px rgba(255,45,45,0.45)",
        "yellow-glow": "0 4px 20px rgba(245,197,0,0.35)",
      },
      backgroundImage: {
        "carbon": "repeating-linear-gradient(-45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 8px)",
        "carbon-strong": "repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)",
        "red-carbon": "repeating-linear-gradient(-45deg, rgba(255,45,45,0.08) 0px, rgba(255,45,45,0.08) 1px, transparent 1px, transparent 8px)",
      },
      animation: {
        "pulse-fast":  "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-red":   "pulseRed 1.5s ease-in-out infinite",
        "glow-red":    "glowRed 2s ease-in-out infinite alternate",
        "slide-right": "slideRight 0.4s ease-out",
        "countdown":   "countdownTick 1s step-end infinite",
      },
      keyframes: {
        pulseRed: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        glowRed: {
          "0%":   { boxShadow: "0 4px 20px rgba(255,45,45,0.35)" },
          "100%": { boxShadow: "0 4px 40px rgba(255,45,45,0.65)" },
        },
        slideRight: {
          "0%":   { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)",     opacity: "1" },
        },
        countdownTick: {
          "0%":   { transform: "translateY(0)" },
          "50%":  { transform: "translateY(-2px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      clipPath: {
        diagonal:     "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
        "diagonal-r": "polygon(0 0, 100% 0, 100% 100%, 0 90%)",
        wedge:        "polygon(0 0, 100% 5%, 100% 95%, 0 100%)",
        parallelogram:"polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
      },
    },
  },
  plugins: [],
};
