import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const VerifiedAdvocates = () => {
  // Stores the list of advocates who have completed verification
  const [users, setUsers] = useState([]);

  // Indicates whether verified advocate data is still loading
  const [loading, setLoading] = useState(true);

  // Controls client-side filtering by advocate role
  const [roleFilter, setRoleFilter] = useState("all");

  /* ---------- Data Fetch ---------- */
  // Fetches all verified advocates (including junior advocates) from admin endpoint
  useEffect(() => {
    const fetchVerified = async () => {
      try {
        const res = await api.get("/admin/verified-advocates");
        setUsers(res.data.data || []);
      } finally {
        // Ensures loading state is cleared even if request fails
        setLoading(false);
      }
    };

    fetchVerified();
  }, []);

  /* ---------- Derived Data ---------- */
  // Applies role-based filtering without mutating the source dataset
  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => u.role === roleFilter);

  return (
    <DashboardLayout
      title="Verified Advocates"
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

      {/* ---------- Empty System State ---------- */}
      {!loading && users.length === 0 && (
        <p className="text-sm text-muted">
          No verified advocates found.
        </p>
      )}

      {/* ---------- Verified Advocate List ---------- */}
      {!loading && users.length > 0 && (
        <>
          {/* ---------- Role Filter ---------- */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-secondary">
              Showing {filteredUsers.length} advocate(s)
            </p>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="
                rounded-lg border border-border
                bg-surface px-3 py-2 text-sm
                focus:outline-none focus:ring-1 focus:ring-primary
              "
            >
              <option value="all">All</option>
              <option value="advocate">Advocates</option>
              <option value="junior_advocate">Junior Advocates</option>
            </select>
          </div>

          {/* ---------- Filtered Results ---------- */}
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-muted">
              No advocates match the selected role.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="
                    rounded-xl border border-border
                    bg-surface p-4
                    transition hover:bg-surfaceElevated
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* ---------- Identity ---------- */}
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
                    </div>

                    {/* ---------- Verification Status ---------- */}
                    <span
                      className="
                        rounded-full bg-green-100 px-2 py-0.5
                        text-xs font-medium text-green-700
                      "
                    >
                      Verified
                    </span>
                  </div>

                  {/* ---------- Verification Timestamp ---------- */}
                  <p className="mt-3 text-xs text-muted">
                    Verified on{" "}
                    {new Date(
                      u.verificationReviewedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default VerifiedAdvocates;
