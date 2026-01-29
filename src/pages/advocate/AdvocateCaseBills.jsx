import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const STATUS_STYLES = {
  pending: "border-l-warning",
  paid: "border-l-success",
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

  const statusParam = searchParams.get("status");

  const filteredBills = statusParam
    ? bills.filter((b) => b.status === statusParam)
    : bills;

  const setFilter = (status) => {
    status ? setSearchParams({ status }) : setSearchParams({});
  };

  const handleDelete = async (id) => {
    await api.delete(`/payments/${id}`);
    fetchBills();
  };

  const handleGenerateInvoice = async (paymentId) => {
    try {
      await api.post(`/invoices/${paymentId}/generate`);
      fetchBills(); // refresh list so UI updates
    } catch (err) {
      console.error("Invoice generation failed", err);
      alert("Failed to generate invoice");
    }
  };


  return (
    <DashboardLayout
      title="Case Bills"
      navItems={[
        { label: "Dashboard", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
        { label: "Back to Case", path: `/advocate/my-cases/${caseId}` },
      ]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Filters ---------- */}
          <div className="mb-4 flex flex-wrap gap-3 justify-center">
            {["all", "pending", "paid"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s === "all" ? null : s)}
                className={`
                  rounded-lg border border-border px-3 py-1 text-sm
                  ${(statusParam ?? "all") === s
                    ? "bg-primary text-text-primary"
                    : "text-text-secondary hover:bg-surfaceElevated"
                  }
                `}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          {filteredBills.length === 0 && (
            <p className="text-text-muted text-center">
              No bills match this filter.
            </p>
          )}

          {/* ---------- Bills ---------- */}
          <div className="space-y-5">
            {filteredBills.map((bill) => (
              <div
                key={bill._id}
                className={`
                  rounded-xl border border-border border-l-4
                  bg-surface p-5
                  ${STATUS_STYLES[bill.status]}
                `}
              >
                {/* ---------- Line Items ---------- */}
                <div className="space-y-2 text-sm">
                  {bill.lineItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-text-secondary"
                    >
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span>₹{item.amount}</span>
                    </div>
                  ))}
                </div>

                <hr className="my-3 border-border" />

                {/* ---------- Totals ---------- */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{bill.subtotal}</span>
                  </div>

                  <div className="flex justify-between text-text-secondary">
                    <span>{bill.tax.label}</span>
                    <span>₹{bill.tax.amount}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-base text-text-primary">
                    <span>Total</span>
                    <span>₹{bill.total}</span>
                  </div>
                </div>

                {/* ---------- Footer ---------- */}
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-sm font-medium capitalize ${bill.status === "paid"
                      ? "text-success"
                      : "text-warning"
                      }`}
                  >
                    {bill.status}
                  </span>

                  {bill.status === "pending" && (
                    <button
                      onClick={() => handleDelete(bill._id)}
                      className="
                        rounded-lg border border-error px-3 py-1
                        text-sm text-error hover:bg-surfaceElevated
                      "
                    >
                      Delete
                    </button>
                  )}

                  {bill.status === "paid" && !bill.invoice?.invoiceNumber && (
                    <button
                      onClick={() => handleGenerateInvoice(bill._id)}
                      className="
                        rounded-lg bg-primary px-3 py-1
                        text-sm text-text-primary
                        hover:bg-primary-hover
                      "
                    >
                      Generate Invoice
                    </button>
                  )}



                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdvocateCaseBills;
