import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const GST_PERCENTAGE = 18;

const AdvocateCreateBill = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([
    { title: "", description: "", quantity: 1, unitPrice: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- Helpers ---------- */
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { title: "", description: "", quantity: 1, unitPrice: "" },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /* ---------- Calculations ---------- */
  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * Number(i.unitPrice || 0),
    0
  );

  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const total = subtotal + gstAmount;

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    if (items.some((i) => !i.title || !i.unitPrice)) {
      setError("Each item must have a title and rate");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/payments/bill", {
        caseId,
        lineItems: items.map((i) => ({
          title: i.title,
          description: i.description,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      });

      navigate(`/advocate/my-cases/${caseId}`);
    } catch {
      setError("Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Bill">
      <div className="max-w-3xl space-y-6">

        {/* ---------- Bill Items ---------- */}
        <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Bill Items
          </h3>

          {items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end"
            >
              <input
                placeholder="Title"
                value={item.title}
                onChange={(e) =>
                  updateItem(idx, "title", e.target.value)
                }
                className="sm:col-span-2 input bg-surfaceElevated border border-border px-2 py-1 rounded-md"
              />

              <input
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(idx, "description", e.target.value)
                }
                className="sm:col-span-2 input bg-surfaceElevated border border-border px-2 py-1 rounded-md"
              />

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(idx, "quantity", e.target.value)
                }
                className="input bg-surfaceElevated border border-border px-2 py-1 rounded-md"
              />

              <input
                type="number"
                min="0"
                placeholder="Rate"
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(idx, "unitPrice", e.target.value)
                }
                className="input bg-surfaceElevated border border-border px-2 py-1 rounded-md"
              />

              {items.length > 1 && (
                <button
                  onClick={() => removeItem(idx)}
                  className="text-sm text-error"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addItem}
            className="text-sm text-primary font-medium"
          >
            + Add Item
          </button>
        </div>

        {/* ---------- Summary ---------- */}
        <div className="rounded-xl border border-border bg-surface p-6 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm text-text-secondary">
            <span>GST @ {GST_PERCENTAGE}%</span>
            <span>₹{gstAmount}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Payable</span>
            <span>₹{total}</span>
          </div>

          <p className="text-xs text-text-muted">
            GST is calculated automatically as per Indian tax regulations.
          </p>
        </div>

        {/* ---------- Error ---------- */}
        {error && <p className="text-sm text-error">{error}</p>}

        {/* ---------- Action ---------- */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-2 text-text-primary"
        >
          {loading ? "Creating..." : "Create Bill"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdvocateCreateBill;
