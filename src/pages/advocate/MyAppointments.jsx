import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ---------- */
/* Visual cues for appointment cards based on current status */
const STATUS_STYLES = {
  requested: "border-l-warning text-warning",
  approved: "border-l-primary text-primary",
  rejected: "border-l-error text-error",
  completed: "border-l-success text-success",
};

/* Visual cues for active filter buttons */
const FILTER_STYLES = {
  requested: "text-warning",
  approved: "text-primary",
  rejected: "text-error",
  completed: "text-success",
};

const AdvocateMyAppointments = () => {
  // Router helpers
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Core data state
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  /* ---------- Data Fetch ---------- */
  /* Fetch appointments and cases in parallel to enable case-existence checks */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, caseRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/cases"),
        ]);

        setAppointments(apptRes.data.data || []);
        setCases(caseRes.data.data || []);
      } catch {
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Helpers ---------- */

  /**
   * Determines whether a case already exists for a given appointment.
   * Handles both populated and non-populated appointment references.
   */
  const caseExistsForAppointment = (appointmentId) =>
    cases.some((c) =>
      typeof c.appointment === "string"
        ? c.appointment === appointmentId
        : c.appointment?._id === appointmentId
    );

  /* ---------- Filters (Status-driven, consistent with My Cases) ---------- */

  // Active status filter from query params
  const statusParam = searchParams.get("status");

  // Apply status-based filtering when a filter is active
  const filteredAppointments = statusParam
    ? appointments.filter((a) =>
      statusParam.split(",").includes(a.status)
    )
    : appointments;

  // Update query params to reflect selected filter
  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  /* ---------- Actions ---------- */

  /**
   * Approves a requested appointment and updates local state optimistically.
   */
  const approveAppointment = async (appointmentId) => {
    await api.patch(`/appointments/${appointmentId}/status`, {
      status: "approved",
    });

    setAppointments((prev) =>
      prev.map((a) =>
        a._id === appointmentId
          ? { ...a, status: "approved" }
          : a
      )
    );
  };

  /**
   * Submits a rejection with notes and updates local state.
   */
  const submitRejection = async () => {
    if (!rejectReason.trim()) return;

    await api.patch(
      `/appointments/${selectedAppointmentId}/status`,
      {
        status: "rejected",
        notes: rejectReason,
      }
    );

    setAppointments((prev) =>
      prev.map((a) =>
        a._id === selectedAppointmentId
          ? { ...a, status: "rejected", notes: rejectReason }
          : a
      )
    );

    // Reset modal state after submission
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedAppointmentId(null);
  };

  /**
 * Marks consultation as completed for an approved appointment
 */
  const completeConsultation = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}/complete`);

      // Update local state
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId
            ? { ...a, status: "completed" }
            : a
        )
      );
    } catch {
      setError("Failed to mark consultation as completed");
    }
  };


  return (
    <DashboardLayout
      title="My Appointments"
      navItems={[
        { label: "Dashboard", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {/* ---------- Loading ---------- */}
      {loading && <LoadingSpinner />}

      {/* ---------- Error ---------- */}
      {error && (
        <p className="mb-3 text-sm text-error">
          {error}
        </p>
      )}

      {/* ---------- Filters ---------- */}
      <div className="mb-4 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setFilter(null)}
          className={`
            rounded-lg border border-border
            px-3 py-1 text-sm
            ${!statusParam
              ? "bg-surfaceElevated text-primary"
              : "text-text-secondary hover:bg-surfaceElevated"
            }
            transition-colors
          `}
        >
          All
        </button>

        {["requested", "approved", "rejected", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`
              rounded-lg border border-border
              px-3 py-1 text-sm capitalize
              ${statusParam === status
                ? `bg-surfaceElevated ${FILTER_STYLES[status]}`
                : "text-text-secondary hover:bg-surfaceElevated"
              }
              transition-colors
            `}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* ---------- Empty State ---------- */}
      {filteredAppointments.length === 0 && (
        <p className="text-text-muted">
          No appointments match this filter.
        </p>
      )}

      {/* ---------- Appointment List ---------- */}
      <div className="space-y-4">
        {filteredAppointments.map((appt) => {
          const hasCase = caseExistsForAppointment(appt._id);

          return (
            <div
              key={appt._id}
              className={`
                rounded-xl border border-border
                border-l-4
                bg-surface
                p-4
                hover:bg-surfaceElevated
                transition-colors
                ${STATUS_STYLES[appt.status] || ""}
              `}
            >
              <p className="font-semibold text-text-primary">
                Client: {appt.client?.name} ({appt.client?.email})
              </p>

              <div className="mt-1 space-y-1 text-sm text-text-secondary">
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time Slot:</strong> {appt.timeSlot}</p>
                <p><strong>Purpose:</strong> {appt.purpose}</p>
                <p className="capitalize">
                  <strong>Status:</strong>{" "}
                  {appt.status.replace(/_/g, " ")}
                </p>
              </div>

              {/* ---------- AI Case Overview (Read-only) ---------- */}
              {appt.aiAnalysis?.output && (
                <details className="mt-3 rounded-lg border border-border bg-bg p-3">
                  <summary className="cursor-pointer text-sm font-medium text-text-primary">
                    AI Case Overview
                  </summary>

                  <div className="mt-2 space-y-2 text-sm text-text-secondary">
                    <p>
                      <strong>Case Type:</strong>{" "}
                      {appt.aiAnalysis.output.caseType}
                    </p>

                    <p>
                      <strong>Urgency:</strong>{" "}
                      {appt.aiAnalysis.output.urgency}
                    </p>

                    <p>
                      <strong>Evidence Readiness:</strong>{" "}
                      {appt.aiAnalysis.output.evidenceReadiness}
                    </p>

                    <p>
                      <strong>Recommended Specialization:</strong>{" "}
                      {appt.aiAnalysis.output.recommendedSpecialization}
                    </p>

                    <div>
                      <strong>Suggested Next Steps:</strong>
                      <ul className="ml-5 list-disc">
                        {appt.aiAnalysis.output.nextSteps?.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    <p className="pt-2 text-xs italic text-text-muted">
                      AI-generated summary. Advocate judgment prevails.
                    </p>
                  </div>
                </details>
              )}

              {/* ---------- Contextual Actions ---------- */}
              <div className="mt-3 flex flex-wrap gap-2">
                {appt.status === "requested" && (
                  <>
                    <button
                      onClick={() => approveAppointment(appt._id)}
                      className="
                        rounded-lg
                        bg-success
                        px-3 py-1
                        text-sm font-medium text-text-primary
                        transition-colors
                      "
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAppointmentId(appt._id);
                        setShowRejectModal(true);
                      }}
                      className="
                        rounded-lg
                        border border-border
                        px-3 py-1
                        text-sm text-text-secondary
                        hover:bg-surfaceElevated
                        hover:text-text-primary
                        transition-colors
                      "
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* Consultation completion */}
                {appt.status === "approved" && (
                  <button
                    onClick={() => completeConsultation(appt._id)}
                    className="
      rounded-lg
      bg-primary
      px-3 py-1
      text-sm font-medium text-text-primary
      hover:bg-primary-hover
      transition-colors
    "
                  >
                    Mark Consultation Completed
                  </button>
                )}

                {/* Case creation only AFTER consultation */}
                {appt.status === "completed" && !hasCase && (
                  <button
                    onClick={() =>
                      navigate(`/advocate/create-case/${appt._id}`)
                    }
                    className="
                      rounded-lg
                      bg-success
                      px-3 py-1
                      text-sm font-medium text-text-primary
                      hover:bg-success-hover
                      transition-colors
                    "
                  >
                    Create Case
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Reject Modal ---------- */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6">
            <h3 className="mb-2 font-semibold text-text-primary">
              Reject Appointment
            </h3>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="
                mb-4 w-full rounded-lg
                border border-border
                bg-bg
                px-3 py-2
                text-text-primary
                focus:outline-none
                focus:ring-2 focus:ring-primary/30
              "
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedAppointmentId(null);
                }}
                className="
                  rounded-lg
                  border border-border
                  px-3 py-1
                  text-sm text-text-secondary
                  hover:bg-surfaceElevated
                  transition-colors
                "
              >
                Cancel
              </button>

              <button
                onClick={submitRejection}
                className="
                  rounded-lg
                  bg-error
                  px-3 py-1
                  text-sm font-medium text-text-primary
                  transition-colors
                "
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdvocateMyAppointments;
