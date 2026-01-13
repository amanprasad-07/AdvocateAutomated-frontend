import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const CreateCase = () => {
  // Extract appointment ID from route params
  const { appointmentId } = useParams();

  // Router navigation helper
  const navigate = useNavigate();

  // Stores fetched appointment context
  const [appointment, setAppointment] = useState(null);

  // Loading flag for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error message state for UI feedback
  const [error, setError] = useState("");

  // Controlled form state for case creation
  const [form, setForm] = useState({
    title: "",
    description: "",
    caseType: "",
  });

  /**
   * Fetch appointment details so the advocate
   * can see client and appointment context
   * before creating a case.
   */
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get("/appointments");

        // Locate the appointment matching the route param
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
        // Stop loading state regardless of outcome
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Generic form field handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Submit case creation request.
   * Links the case to the originating appointment.
   */
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

      // Redirect advocate back to dashboard after success
      navigate("/advocate");
    } catch {
      setError("Failed to create case");
    }
  };

  /* ---------- Loading State ---------- */
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
      {/* ---------- Error Message ---------- */}
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
        {/* Case title input */}
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

        {/* Case description input */}
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

        {/* Case type selector */}
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

        {/* Submit action */}
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
