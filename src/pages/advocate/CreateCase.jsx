import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const CreateCase = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    caseType: "",
  });

  // 🔹 Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get("/appointments");
        const found = res.data.data.find(
          (a) => a._id === appointmentId
        );

        if (!found) {
          setError("Appointment not found");
        } else {
          setAppointment(found);
        }
      } catch {
        setError("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/cases", {
        appointmentId,
        title: form.title,
        description: form.description,
        caseType: form.caseType,
      });

      navigate("/advocate");
    } catch {
      setError("Failed to create case");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Create Case">
        <p className="p-6 text-text-muted">Loading…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Create Case"
      navItems={[
        { label: "Dashboard", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {error && (
        <p className="mb-4 text-sm text-error">
          {error}
        </p>
      )}

      {/* ---------- Appointment Context ---------- */}
      {appointment && (
        <div className="mb-6 rounded-xl border border-border bg-surface p-6">
          <p className="font-semibold text-text-primary">
            Client: {appointment.client?.name} (
            {appointment.client?.email})
          </p>

          <div className="mt-2 space-y-1 text-sm text-text-secondary">
            <p>
              <strong>Appointment Date:</strong>{" "}
              {appointment.date}
            </p>
            <p>
              <strong>Time Slot:</strong>{" "}
              {appointment.timeSlot}
            </p>
            <p>
              <strong>Purpose:</strong>{" "}
              {appointment.purpose}
            </p>
          </div>
        </div>
      )}

      {/* ---------- Create Case Form ---------- */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md lg:max-w-lg space-y-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Case Title"
          value={form.title}
          onChange={handleChange}
          required
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

        <textarea
          name="description"
          placeholder="Case Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
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

        <select
          name="caseType"
          value={form.caseType}
          onChange={handleChange}
          required
          className="
            w-full rounded-lg
            border border-border
            bg-bg
            px-3 py-2
            text-text-primary
            focus:outline-none
            focus:ring-2 focus:ring-primary/30
          "
        >
          <option value="">Select Case Type</option>
          <option value="civil">Civil</option>
          <option value="criminal">Criminal</option>
        </select>

        <button
          type="submit"
          className="
            rounded-lg
            bg-primary
            px-4 py-2
            text-sm font-medium text-text-primary
            hover:bg-primary-hover
            transition-colors
          "
        >
          Create Case
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreateCase;
