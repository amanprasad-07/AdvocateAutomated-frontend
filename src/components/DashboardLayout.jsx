import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ThemeToggle from "./ThemeToggle";
import BackButton from "./BackButton";
import Footer from "./Footer";

/**
 * DashboardLayout Component
 *
 * Provides a unified layout for all dashboard-style pages.
 * Handles:
 * - Responsive sidebar navigation (desktop and mobile)
 * - Header with title, theme toggle, and logout
 * - Role-specific navigation items
 * - Consistent page structure and footer
 */
const DashboardLayout = ({ title, navItems, children }) => {
  // Access logout handler from authentication context
  const { logout } = useAuth();

  // React Router navigation utility
  const navigate = useNavigate();

  // Controls mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Defensive fallback to prevent runtime errors if navItems is undefined
  const safeNavItems = navItems || [];

  /**
   * Handles user logout and redirects to login page
   */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /**
   * Navigates back one step in browser history
   */
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg text-text-primary">

      {/* ================= Mobile Sidebar (Right Drawer) ================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Semi-transparent backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Slide-in drawer from the right */}
          <aside
            className="
              ml-auto relative z-50 w-64
              bg-surface border-l border-border
              p-6
              animate-slideInRight
            "
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary">
                Menu
              </h2>

              {/* Theme toggle and close button */}
              <div className="flex">
                <ThemeToggle />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-text-secondary hover:text-text-primary px-3 ml-3 rounded-lg border border-border text-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1 mb-6">
              {safeNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="
                    block rounded-lg px-3 py-2
                    text-text-secondary
                    hover:bg-surfaceElevated
                    hover:text-text-primary
                    transition-colors
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Logout button inside mobile sidebar */}
            <button
              onClick={handleLogout}
              className="
                w-full rounded-lg
                bg-primary px-4 py-2
                text-sm font-medium text-white
                hover:bg-primary-hover
                transition-colors
              "
            >
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden md:block md:w-64 bg-surface border-r border-border p-6">
        <h2 className="text-lg font-semibold text-primary mb-6">
          Advocate Automated
        </h2>

        {/* Desktop navigation */}
        <nav className="space-y-1">
          {safeNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="
                block rounded-lg px-3 py-2
                text-text-secondary
                hover:bg-surfaceElevated
                hover:text-text-primary
                transition-colors
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ================= Main Content Area ================= */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">

          {/* Left section: back button and page title */}
          <div className="flex items-center gap-3">
            <BackButton />

            <div className="flex flex-col leading-tight">
              {/* Brand label for mobile view */}
              <span className="
                text-xs sm:text-sm
                font-medium
                text-primary 
                md:hidden
              ">
                Advocate Automated
              </span>

              {/* Current page title */}
              <h1 className="text-base sm:text-lg font-semibold text-text-primary">
                {title}
              </h1>
            </div>
          </div>

          {/* Right section: theme toggle, logout, hamburger */}
          <div className="flex items-center gap-4">
            
            {/* Theme toggle control */}
            <ThemeToggle />

            {/* Logout button visible only on desktop */}
            <button
              onClick={handleLogout}
              className="
                hidden md:block
                rounded-lg bg-primary
                px-4 py-2
                text-sm font-medium text-white
                hover:bg-primary-hover
                transition-colors
              "
            >
              Logout
            </button>

            {/* Hamburger menu for mobile and tablet */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                md:hidden
                rounded-lg border border-border
                px-3 py-2
                text-sm text-text-secondary
                hover:bg-surfaceElevated
                hover:text-text-primary
                transition-colors
              "
            >
              ☰
            </button>
          </div>
        </header>

        {/* Page-specific content */}
        <main className="flex-1 p-6 bg-bg">
          {children}
        </main>

        {/* Global footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
