import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import VerificationStatusBanner from "../../components/VerificationStatusBanner";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const AdvocateDashboard = () => {
  // Router navigation helper
  const navigate = useNavigate();

  // Authenticated user context
  const { user } = useAuth();

  // Stores all appointments assigned to the advocate
  const [appointments, setAppointments] = useState([]);

  // Stores all cases assigned to the advocate
  const [cases, setCases] = useState([]);

  // Global loading flag for dashboard data
  const [loading, setLoading] = useState(true);

  /**
   * Fetch dashboard data in parallel:
   * - Appointments
   * - Cases
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apptRes, caseRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/cases"),
        ]);

        // Normalize API responses
        setAppointments(apptRes.data.data || []);
        setCases(caseRes.data.data || []);
      } finally {
        // Stop loader regardless of success or failure
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Advocate verification gate
  const isVerified = user?.verificationStatus === "approved";

  /* ---------- Derived Data ---------- */

  // Appointments awaiting advocate decision
  const pendingAppointments = appointments.filter(
    (a) => a.status === "requested"
  );

  // Appointments approved by advocate
  const approvedAppointments = appointments.filter(
    (a) => a.status === "approved"
  );

  // Cases that are currently active
  const activeCases = cases.filter(
    (c) => c.status === "open" || c.status === "in_progress"
  );

  // Nearest upcoming approved appointment
  const nextAppointment = [...approvedAppointments]
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <DashboardLayout
      title="Advocate Dashboard"
      navItems={[
        { label: "Dashboard", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {/* ---------- Loading State ---------- */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Advocate Profile Section ---------- */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-6">
            <p className="text-base sm:text-lg font-semibold text-text-primary">
              Welcome, {user?.name}
            </p>

            <p className="pb-3 text-sm text-text-muted">
              {user?.email}
            </p>

            {/* Verification status indicator */}
            <VerificationStatusBanner />

            {/* ---------- Verification Rejected ---------- */}
            {user?.verificationStatus === "rejected" && (
              <div className="mt-3 rounded-lg border border-error bg-error/10 p-3">
                <p className="text-sm font-medium text-error">
                  Verification Rejected
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  Reason: {user.verificationRejectionReason}
                </p>

                <button
                  onClick={() => navigate("/verification/profile")}
                  className="
                    mt-2 rounded-lg bg-primary px-3 py-1
                    text-sm font-medium text-text-primary
                    hover:opacity-90
                  "
                >
                  Update Details & Resubmit
                </button>
              </div>
            )}

            {/* ---------- Verification Not Submitted ---------- */}
            {user?.verificationStatus === "pending" &&
              (!user?.advocateProfile || !user?.advocateProfile?.submittedAt) && (
                <button
                  onClick={() => navigate("/verification/profile")}
                  className="
                    mt-2 rounded-lg bg-primary
                    px-4 py-2 text-sm font-medium
                    text-text-primary hover:opacity-90
                  "
                >
                  Submit Verification Details
                </button>
              )}

            {/* ---------- Verification Under Review ---------- */}
            {user?.verificationStatus === "pending" &&
              user?.advocateProfile?.submittedAt && (
                <p className="mt-2 text-sm text-text-muted italic">
                  Verification details submitted. Awaiting admin review.
                </p>
              )}
          </div>

          {/* ---------- Metrics Section (Locked if Unverified) ---------- */}
          <div
            className={`
              ${!isVerified ? "opacity-40 pointer-events-none" : ""}
            `}
          >
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {/* Pending Appointment Requests */}
              <div
                onClick={() =>
                  navigate("/advocate/my-appointments?status=requested")
                }
                className="
                  cursor-pointer rounded-xl border border-border
                  bg-surface p-4 hover:bg-surfaceElevated
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

              {/* Approved Appointments */}
              <div
                onClick={() =>
                  navigate("/advocate/my-appointments?status=approved")
                }
                className="
                  cursor-pointer rounded-xl border border-border
                  bg-surface p-4 hover:bg-surfaceElevated
                  transition-colors
                "
              >
                <p className="text-sm text-text-muted">
                  Approved Appointments
                </p>
                <p className="text-2xl font-semibold text-text-primary">
                  {approvedAppointments.length}
                </p>
              </div>

              {/* Active Cases */}
              <div
                onClick={() =>
                  navigate("/advocate/my-cases?status=open,in_progress")
                }
                className="
                  cursor-pointer rounded-xl border border-border
                  bg-surface p-4 hover:bg-surfaceElevated
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

              {/* Total Cases */}
              <div
                onClick={() => navigate("/advocate/my-cases")}
                className="
                  cursor-pointer rounded-xl border border-border
                  bg-surface p-4 hover:bg-surfaceElevated
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
                    cursor-pointer text-primary
                    underline-offset-2 hover:underline
                  "
                  onClick={() =>
                    navigate("/advocate/my-appointments?status=approved")
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
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate("/advocate/my-appointments?status=requested")
                }
                className="
                  rounded-lg bg-primary px-4 py-2
                  text-sm font-medium text-text-primary
                  hover:bg-primary-hover transition-colors
                "
              >
                Review Appointments
              </button>

              <button
                onClick={() => navigate("/advocate/my-cases")}
                className="
                  rounded-lg border border-border
                  px-4 py-2 text-sm text-text-secondary
                  hover:bg-surfaceElevated hover:text-text-primary
                  transition-colors
                "
              >
                View Cases
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdvocateDashboard;
