import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * BookAppointment Page
 *
 * Allows a client to book an appointment with a verified advocate.
 * Handles advocate selection, date and time slot selection,
 * basic client-side validation, and submission to the backend.
 */
const BookAppointment = () => {
  // Navigation helper for redirects after successful booking
  const navigate = useNavigate();

  // List of available advocates fetched from the backend
  const [advocates, setAdvocates] = useState([]);

  // Controlled form state for appointment details
  const [form, setForm] = useState({
    advocateId: "",
    date: "",
    timeSlot: "",
    purpose: "",
  });

  // UI state for loading indicator and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Today's date in YYYY-MM-DD format (used to restrict date input)
  const today = new Date().toISOString().split("T")[0];

  /**
   * Fetch advocates on initial render
   *
   * Retrieves only approved advocates for appointment booking.
   */
  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const res = await api.get("/users/getAdvocates");
        setAdvocates(res.data.data);
      } catch {
        setError("Failed to load advocates");
      }
    };

    fetchAdvocates();
  }, []);

  /**
   * Generic input change handler
   *
   * Updates the corresponding field in the form state
   * using the input's name attribute.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Form submit handler
   *
   * Performs client-side date validation,
   * submits appointment data to the backend,
   * and redirects on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prevent booking appointments in the past
    const selectedDate = new Date(form.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (selectedDate < todayDate) {
      setError("Appointment date cannot be in the past");
      setLoading(false);
      return;
    }

    try {
      // Submit appointment request
      await api.post("/appointments", form);

      // Redirect to appointments list after successful booking
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
      {/* Global loading indicator */}
      {loading && <LoadingSpinner />}

      {/* Appointment booking form */}
      {!loading && (
        <div className="mx-auto sm:mx-0 w-full max-w-md sm:max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="
              space-y-4
              rounded-xl
              border border-border
              bg-surface
              p-6
            "
          >
            {/* Advocate selection */}
            <select
              name="advocateId"
              value={form.advocateId}
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
              <option value="">Select Advocate</option>
              {advocates.map((adv) => (
                <option key={adv._id} value={adv._id}>
                  {adv.name} ({adv.email})
                </option>
              ))}
            </select>

            {/* Appointment date */}
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={today}
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
            />

            {/* Time slot selection */}
            <select
              name="timeSlot"
              value={form.timeSlot}
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
              <option value="">Select Time Slot</option>
              <option value="10:00 - 10:30">10:00 - 10:30</option>
              <option value="10:30 - 11:00">10:30 - 11:00</option>
              <option value="11:00 - 11:30">11:00 - 11:30</option>
              <option value="11:30 - 12:00">11:30 - 12:00</option>
            </select>

            {/* Purpose / description */}
            <textarea
              name="purpose"
              placeholder="Purpose of appointment"
              value={form.purpose}
              onChange={handleChange}
              required
              rows={5}
              className="
                w-full rounded-lg
                border border-border
                bg-bg
                px-3 py-2
                text-text-primary
                focus:outline-none
                focus:ring-2 focus:ring-primary/30
              "
            />

            {/* Error message */}
            {error && (
              <p className="text-sm text-error">
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-lg
                bg-primary
                px-4 py-2
                text-sm font-medium text-text-primary
                hover:bg-primary-hover
                disabled:opacity-60
                transition-colors
              "
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BookAppointment;
