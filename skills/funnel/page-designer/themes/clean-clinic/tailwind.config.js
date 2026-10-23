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
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["Inter", "ui-monospace", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#0fa37f",
          text: "#ffffff",
        },
        medical: {
          blue: "#2563eb",
          alert: "#dc2626",
          positive: "#16a34a",
        },
        bg: "#f8fffe",
        surface: "#f0faf8",
        raised: "#e6f7f4",
        ink: "#0d2b24",
        body: "#1f5c4e",
        subtle: "#5a8f85",
        faint: "#c8e8e3",
      },
      borderRadius: {
        btn: "8px",
        card: "12px",
        "card-lg": "16px",
        badge: "99px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(13,43,36,0.06)",
        "card-hover": "0 4px 20px rgba(13,43,36,0.10)",
        focus: "0 0 0 3px rgba(15,163,127,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        clinical: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        slow: "350ms",
      },
      spacing: {
        section: "80px",
        "section-sm": "48px",
        "section-lg": "112px",
      },
      maxWidth: {
        content: "720px",
        layout: "1140px",
        wide: "1280px",
      },
      fontSize: {
        hero: ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.1", fontWeight: "800" }],
        "h2": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "700" }],
        "h3": ["clamp(1.25rem, 2vw, 1.75rem)", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.7" }],
        sm: ["0.875rem", { lineHeight: "1.6" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};
