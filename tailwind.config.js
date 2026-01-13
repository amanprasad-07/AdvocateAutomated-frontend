/** @type {import('tailwindcss').Config} */
export default {
  /**
   * Content configuration
   *
   * Specifies the files Tailwind should scan to generate utility classes.
   * This ensures unused styles are purged in production builds.
   */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  /**
   * Theme configuration
   *
   * Extends the default Tailwind theme with
   * CSS-variable–driven color tokens to support
   * light and dark themes consistently.
   */
  theme: {
    extend: {
      colors: {
        /* Base layout colors */
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        surfaceElevated: "hsl(var(--surface-elevated))",

        /* Border color */
        border: "hsl(var(--border))",

        /* Text color hierarchy */
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
        },

        /* Brand / primary action colors */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
        },

        /* Semantic status colors */
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
      },
    },
  },

  /**
   * Plugins
   *
   * No additional Tailwind plugins are used.
   * Configuration is intentionally kept minimal.
   */
  plugins: [],
};
