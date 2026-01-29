import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * BookAppointment Page
 *
 * Enforces mandatory AI case analysis before allowing
 * appointment booking with an advocate.
 */
const BookAppointment = () => {
  const navigate = useNavigate();

  /* --------------------------------------------------
   * AI CASE INTAKE STATE
   * -------------------------------------------------- */
  const [aiFormData, setAiFormData] = useState({
    description: "",
    category: "",
    urgency: "",
    hasDocuments: "",
    location: "",
  });

  // Stores AI assistant response
  const [aiResult, setAiResult] = useState(null);

  /* --------------------------------------------------
   * APPOINTMENT FORM STATE
   * -------------------------------------------------- */
  const [form, setForm] = useState({
    advocateId: "",
    date: "",
    timeSlot: "",
    purpose: "",
  });

  // List of approved advocates
  const [advocates, setAdvocates] = useState([]);

  // Global UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Tracks loading state while fetching advocates based on AI recommendation
  const [loadingAdvocates, setLoadingAdvocates] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);


  // Used to restrict date picker
  const today = new Date().toISOString().split("T")[0];

  /* --------------------------------------------------
   * FETCH APPROVED ADVOCATES
   * -------------------------------------------------- */
  useEffect(() => {
    if (!aiResult?.recommendedSpecialization) return;

    const fetchRecommendedAdvocates = async () => {
      try {
        setLoadingAdvocates(true);
        setError("");

        const res = await api.get(
          "/users/advocates/by-specialization",
          {
            params: {
              specialization: aiResult.recommendedSpecialization,
            },
          }
        );

        setAdvocates(res.data.data || []);
      } catch (err) {
        setError("Failed to load recommended advocates");
      } finally {
        setLoadingAdvocates(false);
      }
    };

    fetchRecommendedAdvocates();
  }, [aiResult]);



  /* --------------------------------------------------
   * INPUT HANDLERS
   * -------------------------------------------------- */

  // Handles AI form inputs
  const handleAIChange = (e) => {
    const { name, value } = e.target;
    setAiFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles appointment form inputs
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* --------------------------------------------------
   * AI ANALYSIS SUBMISSION
   * -------------------------------------------------- */
  const handleAIAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAiResult(null);

    try {
      const res = await api.post("/ai/case-assistant", aiFormData);
      setAiResult(res.data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to analyze case. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
   * APPOINTMENT SUBMISSION
   * -------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const selectedDate = new Date(form.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (selectedDate < todayDate) {
      setError("Appointment date cannot be in the past");
      setLoading(false);
      return;
    }

    try {
      await api.post("/appointments", {
        advocateId: form.advocateId,
        date: form.date,
        timeSlot: form.timeSlot,
        purpose: form.purpose,
        aiAnalysis: {
          input: aiFormData,
          output: aiResult,
          meta: {
            provider: "google",
            model: "gemini",
            generatedAt: new Date().toISOString()
          }
        }
      });


      navigate("/client/my-appointments");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Book Appointment"
      navItems={[
        { label: "Dashboard", path: "/client" },
        { label: "Book Appointment", path: "/client/book-appointment" },
        { label: "My Appointments", path: "/client/my-appointments" },
        { label: "Past Appointments", path: "/client/past-appointments" },
        { label: "My Cases", path: "/client/my-cases" },
      ]}
    >
      {/* ---------- AI CASE INTAKE ---------- */}
      <form
        onSubmit={handleAIAnalyze}
        className="rounded-xl border border-border bg-surface p-6 space-y-5"
      >
        <h2 className="text-lg font-semibold text-text-primary">
          Case Assessment (Required)
        </h2>

        <textarea
          name="description"
          value={aiFormData.description}
          onChange={handleAIChange}
          placeholder="Briefly describe what happened"
          rows={4}
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2"
        />

        <select
          name="category"
          value={aiFormData.category}
          onChange={handleAIChange}
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2"
        >
          <option value="">Select category</option>
          <option value="Civil">Civil</option>
          <option value="Criminal">Criminal</option>
          <option value="Family">Family</option>
          <option value="Property">Property</option>
          <option value="Corporate">Corporate</option>
          <option value="Not sure">Not sure</option>
        </select>

        <select
          name="urgency"
          value={aiFormData.urgency}
          onChange={handleAIChange}
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2"
        >
          <option value="">Select urgency</option>
          <option value="Immediate">Immediate</option>
          <option value="Soon">Soon</option>
          <option value="Exploratory">Exploratory</option>
        </select>

        <input
          name="location"
          value={aiFormData.location}
          onChange={handleAIChange}
          placeholder="Location / jurisdiction"
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2"
        />

        <div>
          <label className="mb-1 block text-sm text-text-secondary">
            Do you already have documents?
          </label>

          <div className="flex gap-6 text-sm text-text-primary">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="hasDocuments"
                value="yes"
                checked={aiFormData.hasDocuments === "yes"}
                onChange={handleAIChange}
                required
              />
              Yes
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="hasDocuments"
                value="no"
                checked={aiFormData.hasDocuments === "no"}
                onChange={handleAIChange}
                required
              />
              No
            </label>
          </div>
        </div>


        {error && <p className="text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium"
        >
          Get Case Overview
        </button>
      </form>

      {/* ---------- AI Result ---------- */}
      {aiResult && (
        <div className="mt-6 rounded-xl border border-border bg-surfaceElevated p-6">

          <h3 className="text-lg font-semibold text-text-primary">
            Case Overview
          </h3>

          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">
              Case Type:
            </span>{" "}
            {aiResult.caseType}
          </p>

          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">
              Urgency:
            </span>{" "}
            {aiResult.urgency}
          </p>

          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">
              Evidence Readiness:
            </span>{" "}
            {aiResult.evidenceReadiness}
          </p>

          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">
              Recommended Advocate:
            </span>{" "}
            {aiResult.recommendedSpecialization}
          </p>

          <div>
            <p className="mb-1 text-sm font-medium text-text-primary">
              Suggested Next Steps
            </p>
            <ul className="list-disc ml-5 text-sm text-text-secondary">
              {aiResult.nextSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
          <p className="pt-2 text-xs text-text-muted">
            This guidance is informational only and does not constitute legal advice.
          </p>
        </div>
      )}

      {/* ---------- LOADING ---------- */}
      {loading && <LoadingSpinner />}

      {aiResult && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Recommended Advocates for Your Case
          </h3>

          <p className="text-sm text-text-muted">
            Based on specialization: {aiResult.recommendedSpecialization}
          </p>

          {loadingAdvocates && (
            <p className="text-sm text-text-muted">
              Finding suitable advocates…
            </p>
          )}

          {!loadingAdvocates && advocates.length === 0 && (
            <p className="text-sm text-text-muted">
              No advocates found yet for this specialization.
            </p>
          )}

          {!loadingAdvocates &&
            advocates.map((adv) => (
              <div
                key={adv._id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    {adv.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {adv.advocateProfile?.experienceYears || 0} years experience
                  </p>
                </div>

                <button
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      advocateId: adv._id,
                    }));
                    setShowAppointmentForm(true);
                  }}
                  className="rounded-lg bg-primary px-3 py-1 text-sm font-medium"
                >
                  Select
                </button>
              </div>
            ))}
        </div>
      )}


      {/* ---------- APPOINTMENT FORM ---------- */}
      {aiResult && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-border bg-surface p-6 space-y-4"
        >
          <select
            name="advocateId"
            value={form.advocateId}
            onChange={handleAppointmentChange}
            required
            disabled={loadingAdvocates}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2"
          >
            <option value="">
              {loadingAdvocates
                ? "Finding suitable advocates..."
                : "Select Advocate"}
            </option>

            {advocates.map((adv) => (
              <option key={adv._id} value={adv._id}>
                {adv.name} ({adv.advocateProfile?.experienceYears || 0} yrs)
              </option>
            ))}
          </select>


          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleAppointmentChange}
            min={today}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2"
          />

          <select
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleAppointmentChange}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2"
          >
            <option value="">Select Time Slot</option>
            <option value="10:00 - 10:30">10:00 - 10:30</option>
            <option value="10:30 - 11:00">10:30 - 11:00</option>
            <option value="11:00 - 11:30">11:00 - 11:30</option>
            <option value="11:30 - 12:00">11:30 - 12:00</option>
          </select>

          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleAppointmentChange}
            placeholder="Purpose of appointment"
            rows={4}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2"
          />

          {!loadingAdvocates && advocates.length === 0 && (
            <p className="text-sm text-text-muted">
              Advocates matching this specialization are being onboarded.
              Meanwhile, you may proceed with a verified advocate experienced in related matters.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium"
          >
            Book Appointment
          </button>
        </form>
      )}
    </DashboardLayout>
  );
};

export default BookAppointment;
