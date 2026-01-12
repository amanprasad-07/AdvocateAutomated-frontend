import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apptRes, caseRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/cases"),
        ]);

        setAppointments(apptRes.data.data || []);
        setCases(caseRes.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ---------- Derived Data ---------- */

  const openCases = cases.filter(
    (c) => c.status === "open" || c.status === "in_progress"
  );

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "approved"
  );

  const pendingAppointments = appointments.filter(
    (a) => a.status === "requested"
  );

  const nextAppointment = [...upcomingAppointments]
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <DashboardLayout
      title="Client Dashboard"
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
        <>
          {/* ---------- Client Info ---------- */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-6">
            <p className="text-lg font-semibold text-text-primary">
              Welcome, {user?.name}
            </p>
            <p className="text-sm text-text-muted">
              {user?.email}
            </p>
          </div>

          {/* ---------- Metrics ---------- */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div
              onClick={() =>
                navigate("/client/my-cases?status=open,in_progress")
              }
              className="
                cursor-pointer
                rounded-xl border border-border
                bg-surface
                p-4
                hover:bg-surface-elevated
                transition-colors
              "
            >
              <p className="text-sm text-text-muted">Open Cases</p>
              <p className="text-2xl font-semibold text-text-primary">
                {openCases.length}
              </p>
            </div>

            <div
              onClick={() =>
                navigate("/client/my-appointments?status=approved")
              }
              className="
                cursor-pointer
                rounded-xl border border-border
                bg-surface
                p-4
                hover:bg-surface-elevated
                transition-colors
              "
            >
              <p className="text-sm text-text-muted">
                Upcoming Appointments
              </p>
              <p className="text-2xl font-semibold text-text-primary">
                {upcomingAppointments.length}
              </p>
            </div>

            <div
              onClick={() =>
                navigate("/client/my-appointments?status=requested")
              }
              className="
                cursor-pointer
                rounded-xl border border-border
                bg-surface
                p-4
                hover:bg-surface-elevated
                transition-colors
              "
            >
              <p className="text-sm text-text-muted">
                Pending Requests
              </p>
              <p className="text-2xl font-semibold text-text-primary">
                {pendingAppointments.length}
              </p>
            </div>

            <div
              onClick={() => navigate("/client/my-cases")}
              className="
                cursor-pointer
                rounded-xl border border-border
                bg-surface
                p-4
                hover:bg-surface-elevated
                transition-colors
              "
            >
              <p className="text-sm text-text-muted">Total Cases</p>
              <p className="text-2xl font-semibold text-text-primary">
                {cases.length}
              </p>
            </div>
          </div>

          {/* ---------- Focus Section ---------- */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-6">
            <p className="mb-1 font-semibold text-text-primary">
              Next Appointment
            </p>

            {nextAppointment ? (
              <p
                className="
                  cursor-pointer
                  text-primary
                  underline-offset-2
                  hover:underline
                "
                onClick={() =>
                  navigate("/client/my-appointments?status=approved")
                }
              >
                {nextAppointment.date} • {nextAppointment.timeSlot}
              </p>
            ) : (
              <p className="text-sm italic text-text-muted">
                No upcoming appointments scheduled.
              </p>
            )}
          </div>

          {/* ---------- Quick Actions ---------- */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                navigate("/client/book-appointment")
              }
              className="
                rounded-lg
                bg-primary
                px-4 py-2
                text-sm font-medium text-white
                hover:bg-primary-hover
                transition-colors
              "
            >
              Book Appointment
            </button>

            <button
              onClick={() => navigate("/client/my-cases")}
              className="
                rounded-lg
                border border-border
                px-4 py-2
                text-sm text-text-secondary
                hover:bg-surface-elevated
                hover:text-text-primary
                transition-colors
              "
            >
              View Cases
            </button>

            <button
              onClick={() =>
                navigate("/client/my-appointments")
              }
              className="
                rounded-lg
                border border-border
                px-4 py-2
                text-sm text-text-secondary
                hover:bg-surface-elevated
                hover:text-text-primary
                transition-colors
              "
            >
              View Appointments
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ClientDashboard;
