import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const DashboardLayout = ({ title, navItems, children }) => {
  const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = async () => {
  await logout();
  navigate("/login");
};

  return (
    <div className="min-h-screen flex bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-surface dark:bg-dark-surface border-r border-border p-4">
        <h2 className="text-xl font-semibold text-primary mb-6">
          Advocate Automated
        </h2>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block px-3 py-2 rounded hover:bg-border dark:hover:bg-dark-border"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h1 className="text-xl font-semibold">{title}</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
