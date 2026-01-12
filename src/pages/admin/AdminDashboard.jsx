import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data.data);
      } catch {
        setError("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout
      title="Admin Dashboard"
      navItems={[
        { label: "Dashboard", path: "/admin" },
        { label: "Pending Approvals", path: "/admin/pending-approvals" },
        { label: "Verified Advocates", path: "/admin/verified" },
        { label: "All Users", path: "/admin/users" },
        { label: "Cases (Read Only)", path: "/admin/cases" },
        { label: "Payments", path: "/admin/payments" },
        { label: "Evidence", path: "/admin/evidence" },
        { label: "Audit Logs", path: "/admin/audit-logs" }, 
      ]}
    >
      {loading && <LoadingSpinner />}

      {error && (
        <p className="text-sm text-error">
          {error}
        </p>
      )}

      {!loading && stats && (
        <>
          {/* ---------- Metrics ---------- */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              {
                label: "Pending Approvals",
                value: stats.pendingApprovals,
                action: () =>
                  navigate("/admin/pending-approvals"),
              },
              {
                label: "Verified Advocates",
                value: stats.verifiedAdvocates,
                action: () =>
                  navigate("/admin/verified"),
              },
              {
                label: "Total Users",
                value: stats.totalUsers,
                action: () =>
                  navigate("/admin/users"),
              },
              {
                label: "Total Cases",
                value: stats.totalCases,
                action: () =>
                  navigate("/admin/cases"),
              },
            ].map((item) => (
              <div
                key={item.label}
                onClick={item.action}
                className="
                  cursor-pointer rounded-xl border border-border
                  bg-surface p-4 transition
                  hover:bg-surface-elevated
                "
              >
                <p className="text-sm text-text-secondary">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* ---------- System Note ---------- */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-1 font-medium text-text-primary">
              System Oversight Mode
            </p>
            <p className="text-sm text-text-secondary">
              Admin access is read-only for cases, payments, and evidence.
              All operational actions are performed by advocates.
            </p>
          </div>

          {/* ---------- Quick Actions ---------- */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() =>
                navigate("/admin/pending-approvals")
              }
              className="
                rounded-lg bg-primary px-4 py-2
                text-sm font-medium text-white
                transition-opacity hover:opacity-90
              "
            >
              Review Pending Approvals
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="
                rounded-lg border border-border px-4 py-2
                text-sm text-text-secondary
                hover:bg-surface-elevated hover:text-text-primary
                transition-colors
              "
            >
              Manage Users
            </button>

            <button
              onClick={() => navigate("/admin/audit-logs")}
              className="
                rounded-lg border border-border px-4 py-2
                text-sm text-text-secondary
                hover:bg-surface-elevated hover:text-text-primary
                transition-colors
              "
            >
              View Audit Logs
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
