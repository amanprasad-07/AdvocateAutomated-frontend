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
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId) => {
    await api.patch(`/admin/users/${userId}/toggle-active`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((u) =>
          statusFilter === "active" ? u.isActive : !u.isActive
        );

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
        <>
          {/* ---------- Filter ---------- */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-secondary">
              Showing {filteredUsers.length} user(s)
            </p>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                rounded-lg border border-border
                bg-surface px-3 py-2 text-sm
                focus:outline-none focus:ring-1 focus:ring-primary
              "
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>

          {/* ---------- List ---------- */}
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-muted">
              No users match the selected filter.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => {
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
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminUsers;
