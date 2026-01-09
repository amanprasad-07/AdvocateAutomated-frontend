import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const STATUS_COLOR = {
  active: "text-green-600",
  inactive: "text-red-600",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data.data || []);
    setLoading(false);
  };

  const toggleStatus = async (userId) => {
    await api.patch(`/admin/users/${userId}/toggle-active`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout
      title="User Management"
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
      {loading && (
        <p className="text-sm text-muted">
          Loading user registry…
        </p>
      )}

      {!loading && users.length === 0 && (
        <p className="text-sm text-muted">
          No users found in the system.
        </p>
      )}

      {!loading && users.length > 0 && (
        <div className="space-y-3">
          {users.map((u) => {
            const statusKey = u.isActive ? "active" : "inactive";

            return (
              <div
                key={u._id}
                className="
                  rounded-xl border border-border
                  bg-surface p-4
                  flex items-start justify-between gap-4
                "
              >
                {/* ---------- User Info ---------- */}
                <div className="space-y-1 text-sm">
                  <p className="text-base font-semibold text-text-primary">
                    {u.name}
                  </p>

                  <p className="text-text-secondary">
                    {u.email}
                  </p>

                  <p className="capitalize text-text-secondary">
                    Role: {u.role.replace("_", " ")}
                  </p>

                  <p className="text-xs">
                    Status:{" "}
                    <span
                      className={`font-medium ${STATUS_COLOR[statusKey]}`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>

                  {u.role !== "client" && (
                    <p className="text-xs capitalize text-text-secondary">
                      Verification: {u.verificationStatus}
                    </p>
                  )}
                </div>

                {/* ---------- Controls ---------- */}
                {u.role !== "admin" && (
                  <button
                    onClick={() => toggleStatus(u._id)}
                    className={`
                      rounded-lg px-3 py-1 text-xs font-medium
                      transition-colors
                      ${
                        u.isActive
                          ? "border border-red-500 text-red-600 hover:bg-red-50"
                          : "border border-green-500 text-green-600 hover:bg-green-50"
                      }
                    `}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminUsers;
