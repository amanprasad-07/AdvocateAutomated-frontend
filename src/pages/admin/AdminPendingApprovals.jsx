import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminPendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/admin/pending-advocates");
      setPendingUsers(res.data.data || []);
    } catch {
      setError("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const approveUser = async (userId) => {
    try {
      await api.patch(`/admin/pending-advocates/${userId}/approve`);
      fetchPendingUsers();
    } catch {
      alert("Failed to approve user");
    }
  };

  const rejectUser = async (userId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this user?"
    );
    if (!confirmReject) return;

    try {
      await api.patch(`/admin/pending-advocates/${userId}/reject`);
      fetchPendingUsers();
    } catch {
      alert("Failed to reject user");
    }
  };

  return (
    <DashboardLayout
      title="Pending Approvals"
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

      {!loading && pendingUsers.length === 0 && (
        <p className="text-sm text-muted">
          No pending advocate or junior advocate approvals.
        </p>
      )}

      {!loading && pendingUsers.length > 0 && (
        <div className="space-y-3">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="
                flex items-start justify-between gap-4
                rounded-xl border border-border
                bg-surface p-4
              "
            >
              {/* ---------- User Info ---------- */}
              <div className="space-y-1">
                <p className="font-medium text-text-primary">
                  {user.name}
                </p>

                <p className="text-sm text-text-secondary">
                  {user.email}
                </p>

                <p className="text-sm capitalize text-text-secondary">
                  Role: {user.role.replace("_", " ")}
                </p>

                <p className="text-xs text-muted">
                  Registered on{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* ---------- Actions ---------- */}
              <div className="flex gap-2">
                <button
                  onClick={() => approveUser(user._id)}
                  className="
                    rounded-lg bg-primary px-3 py-1
                    text-sm font-medium text-text-primary
                    transition-opacity hover:opacity-90
                  "
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectUser(user._id)}
                  className="
                    rounded-lg border border-border px-3 py-1
                    text-sm text-text-secondary
                    hover:bg-surfaceElevated hover:text-text-primary
                    transition-colors
                  "
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminPendingApprovals;
