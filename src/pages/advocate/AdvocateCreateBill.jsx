import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdvocateCreateBill = () => {
  // Extract the case ID from the route parameters
  const { caseId } = useParams();

  // Navigation helper for redirecting after bill creation or cancellation
  const navigate = useNavigate();

  // Holds the bill amount entered by the advocate
  const [amount, setAmount] = useState("");

  // Holds the description/reason for the payment
  const [paymentFor, setPaymentFor] = useState("");

  // Indicates whether the bill creation request is in progress
  const [loading, setLoading] = useState(false);

  // Stores validation or API-related error messages
  const [error, setError] = useState("");

  /**
   * Handles bill creation submission.
   * Performs basic client-side validation before
   * sending the request to the backend.
   */
  const handleSubmit = async () => {
    // Validate required fields
    if (!amount || !paymentFor) {
      setError("Amount and description are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create a new bill for the given case
      await api.post("/payments/bill", {
        caseId,
        amount: Number(amount), // Ensure numeric value is sent
        paymentFor,
      });

      // Redirect back to the case details page after success
      navigate(`/advocate/my-cases/${caseId}`);
    } catch (err) {
      // Log error for debugging without interrupting UI flow
      console.error(err);
      setError("Failed to create bill");
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Bill"
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
      {/* ---------- Loading State ---------- */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="max-w-md lg:max-w-lg space-y-5">
          {/* ---------- Amount Input ---------- */}
          <div>
            <label className="mb-1 block font-medium text-text-primary">
              Amount (INR) <span className="text-error">*</span>
            </label>

            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="
                w-full rounded-lg
                border border-border
                bg-bg
                px-3 py-2
                text-text-primary
                placeholder:text-text-muted
                focus:outline-none
                focus:ring-2 focus:ring-primary/30
              "
            />
          </div>

          {/* ---------- Payment Description ---------- */}
          <div>
            <label className="mb-1 block font-medium text-text-primary">
              Payment For <span className="text-error">*</span>
            </label>

            <textarea
              value={paymentFor}
              onChange={(e) => setPaymentFor(e.target.value)}
              rows={3}
              placeholder="Consultation fee, drafting charges, etc."
              className="
                w-full rounded-lg
                border border-border
                bg-bg
                px-3 py-2
                text-text-primary
                placeholder:text-text-muted
                focus:outline-none
                focus:ring-2 focus:ring-primary/30
              "
            />
          </div>

          {/* ---------- Error Message ---------- */}
          {error && (
            <p className="text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Action Buttons ---------- */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full sm:w-auto
                rounded-lg
                bg-primary
                px-4 py-2
                text-sm font-medium text-text-primary
                hover:bg-primary-hover
                disabled:opacity-50
                transition-colors
              "
            >
              {loading ? "Creating..." : "Create Bill"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="
                w-full sm:w-auto
                rounded-lg
                border border-border
                px-4 py-2
                text-sm text-text-secondary
                hover:bg-surfaceElevated
                hover:text-text-primary
                transition-colors
              "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdvocateCreateBill;
