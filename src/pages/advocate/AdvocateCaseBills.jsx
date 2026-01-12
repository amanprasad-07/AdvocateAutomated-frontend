import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ---------- */
const STATUS_STYLES = {
  pending: "border-l-warning text-warning",
  paid: "border-l-success text-success",
};

const AdvocateCaseBills = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchBills = async () => {
    try {
      const res = await api.get("/payments");

      const caseBills = res.data.data.filter(
        (p) => p.case?._id === caseId
      );

      setBills(caseBills || []);
    } catch {
      setError("Failed to load bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [caseId]);

  /* ---------- Filters ---------- */
  const statusParam = searchParams.get("status");

  const filteredBills = statusParam
    ? bills.filter((b) => b.status === statusParam)
    : bills;

  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/payments/${id}`);
    fetchBills();
  };

  return (
    <DashboardLayout
      title="Case Bills"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
        {
          label: "Back to Case",
          path: `/advocate/my-cases/${caseId}`,
        },
      ]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Filters ---------- */}
          <div className="mb-4 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter(null)}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  !statusParam
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              All
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  statusParam === "pending"
                    ? "bg-surfaceElevated text-warning"
                    : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              Pending
            </button>

            <button
              onClick={() => setFilter("paid")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  statusParam === "paid"
                    ? "bg-surfaceElevated text-success"
                    : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              Paid
            </button>
          </div>

          {/* ---------- Error ---------- */}
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {filteredBills.length === 0 && (
            <p className="text-text-muted">
              No bills match this filter.
            </p>
          )}

          {/* ---------- Bills List ---------- */}
          <div className="space-y-3">
            {filteredBills.map((bill) => (
              <div
                key={bill._id}
                className={`
                  rounded-xl border border-border
                  border-l-4
                  bg-surface
                  p-4
                  ${STATUS_STYLES[bill.status] || ""}
                `}
              >
                <p className="text-base sm:text-lg font-semibold text-text-primary">
                  ₹{bill.amount}
                </p>

                <div className="mt-1 space-y-1 sm:space-y-2 text-sm text-text-secondary">
                  <p>
                    <strong>For:</strong> {bill.paymentFor}
                  </p>

                  <p className="capitalize">
                    <strong>Status:</strong>{" "}
                    <span className="font-medium">
                      {bill.status}
                    </span>
                  </p>
                </div>

                {bill.status === "pending" && (
                  <button
                    onClick={() => handleDelete(bill._id)}
                    className="
                      mt-3 w-full sm:w-auto rounded-lg
                      border border-error
                      px-3 py-1
                      text-sm text-error
                      hover:bg-surfaceElevated
                      hover:text-text-primary
                      transition-colors
                    "
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdvocateCaseBills;
