/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        brand: {
          background: "rgb(var(--brand-background) / <alpha-value>)",
          surface: "rgb(var(--brand-surface) / <alpha-value>)",
          "surface-strong": "rgb(var(--brand-surface-strong) / <alpha-value>)",
          line: "rgb(var(--brand-line) / <alpha-value>)",
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
          success: "rgb(var(--brand-success) / <alpha-value>)",
          warning: "rgb(var(--brand-warning) / <alpha-value>)",
          danger: "rgb(var(--brand-danger) / <alpha-value>)",
          ink: "rgb(var(--brand-ink) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          white: "rgb(var(--brand-white) / <alpha-value>)",
        },
        transparent: "transparent",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.08)",
        card: "0 14px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
}
