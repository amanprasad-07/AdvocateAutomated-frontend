import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

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

    try {
      await api.post("/appointments", form);
      navigate("/client/my-appointments");
    } catch (err) {
      setError("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Book Appointment"
      navItems={[
        { label: "Home", path: "/client" },
        { label: "My Appointments", path: "/client/my-appointments" },
        { label: "My Cases", path: "/client/my-cases" },
        { label: "My Payments", path: "#" },
      ]}
    >
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Advocate */}
        <select
          name="advocateId"
          value={form.advocateId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
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
          required
          className="w-full p-2 border rounded"
        />

        {/* Time Slot */}
        <select
          name="timeSlot"
          value={form.timeSlot}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default BookAppointment;
