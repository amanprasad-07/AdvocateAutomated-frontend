import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

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
    assignedJuniors: [],
  });

  const [juniors, setJuniors] = useState([]);


  /**
   * Fetch appointment details so the advocate
   * can see client and appointment context
   * before creating a case.
   */
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${appointmentId}`)

        // Locate the appointment matching the route param
        const appointment = res.data.data;

        if (!appointment) {
          setError("Appointment not found");
        } else {
          setAppointment(appointment);
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

  useEffect(() => {
    const fetchJuniors = async () => {
      try {
        const res = await api.get("/users/getJuniors");
        setJuniors(res.data.data || []);
      } catch {
        // silent fail — junior assignment is optional
      }
    };

    fetchJuniors();
  }, []);


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
        assignedJuniors: form.assignedJuniors,
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
        <div className="flex justify-center p-6">
          <LoadingSpinner />
        </div>
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

      {/* ---------- AI Case Analysis (Read-only) ---------- */}
      {appointment?.aiAnalysis?.output && (
        <div className="mb-6 rounded-xl border border-border bg-surfaceElevated p-6">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            AI Case Analysis (Reference Only)
          </h3>

          <div className="space-y-2 text-sm text-text-secondary">
            <p>
              <strong>Case Type:</strong>{" "}
              {appointment.aiAnalysis.output.caseType}
            </p>

            <p>
              <strong>Urgency:</strong>{" "}
              {appointment.aiAnalysis.output.urgency}
            </p>

            <p>
              <strong>Evidence Readiness:</strong>{" "}
              {appointment.aiAnalysis.output.evidenceReadiness}
            </p>

            <p>
              <strong>Recommended Specialization:</strong>{" "}
              {appointment.aiAnalysis.output.recommendedSpecialization}
            </p>

            {Array.isArray(appointment.aiAnalysis.output.nextSteps) && (
              <div>
                <strong>Suggested Next Steps:</strong>
                <ul className="ml-5 mt-1 list-disc">
                  {appointment.aiAnalysis.output.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs italic text-text-muted">
            This AI-generated analysis is advisory in nature.
            Final legal assessment and case framing rests with the advocate.
          </p>
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

        {/* ---------- Assign Junior Advocates ---------- */}
        {juniors.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-sm font-semibold text-text-primary">
              Assign Junior Advocates (optional)
            </p>

            <div className="space-y-2 text-sm text-text-secondary">
              {juniors.map((junior) => (
                <label key={junior._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.assignedJuniors.includes(junior._id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm((prev) => ({
                        ...prev,
                        assignedJuniors: checked
                          ? [...prev.assignedJuniors, junior._id]
                          : prev.assignedJuniors.filter(
                            (id) => id !== junior._id
                          ),
                      }));
                    }}
                  />
                  {junior.name} ({junior.email})
                </label>
              ))}
            </div>
          </div>
        )}


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
