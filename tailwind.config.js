/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        // Light Theme
        background: "#F8F9FA",
        surface: "#FFFFFF",
        primary: "#0F2A44",      // Deep Navy
        secondary: "#3E5C76",    // Steel Blue
        accent: "#C9A24D",       // Gold
        text: {
          primary: "#1F2933",
          muted: "#6B7280",
        },
        border: "#E5E7EB",

        // Dark Theme
        dark: {
          background: "#0B1220",
          surface: "#111827",
          primary: "#D4AF37",    // Gold becomes primary
          secondary: "#93A3B8",
          accent: "#F5C77A",
          text: {
            primary: "#E5E7EB",
            muted: "#9CA3AF",
          },
          border: "#1F2937",
        },
      },
    },
  },
  plugins: [],
}
