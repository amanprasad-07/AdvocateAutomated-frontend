import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Bill Status Styles (Semantic) ----------
   Maps bill payment status to left-border and text color styles
*/
const STATUS_STYLES = {
  pending: "border-l-warning text-warning",
  paid: "border-l-success text-success",
};

const AdvocateCaseBills = () => {
  // Extract the case identifier from route params
  const { caseId } = useParams();

  // Navigation helper
  const navigate = useNavigate();

  // Bills related to the current case
  const [bills, setBills] = useState([]);

  // Loading and error handling states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // URL query params handler (used for filtering)
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Fetch all payments and filter them by the current case ID
   * This keeps backend API simple while scoping data at the UI layer
   */
  const fetchBills = async () => {
    try {
      const res = await api.get("/payments");

      // Narrow down bills to only those belonging to this case
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

  // Fetch bills whenever caseId changes
  useEffect(() => {
    fetchBills();
  }, [caseId]);

  /* ---------- Filters ----------
     Allows filtering bills by payment status using URL query params
  */
  const statusParam = searchParams.get("status");

  const filteredBills = statusParam
    ? bills.filter((b) => b.status === statusParam)
    : bills;

  /**
   * Updates the URL query parameter for filtering
   * Passing null resets filters
   */
  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  /**
   * Deletes a pending bill and refreshes the list
   * Only applicable to unpaid (pending) bills
   */
  const handleDelete = async (id) => {
    await api.delete(`/payments/${id}`);
    fetchBills();
  };

  return (
    <DashboardLayout
      title="Case Bills"
      navItems={[
        { label: "Dashboard", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
        {
          label: "Back to Case",
          path: `/advocate/my-cases/${caseId}`,
        },
      ]}
    >
      {/* ---------- Loading ---------- */}
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
                    ? "bg-primary text-text-primary"
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
                {/* Bill Amount */}
                <p className="text-base sm:text-lg font-semibold text-text-primary">
                  ₹{bill.amount}
                </p>

                {/* Bill Metadata */}
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

                {/* ---------- Actions ---------- */}
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
