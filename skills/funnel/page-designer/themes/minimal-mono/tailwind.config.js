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
      colors: {
        accent:  "#111111",
        grey:    "#888888",
        light:   "#f0f0f0",
        alert:   "#cc0000",
        bg:      "#ffffff",
        surface: "#f8f8f8",
        raised:  "#f0f0f0",
        ink:     "#111111",
        body:    "#555555",
        subtle:  "#999999",
        faint:   "#e0e0e0",
      },
      fontFamily: {
        sans:  ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:  ["Space Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-2xl": ["8rem",  { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display-xl":  ["6rem",  { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-lg":  ["4.5rem",{ lineHeight: "0.95", letterSpacing: "-0.025em" }],
        "display-md":  ["3.5rem",{ lineHeight: "1",    letterSpacing: "-0.02em" }],
        "display-sm":  ["2.5rem",{ lineHeight: "1.05", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        none: "0px",
        sm:   "0px",
        DEFAULT: "0px",
        md:   "0px",
        lg:   "0px",
        xl:   "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px", // intentional — no rounding anywhere
      },
      boxShadow: {
        none:    "none",
        sm:      "none",
        DEFAULT: "none",
        md:      "none",
        lg:      "none",
        xl:      "none",
        "2xl":   "none",
        inner:   "none",
      },
      letterSpacing: {
        widest:   "0.2em",
        wider:    "0.15em",
        wide:     "0.08em",
        normal:   "0em",
        tight:    "-0.02em",
        tighter:  "-0.03em",
        tightest: "-0.04em",
      },
      animation: {
        "fade-in":   "fadeIn 0.4s ease forwards",
        "fade-up":   "fadeUp 0.5s ease forwards",
        "fade-slow": "fadeIn 0.8s ease forwards",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      spacing: {
        "section": "7rem",
        "section-sm": "4rem",
        "gutter": "2rem",
      },
      maxWidth: {
        "editorial": "1400px",
        "copy": "62ch",
        "narrow": "44ch",
      },
    },
  },
  plugins: [],
};
