import { createContext, useContext, useEffect, useState } from "react";

/**
 * Theme Context
 *
 * Provides global theme state and controls
 * for switching between light and dark modes.
 */
const ThemeContext = createContext();

/**
 * applyThemeClass
 *
 * Applies the appropriate theme class to the
 * root HTML element to enable Tailwind-based
 * theme styling.
 *
 * @param {string} theme - Current theme value ("light" or "dark")
 */
const applyThemeClass = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

/**
 * ThemeProvider Component
 *
 * Wraps the application and manages theme state.
 * Determines initial theme based on:
 * - Saved user preference in localStorage
 * - System color scheme preference
 */
export const ThemeProvider = ({ children }) => {
  // Stores the active theme
  const [theme, setTheme] = useState("light");

  /**
   * Initialize theme on first render
   *
   * Priority:
   * 1. Saved theme in localStorage
   * 2. System preference
   * 3. Default to light theme
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);
    applyThemeClass(initialTheme);
  }, []);

  /**
   * toggleTheme
   *
   * Switches between light and dark themes,
   * persists the preference, and updates
   * the root document class.
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyThemeClass(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 *
 * Provides access to the current theme
 * and theme toggle function.
 */
export const useTheme = () => useContext(ThemeContext);
