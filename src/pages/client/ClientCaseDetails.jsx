import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Bill Status Styles (Semantic) ---------- */
/**
 * Visual styles mapped to bill payment status.
 * Used to provide quick semantic feedback to the client.
 */
const BILL_STYLES = {
  pending: "border-l-warning text-warning",
  paid: "border-l-success text-success",
};

const ClientCaseDetails = () => {
  // Extract case ID from route parameters
  const { caseId } = useParams();

  // Stores the selected case details
  const [caseData, setCaseData] = useState(null);

  // Stores all payment records related to this case
  const [payments, setPayments] = useState([]);

  // Global loading state for the page
  const [loading, setLoading] = useState(true);

  /**
   * Fetch case details and related payments on mount
   *
   * - Retrieves all accessible cases and finds the matching case by ID
   * - Retrieves all payments and filters those linked to the case
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all cases visible to the client
        const caseRes = await api.get("/cases");
        const found = caseRes.data.data.find(
          (c) => c._id === caseId
        );
        setCaseData(found || null);

        // Fetch all payments and filter by case ID
        const payRes = await api.get("/payments");
        const casePayments = payRes.data.data.filter(
          (p) => p.case?._id === caseId
        );
        setPayments(casePayments);
      } finally {
        // Ensure loading stops even if one request fails
        setLoading(false);
      }
    };

    fetchData();
  }, [caseId]);

  // Show loader while data is being fetched
  if (loading) {
    return (
      <DashboardLayout title="Case Details">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // Handle case not found or inaccessible
  if (!caseData) {
    return (
      <DashboardLayout title="Case Details">
        <p className="text-text-muted">Case not found.</p>
      </DashboardLayout>
    );
  }

  // Separate bills based on payment status
  const pendingBills = payments.filter(p => p.status === "pending");
  const paidBills = payments.filter(p => p.status === "paid");

  /**
   * Dynamically load Razorpay checkout script
   *
   * Returns a promise that resolves once the script is loaded
   * to avoid loading it globally or multiple times.
   */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /**
   * Handle Razorpay payment flow for a pending bill
   *
   * - Loads Razorpay SDK
   * - Creates an order on the backend
   * - Opens Razorpay checkout
   * - Verifies payment on successful completion
   */
  const handlePayNow = async (bill) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    // Create Razorpay order on the backend
    const orderRes = await api.post(
      "/payments/create-order",
      { amount: bill.amount }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: bill.amount * 100, // Convert to paise
      currency: "INR",
      name: "Advocate Automated System",
      description: bill.paymentFor,
      order_id: orderRes.data.order.id,

      // Called by Razorpay on successful payment
      handler: async function (response) {
        await api.post("/payments/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          paymentId: bill._id,
        });

        alert("Payment successful");
        // Reload to reflect updated payment status
        window.location.reload();
      },

      // Razorpay UI theming
      theme: {
        color: "#1d4ed8",
      },
    };

    // Open Razorpay checkout modal
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <DashboardLayout
      title="Case Details"
      navItems={[
        { label: "Dashboard", path: "/client" },
        { label: "Book Appointment", path: "/client/book-appointment" },
        { label: "My Appointments", path: "/client/my-appointments" },
        { label: "Past Appointments", path: "/client/past-appointments" },
        { label: "My Cases", path: "/client/my-cases" },
      ]}
    >
      {/* ---------- Case Info ---------- */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-6 space-y-2 sm:space-y-3">
        <p>
          <span className="font-medium text-text-secondary">Case Number:</span>{" "}
          {caseData.caseNumber}
        </p>
        <p>
          <span className="font-medium text-text-secondary">Title:</span>{" "}
          {caseData.title}
        </p>
        <p>
          <span className="font-medium text-text-secondary">Advocate:</span>{" "}
          {caseData.advocate?.name || "N/A"}
        </p>
        <p>
          <span className="font-medium text-text-secondary">Status:</span>{" "}
          <span className="capitalize text-text-primary">
            {caseData.status}
          </span>
        </p>
      </div>

      {/* ---------- Pending Bills ---------- */}
      <h3 className="mb-3 text-base sm:text-lg font-semibold text-text-primary">
        Pending Bills
      </h3>

      {pendingBills.length === 0 && (
        <p className="text-text-muted">No pending bills.</p>
      )}

      <div className="space-y-3">
        {pendingBills.map((bill) => (
          <div
            key={bill._id}
            className={`
              rounded-xl border border-border
              border-l-4
              bg-surface
              p-4
              ${BILL_STYLES.pending}
            `}
          >
            <p className="text-base sm:text-lg font-semibold text-text-primary">
              ₹{bill.amount}
            </p>
            <p className="text-text-secondary">
              {bill.paymentFor}
            </p>

            <button
              className="
                mt-4 w-full sm:w-auto rounded-lg
                bg-primary
                px-4 py-2
                text-sm font-medium text-text-primary
                hover:bg-primary-hover
                transition-colors
              "
              onClick={() => handlePayNow(bill)}
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>

      {/* ---------- Paid Bills ---------- */}
      <h3 className="mt-8 mb-3 text-base sm:text-lg font-semibold text-text-primary">
        Paid Bills
      </h3>

      {paidBills.length === 0 && (
        <p className="text-text-muted">No paid bills.</p>
      )}

      <div className="space-y-3">
        {paidBills.map((bill) => (
          <div
            key={bill._id}
            className={`
              rounded-xl border border-border
              border-l-4
              bg-surface
              p-4
              ${BILL_STYLES.paid}
            `}
          >
            <p className="text-base sm:text-lg font-semibold text-text-primary">
              ₹{bill.amount}
            </p>
            <p className="text-text-secondary">
              {bill.paymentFor}
            </p>
            <p className="mt-1 text-sm font-medium text-success">
              Paid
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ClientCaseDetails;
