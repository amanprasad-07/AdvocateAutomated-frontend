import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdvocateCreateBill = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [paymentFor, setPaymentFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!amount || !paymentFor) {
      setError("Amount and description are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/payments/bill", {
        caseId,
        amount: Number(amount),
        paymentFor,
      });

      navigate(`/advocate/my-cases/${caseId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create bill");
    } finally {
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
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="max-w-md lg:max-w-lg space-y-5">
          {/* ---------- Amount ---------- */}
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

          {/* ---------- Description ---------- */}
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

          {/* ---------- Error ---------- */}
          {error && (
            <p className="text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Actions ---------- */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full sm:w-auto
                rounded-lg
                bg-primary
                px-4 py-2
                text-sm font-medium text-white
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
                hover:bg-surface-elevated
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
