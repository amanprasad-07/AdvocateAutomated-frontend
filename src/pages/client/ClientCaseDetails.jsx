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
      { paymentId: bill._id }
    );


    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: bill.total * 100, // Convert to paise
      currency: "INR",
      name: "Advocate Automated System",
      description: "Legal Services Invoice",
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

 const handleDownloadInvoice = async (paymentId) => {
  try {
    const res = await api.get(`/invoices/${paymentId}/download`, {
      responseType: "blob", // Important for handling binary data
    });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    
    // Attempt to extract filename from headers, fallback to default
    const contentDisposition = res.headers['content-disposition'];
    let fileName = "Invoice.pdf";
    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
    }
    
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("Download failed", error);
    alert("Failed to download invoice. Please try again later.");
  }
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
      <h3 className="mb-4 text-lg font-semibold text-text-primary">
        Pending Bills
      </h3>

      {pendingBills.length === 0 && (
        <p className="text-text-muted">No pending bills.</p>
      )}

      <div className="space-y-5">
        {pendingBills.map((bill) => {
          const subtotal = bill.lineItems?.reduce(
            (sum, i) => sum + i.quantity * i.unitPrice,
            0
          ) || 0;

          return (
            <div
              key={bill._id}
              className="
          rounded-xl border border-border
          bg-surface
          p-6
          space-y-4
        "
            >
              {/* ---------- Header ---------- */}
              <div className="flex justify-between items-center">
                <h4 className="text-base font-semibold text-text-primary">
                  Bill Summary
                </h4>
                <span className="text-sm text-warning font-medium">
                  Pending
                </span>
              </div>

              {/* ---------- Items ---------- */}
              <div className="divide-y divide-border">
                {bill.lineItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-text-primary">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-sm text-text-muted">
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs text-text-muted">
                        Qty {item.quantity} × ₹{item.unitPrice}
                      </p>
                    </div>

                    <p className="font-medium text-text-primary">
                      ₹{item.quantity * item.unitPrice}
                    </p>
                  </div>
                ))}
              </div>

              {/* ---------- Totals ---------- */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span>₹{bill.subtotal}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>{bill.tax.label}</span>
                  <span>₹{bill.tax.amount}</span>
                </div>

                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₹{bill.total}</span>
                </div>
              </div>


              {/* ---------- Pay CTA ---------- */}
              <button
                onClick={() => handlePayNow(bill)}
                className="
            w-full rounded-lg
            bg-primary
            px-4 py-2
            text-sm font-medium text-text-primary
            hover:bg-primary-hover
            transition-colors
          "
              >
                Pay Securely
              </button>

              <p className="text-xs text-text-muted text-center">
                Payments are processed securely via Razorpay
              </p>
            </div>
          );
        })}
      </div>


      {/* ---------- Paid Bills ---------- */}
      {/* ---------- Paid Bills ---------- */}
      <h3 className="mt-8 mb-4 text-lg font-semibold text-text-primary">
        Paid Bills
      </h3>

      {paidBills.length === 0 && (
        <p className="text-text-muted">No paid bills.</p>
      )}

      <div className="space-y-5">
        {paidBills.map((bill) => (
          <div
            key={bill._id}
            className="
        rounded-xl border border-border
        bg-surface p-6 space-y-4
      "
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h4 className="text-base font-semibold text-text-primary">
                Payment Receipt
              </h4>
              <span className="text-sm font-medium text-success">
                Paid
              </span>
            </div>

            {/* Line Items */}
            <div className="divide-y divide-border">
              {bill.lineItems.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span className="text-text-secondary">
                    {item.title} × {item.quantity}
                  </span>
                  <span>₹{item.amount}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{bill.subtotal}</span>
              </div>

              <div className="flex justify-between text-text-secondary">
                <span>{bill.tax.label}</span>
                <span>₹{bill.tax.amount}</span>
              </div>

              <div className="flex justify-between font-semibold text-base">
                <span>Total Paid</span>
                <span>₹{bill.total}</span>
              </div>
            </div>

            {/* Invoice CTA */}
            {bill.invoice?.invoiceUrl && (
              <button
                onClick={() => handleDownloadInvoice(bill._id)}
                className="
                    mt-3 w-full rounded-lg
                    border border-primary
                    px-4 py-2 text-sm font-medium
                    text-primary hover:bg-primary/10
                  "
              >
                Download Invoice
              </button>

            )}
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default ClientCaseDetails;
