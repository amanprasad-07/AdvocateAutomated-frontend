import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const ClientDashboard = () => {
  // Router navigation helper
  const navigate = useNavigate();

  // Authenticated user context
  const { user } = useAuth();

  // Stores all appointments visible to the client
  const [appointments, setAppointments] = useState([]);

  // Stores all cases associated with the client
  const [cases, setCases] = useState([]);

  // Controls initial dashboard loading state
  const [loading, setLoading] = useState(true);

  /**
   * Fetch dashboard data on initial render
   *
   * Retrieves:
   * - All appointments for the authenticated client
   * - All cases associated with the client
   *
   * Data is fetched in parallel for better performance.
   */
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
        // Ensure loading state is cleared regardless of outcome
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ---------- Derived Data ---------- */

  /**
   * Active cases that are not yet closed
   */
  const openCases = cases.filter(
    (c) => c.status === "open" || c.status === "in_progress"
  );

  /**
   * Appointments that have been approved by advocates
   */
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "approved"
  );

  /**
   * Appointment requests awaiting advocate response
   */
  const pendingAppointments = appointments.filter(
    (a) => a.status === "requested"
  );

  /**
   * Next upcoming approved appointment, sorted by date
   */
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
      {/* Global loading indicator */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Client Info ---------- */}
          {/* Displays authenticated client identity */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-6">
            <p className="text-lg font-semibold text-text-primary">
              Welcome, {user?.name}
            </p>
            <p className="text-sm text-text-muted">
              {user?.email}
            </p>
          </div>

          {/* ---------- Metrics ---------- */}
          {/* High-level summary cards with quick navigation */}
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
                hover:bg-surfaceElevated
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
                hover:bg-surfaceElevated
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
                hover:bg-surfaceElevated
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
                hover:bg-surfaceElevated
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
          {/* Highlights the next upcoming appointment */}
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
          {/* Primary shortcuts for common client actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                navigate("/client/book-appointment")
              }
              className="
                rounded-lg
                bg-primary
                px-4 py-2
                text-sm font-medium text-text-primary
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
                hover:bg-surfaceElevated
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
                hover:bg-surfaceElevated
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
