import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ThemeToggle from "./ThemeToggle";

const DashboardLayout = ({ title, navItems, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const safeNavItems = navItems || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex bg-bg text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border p-6">
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

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="
                rounded-lg border border-border
                px-3 py-2
                text-sm text-text-secondary
                hover:bg-surfaceElevated
                hover:text-text-primary
                transition-colors
              "
            >
              Back
            </button>

            <h1 className="text-lg font-semibold text-text-primary">
              {title}
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="
                rounded-lg bg-primary
                px-4 py-2
                text-sm font-medium text-white
                hover:bg-primary-hover
                transition-colors
              "
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
