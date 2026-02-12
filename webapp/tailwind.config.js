/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e8ecff",
          200: "#cdd6ff",
          300: "#a0b2ff",
          400: "#6b82ff",
          500: "#4457ff",
          600: "#2d3ed9",
          700: "#2431aa",
          800: "#1f2a85",
          900: "#1d266b",
        },
        accent: {
          50: "#fff8f1",
          100: "#ffeeda",
          200: "#ffd4b0",
          300: "#ffb077",
          400: "#ff8642",
          500: "#ff671c",
          600: "#f3520f",
          700: "#c53f11",
          800: "#9a3414",
          900: "#7c2d12",
        },
        success: "#2ecc71",
        warning: "#fbbc05",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 45px -25px rgba(3,7,18,0.4)",
        soft: "0 8px 30px -16px rgba(15,23,42,0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};
