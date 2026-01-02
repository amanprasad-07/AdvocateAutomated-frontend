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
    return <p className="p-6">Loading...</p>;
  }

  return (
    <DashboardLayout
      title="Create Case"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {appointment && (
        <div className="mb-6 border border-border p-4 rounded">
          <p>
            <strong>Client:</strong>{" "}
            {appointment.client?.name} ({appointment.client?.email})
          </p>
          <p>
            <strong>Appointment Date:</strong> {appointment.date}
          </p>
          <p>
            <strong>Time Slot:</strong> {appointment.timeSlot}
          </p>
          <p>
            <strong>Purpose:</strong> {appointment.purpose}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Case Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Case Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="caseType"
          value={form.caseType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Case Type</option>
          <option value="civil">Civil</option>
          <option value="criminal">Criminal</option>
        </select>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Create Case
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreateCase;
