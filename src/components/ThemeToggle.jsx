import { useTheme } from "../theme/ThemeContext";

/**
 * ThemeToggle Component
 *
 * Provides a UI control to toggle between
 * light and dark themes.
 *
 * Uses ThemeContext to read and update
 * the current theme state.
 */
const ThemeToggle = () => {
  // Access current theme and toggle handler from context
  const { theme, toggleTheme } = useTheme();

  // Determine whether the active theme is light
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        relative flex items-center justify-center
        w-10 h-10
        rounded-full border border-border
        text-text-secondary
        hover:bg-surfaceElevated
        hover:text-text-primary
        transition-colors
      "
    >
      {/* Sun icon (visible in light mode) */}
      <span
        className={`
          absolute
          transition-all duration-300 ease-out
          ${isLight
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"}
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>

      {/* Moon icon (visible in dark mode) */}
      <span
        className={`
          absolute
          transition-all duration-300 ease-out
          ${!isLight
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"}
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
