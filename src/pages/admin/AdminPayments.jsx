import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

/* ---------- Status Badge Colors ---------- */
/* Semantic color mapping for payment statuses */
const STATUS_BADGE = {
  paid: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-600",
};

const AdminPayments = () => {
  // Holds the list of payments currently displayed (after filtering)
  const [payments, setPayments] = useState([]);

  // Tracks the selected status filter ("all", "pending", "paid", "failed")
  const [status, setStatus] = useState("all");

  // Controls loading state during API requests
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Payments ---------- */
  /* Retrieves all payments and applies status-based filtering client-side */
  const fetchPayments = async () => {
    setLoading(true);

    try {
      const res = await api.get("/payments");
      const allPayments = res.data.data || [];

      // Apply status filter if not showing all payments
      const filtered =
        status === "all"
          ? allPayments
          : allPayments.filter((p) => p.status === status);

      setPayments(filtered);
    } finally {
      setLoading(false);
    }
  };

  /* Re-fetch payments whenever the selected status filter changes */
  useEffect(() => {
    fetchPayments();
  }, [status]);

  return (
    <DashboardLayout
      title="Payment Audit"
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
      {/* ---------- Filter + Count ---------- */}
      {/* Displays total visible payments and allows status-based filtering */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-secondary">
          Showing {payments.length} payment(s)
        </p>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            rounded-lg border border-border
            bg-surface px-3 py-2 text-sm
            text-text-primary
            focus:outline-none focus:ring-1 focus:ring-primary
          "
        >
          <option value="all">All payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* ---------- Loading State ---------- */}
      {loading && (
        <p className="text-sm text-muted">
          Loading payment records…
        </p>
      )}

      {/* ---------- Empty State ---------- */}
      {!loading && payments.length === 0 && (
        <p className="text-sm text-muted">
          No payments match the selected filter.
        </p>
      )}

      {/* ---------- Payment List ---------- */}
      {!loading && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p._id}
              className="
                rounded-xl border border-border
                bg-surface p-4
              "
            >
              {/* ---------- Header ---------- */}
              {/* Displays amount, currency, and payment status */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-lg font-semibold text-text-primary">
                  ₹{p.amount}{" "}
                  <span className="text-sm text-text-secondary">
                    ({p.currency})
                  </span>
                </p>

                <span
                  className={`text-xs font-medium capitalize ${
                    STATUS_BADGE[p.status] || "text-muted"
                  }`}
                >
                  {p.status.replace("_", " ")}
                </span>
              </div>

              {/* ---------- Details ---------- */}
              {/* Shows contextual metadata for audit purposes */}
              <div className="mt-2 space-y-1 text-sm text-text-secondary">
                <p>
                  <strong className="font-medium text-text-primary">
                    Method:
                  </strong>{" "}
                  {p.paymentMethod || "N/A"}
                </p>

                <p>
                  <strong className="font-medium text-text-primary">
                    Client:
                  </strong>{" "}
                  {p.client?.name || "N/A"}
                </p>

                <p>
                  <strong className="font-medium text-text-primary">
                    Advocate:
                  </strong>{" "}
                  {p.receivedBy?.name || "N/A"}
                </p>

                <p>
                  <strong className="font-medium text-text-primary">
                    Case:
                  </strong>{" "}
                  {p.case?.caseNumber || "—"}
                </p>
              </div>

              {/* ---------- Timestamp ---------- */}
              {/* Rendered only if payment has been completed */}
              {p.paidAt && (
                <p className="mt-3 text-xs text-muted">
                  Paid on{" "}
                  {new Date(p.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminPayments;
