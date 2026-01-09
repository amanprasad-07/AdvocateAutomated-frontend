import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await api.get("/admin/audit-logs");
      setLogs(res.data.data || []);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <DashboardLayout
      title="Audit Logs"
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

      {!loading && logs.length === 0 && (
        <p className="text-sm text-muted">
          No audit logs found.
        </p>
      )}

      {!loading && logs.length > 0 && (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="
                rounded-xl border border-border
                bg-surface p-4
              "
            >
              {/* Action */}
              <p className="font-medium text-text-primary">
                {log.action}
              </p>

              {/* Message */}
              <p className="mt-1 text-sm text-text-secondary">
                {log.message}
              </p>

              {/* Meta */}
              <div className="mt-2 text-xs text-muted space-y-0.5">
                <p>
                  Performed by:{" "}
                  <span className="capitalize">
                    {log.performedBy?.name || "System"} (
                    {log.performedBy?.role || "system"})
                  </span>
                </p>

                <p>
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminAuditLogs;
