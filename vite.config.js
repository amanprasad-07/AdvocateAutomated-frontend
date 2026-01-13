import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite configuration
 *
 * Defines build and development settings for the React application.
 * This configuration is intentionally minimal and production-safe.
 */
export default defineConfig({
  /**
   * Plugins
   *
   * Enables React support with JSX transformation,
   * fast refresh, and optimized builds.
   */
  plugins: [react()],

  /**
   * Base public path
   *
   * Specifies the base URL for the application.
   * Using "/" ensures correct asset resolution
   * when deployed at the root domain.
   */
  base: "/",
});
