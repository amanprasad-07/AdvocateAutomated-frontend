import { useTheme } from "../theme/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        rounded-lg border border-border
        px-3 py-2
        text-sm font-medium
        text-text-secondary
        hover:bg-surfaceElevated
        hover:text-text-primary
        transition-colors
      "
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
};

export default ThemeToggle;
