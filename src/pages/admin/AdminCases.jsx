import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Colors ---------- */
/* Maps case status to semantic text color for admin visibility */
const STATUS_BADGE = {
  open: "text-blue-600",
  in_progress: "text-yellow-600",
  closed: "text-green-600",
};

const AdminCases = () => {
  // Stores fetched cases for admin oversight
  const [cases, setCases] = useState([]);

  // Tracks selected status filter value
  const [status, setStatus] = useState("");

  // Controls loading state during API requests
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Cases ---------- */
  /* Retrieves cases from admin endpoint, optionally filtered by status */
  const fetchCases = async () => {
    setLoading(true);

    const res = await api.get("/admin/cases", {
      params: status ? { status } : {},
    });

    setCases(res.data.data || []);
    setLoading(false);
  };

  /* ---------- Side Effects ---------- */
  /* Re-fetch cases whenever the status filter changes */
  useEffect(() => {
    fetchCases();
  }, [status]);

  return (
    <DashboardLayout
      title="Case Oversight"
      navItems={[
        { label: "Dashboard", path: "/admin" },
        { label: "Pending Approvals", path: "/admin/pending-approvals" },
        { label: "Verified Advocates", path: "/admin/verified" },
        { label: "All Users", path: "/admin/users" },
        { label: "Cases", path: "/admin/cases" },
        { label: "Payments", path: "/admin/payments" },
        { label: "Evidence", path: "/admin/evidence" },
        { label: "Audit Logs", path: "/admin/audit-logs" },
      ]}
    >
      {/* ---------- Filters ---------- */}
      {/* Allows admin to filter cases by lifecycle status */}
      <div className="mb-5 flex items-center gap-3">
        <label className="text-sm font-medium text-text-secondary">
          Filter by status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            rounded-lg border border-border
            bg-surface px-3 py-2 text-sm
          "
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* ---------- Loading State ---------- */}
      {loading && <LoadingSpinner />}

      {/* ---------- Empty State ---------- */}
      {!loading && cases.length === 0 && (
        <p className="text-sm text-muted">
          No cases match the selected criteria.
        </p>
      )}

      {/* ---------- Case List ---------- */}
      {!loading && cases.length > 0 && (
        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c._id}
              className="
                rounded-xl border border-border
                bg-surface p-4
              "
            >
              {/* Header */}
              {/* Displays core case identity and current status */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-text-primary">
                    Case #{c.caseNumber}
                  </p>
                  <p className="mt-0.5 text-sm text-text-secondary">
                    {c.title}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium capitalize ${
                    STATUS_BADGE[c.status] || "text-muted"
                  }`}
                >
                  {c.status.replace("_", " ")}
                </span>
              </div>

              {/* Meta Information */}
              {/* Shows contextual ownership and creation timestamp */}
              <div className="mt-2 text-xs text-muted space-y-0.5">
                <p>
                  Client: {c.client?.name || "N/A"} • Advocate:{" "}
                  {c.advocate?.name || "N/A"}
                </p>
                <p>
                  Created on{" "}
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminCases;
