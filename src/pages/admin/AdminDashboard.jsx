import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminDashboard = () => {
  // Router navigation handler for dashboard quick actions
  const navigate = useNavigate();

  // Holds aggregated admin statistics returned from the backend
  const [stats, setStats] = useState(null);

  // Controls loading state while dashboard data is being fetched
  const [loading, setLoading] = useState(true);

  // Stores error message if dashboard stats fail to load
  const [error, setError] = useState("");

  /* ---------- Fetch Dashboard Statistics ---------- */
  /* Loads high-level system metrics for admin overview */
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
      {/* ---------- Loading State ---------- */}
      {loading && <LoadingSpinner />}

      {/* ---------- Error State ---------- */}
      {error && (
        <p className="text-sm text-error">
          {error}
        </p>
      )}

      {/* ---------- Dashboard Content ---------- */}
      {!loading && stats && (
        <>
          {/* ---------- Metrics ---------- */}
          {/* High-level system KPIs with navigation shortcuts */}
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
                  hover:bg-surfaceElevated
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
          {/* Clarifies admin permissions and read-only constraints */}
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
          {/* Frequently used admin navigation shortcuts */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() =>
                navigate("/admin/pending-approvals")
              }
              className="
                rounded-lg bg-primary px-4 py-2
                text-sm font-medium text-text-primary
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
                hover:bg-surfaceElevated hover:text-text-primary
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
                hover:bg-surfaceElevated hover:text-text-primary
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
