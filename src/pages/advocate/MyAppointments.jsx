import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const AdvocateMyAppointments = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, caseRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/cases"),
        ]);

        setAppointments(apptRes.data.data);
        setCases(caseRes.data.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });

      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId
            ? { ...appt, status }
            : appt
        )
      );
    } catch {
      alert("Failed to update appointment status");
    }
  };

  const caseExistsForAppointment = (appointmentId) => {
    return cases.some((c) =>
      typeof c.appointment === "string"
        ? c.appointment === appointmentId
        : c.appointment?._id === appointmentId
    );
  };



  return (
    <DashboardLayout
      title="My Appointments"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {loading && <p>Loading appointments...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && appointments.length === 0 && (
        <p>No appointments assigned yet.</p>
      )}

      {!loading && appointments.length > 0 && (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="border border-border p-4 rounded flex justify-between items-start"
            >
              <div className="space-y-1">
                <p>
                  <strong>Client:</strong>{" "}
                  {appt.client?.name} ({appt.client?.email})
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
              </div>

              <div className="flex gap-2">
                {appt.status === "requested" && (
                  <>
                    <button
                      onClick={() => updateStatus(appt._id, "approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(appt._id, "rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {appt.status === "approved" &&
                  !caseExistsForAppointment(appt._id) && (
                    <button
                      onClick={() =>
                        navigate(`/advocate/create-case/${appt._id}`)
                      }
                      className="bg-primary text-white px-3 py-1 rounded"
                    >
                      Create Case
                    </button>
                  )}

                {appt.status === "approved" &&
                  caseExistsForAppointment(appt._id) && (
                    <span className="text-sm text-green-700 font-medium">
                      Case already created
                    </span>
                  )}
              </div>


            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdvocateMyAppointments;
