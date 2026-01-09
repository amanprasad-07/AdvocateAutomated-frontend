import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import VerificationStatusBanner from "../../components/VerificationStatusBanner";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const AdvocateDashboard = () => {
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

  const pendingAppointments = appointments.filter(
    (a) => a.status === "requested"
  );

  const approvedAppointments = appointments.filter(
    (a) => a.status === "approved"
  );

  const activeCases = cases.filter(
    (c) => c.status === "open" || c.status === "in_progress"
  );

  const nextAppointment = [...approvedAppointments]
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <DashboardLayout
      title="Advocate Dashboard"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Advocate Info ---------- */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-6">
            <p className="text-lg font-semibold text-text-primary">
              Welcome, {user?.name}
            </p>
            <p className="pb-3 text-sm text-text-muted">
              {user?.email}
            </p>

            <VerificationStatusBanner />
          </div>

          {/* ---------- Metrics ---------- */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div
              onClick={() =>
                navigate(
                  "/advocate/my-appointments?status=requested"
                )
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
              <p className="text-2xl font-semibold text-warning">
                {pendingAppointments.length}
              </p>
            </div>

            <div
              onClick={() =>
                navigate(
                  "/advocate/my-appointments?status=approved"
                )
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
                Approved Appointments
              </p>
              <p className="text-2xl font-semibold text-success">
                {approvedAppointments.length}
              </p>
            </div>

            <div
              onClick={() =>
                navigate(
                  "/advocate/my-cases?status=open,in_progress"
                )
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
                Active Cases
              </p>
              <p className="text-2xl font-semibold text-text-primary">
                {activeCases.length}
              </p>
            </div>

            <div
              onClick={() =>
                navigate("/advocate/my-cases")
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
                Total Cases
              </p>
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
                  navigate(
                    "/advocate/my-appointments?status=approved"
                  )
                }
              >
                {nextAppointment.date} •{" "}
                {nextAppointment.timeSlot} •{" "}
                {nextAppointment.client?.name}
              </p>
            ) : (
              <p className="text-sm italic text-text-muted">
                No upcoming approved appointments.
              </p>
            )}
          </div>

          {/* ---------- Quick Actions ---------- */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                navigate(
                  "/advocate/my-appointments?status=requested"
                )
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
              Review Appointments
            </button>

            <button
              onClick={() =>
                navigate("/advocate/my-cases")
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
              View Cases
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdvocateDashboard;
