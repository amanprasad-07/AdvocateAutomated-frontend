import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments");
        // adjust endpoint if different
        setAppointments(res.data.data);
      } catch (err) {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <DashboardLayout
      title="My Appointments"
      navItems={[
        { label: "Home", path: "/client" },
        { label: "Book Appointment", path: "/client/book-appointment" },
        { label: "My Cases", path: "/client/my-cases" },
        { label: "My Payments", path: "#" },
      ]}
    >
      {loading && <p>Loading appointments...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && appointments.length === 0 && (
        <p>No appointments booked yet.</p>
      )}

      {!loading && appointments.length > 0 && (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="border border-border p-4 rounded"
            >
              <p>
                <strong>Advocate:</strong>{" "}
                {appt.advocate?.name || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {appt.date}
              </p>
              <p>
                <strong>Time Slot:</strong> {appt.timeSlot}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{appt.status}</span>
              </p>
              <p>
                <strong>Purpose:</strong> {appt.purpose}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyAppointments;
