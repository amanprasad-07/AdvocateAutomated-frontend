import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const VerifiedAdvocates = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerified = async () => {
      const res = await api.get("/admin/verified-advocates");
      setUsers(res.data.data || []);
      setLoading(false);
    };

    fetchVerified();
  }, []);

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
      {loading && <LoadingSpinner />}

      {!loading && users.length === 0 && (
        <p className="text-sm text-muted">
          No verified advocates found.
        </p>
      )}

      {!loading && users.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {users.map((u) => (
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

                {/* ---------- Status Badge ---------- */}
                <span
                  className="
                    rounded-full bg-green-100 px-2 py-0.5
                    text-xs font-medium text-green-700
                  "
                >
                  Verified
                </span>
              </div>

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
    </DashboardLayout>
  );
};

export default VerifiedAdvocates;
