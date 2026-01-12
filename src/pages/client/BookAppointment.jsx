import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const BookAppointment = () => {
  const navigate = useNavigate();

  const [advocates, setAdvocates] = useState([]);
  const [form, setForm] = useState({
    advocateId: "",
    date: "",
    timeSlot: "",
    purpose: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Fetch advocates
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      await api.post("/appointments", form);
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
      {loading && <LoadingSpinner />}

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
            {/* Advocate */}
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

            {/* Date */}
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

            {/* Time Slot */}
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

            {/* Purpose */}
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

            {error && (
              <p className="text-sm text-error">
                {error}
              </p>
            )}

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
