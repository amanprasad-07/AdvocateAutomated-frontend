import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ThemeToggle from "./ThemeToggle";
import BackButton from "./BackButton";
import Footer from "./Footer";

const DashboardLayout = ({ title, navItems, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const safeNavItems = navItems || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg text-text-primary">

      {/* ================= Mobile Sidebar (RIGHT) ================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer (RIGHT SIDE) */}
          <aside
            className="
              ml-auto relative z-50 w-64
              bg-surface border-l border-border
              p-6
              animate-slideInRight
            "
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary">
                Menu
              </h2>
              <div className="flex">
                {/* Theme toggle (icon-sized by component styling) */}
                <ThemeToggle />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-text-secondary hover:text-text-primary px-3 ml-3 rounded-lg border border-border text-center"
                >
                  ✕
                </button>
              </div>
            </div>

            <nav className="space-y-1 mb-6">
              {safeNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="
                    block rounded-lg px-3 py-2
                    text-text-secondary
                    hover:bg-surface-elevated
                    hover:text-text-primary
                    transition-colors
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Logout INSIDE mobile menu */}
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

        <nav className="space-y-1">
          {safeNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="
                block rounded-lg px-3 py-2
                text-text-secondary
                hover:bg-surface-elevated
                hover:text-text-primary
                transition-colors
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ================= Main Section ================= */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">

          {/* Left */}
          <div className="flex items-center gap-3">
            <BackButton />

            <div className="flex flex-col leading-tight">
              {/* Brand (always visible, smaller than title) */}
              <span className="
      text-xs sm:text-sm
      font-medium
      text-primary 
      md:hidden
    ">
                Advocate Automated
              </span>

              {/* Page Title (primary focus) */}
              <h1 className="text-base sm:text-lg font-semibold text-text-primary">
                {title}
              </h1>
            </div>
          </div>


          {/* Right */}
          <div className="flex items-center gap-4">
            
            {/* Theme toggle (icon-sized by component styling) */}
            <ThemeToggle />

            {/* Logout ONLY on desktop */}
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

            {/* Hamburger (mobile/tablet only, RIGHT side) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                md:hidden
                rounded-lg border border-border
                px-3 py-2
                text-sm text-text-secondary
                hover:bg-surface-elevated
                hover:text-text-primary
                transition-colors
              "
            >
              ☰
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-bg">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
