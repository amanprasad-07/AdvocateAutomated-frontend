import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ----------
   Maps past appointment statuses to semantic
   border and text styles for clear visual cues.
*/
const STATUS_STYLES = {
  completed: "border-l-success text-success",
  rejected: "border-l-error text-error",
};

const PastAppointments = () => {
  // Router helper for navigating to related case details
  const navigate = useNavigate();

  // Stores past appointments (completed or rejected)
  const [appointments, setAppointments] = useState([]);

  // Controls loading state during initial fetch
  const [loading, setLoading] = useState(true);

  // Stores API or fetch-related errors
  const [error, setError] = useState("");

  // URL query parameters used for status-based filtering
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Fetches all appointments and derives
   * only past appointments (completed or rejected).
   * Runs once on component mount.
   */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments");

        // Filter appointments that are considered "past"
        const past = res.data.data.filter(
          (appt) =>
            appt.status === "completed" ||
            appt.status === "rejected"
        );

        setAppointments(past || []);
      } catch {
        setError("Failed to load past appointments.");
      } finally {
        // Ensure loading state is cleared
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* ---------- Filters ---------- */

  // Reads status filter from URL query parameters
  const statusParam = searchParams.get("status");

  /**
   * Applies status-based filtering when a filter is active.
   * Defaults to showing all past appointments otherwise.
   */
  const filteredAppointments = statusParam
    ? appointments.filter(a => a.status === statusParam)
    : appointments;

  /**
   * Updates URL query params to apply or clear filters.
   */
  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <DashboardLayout
      title="Past Appointments"
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
          {/* ---------- Filters ---------- */}
          {/* Status-based filtering controls */}
          <div className="mb-4 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter(null)}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${!statusParam
                  ? "bg-primary text-text-primary"
                  : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              All
            </button>

            <button
              onClick={() => setFilter("completed")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${statusParam === "completed"
                  ? "bg-surfaceElevated text-success"
                  : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              Completed
            </button>

            <button
              onClick={() => setFilter("rejected")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${statusParam === "rejected"
                  ? "bg-surfaceElevated text-error"
                  : "text-text-secondary hover:bg-surfaceElevated"
                }
                transition-colors
              `}
            >
              Rejected
            </button>
          </div>

          {/* ---------- Error ---------- */}
          {/* Displays API or fetch-related errors */}
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {/* Shown when no appointments match the active filter */}
          {filteredAppointments.length === 0 && (
            <p className="text-text-muted">
              No past appointments match this filter.
            </p>
          )}

          {/* ---------- Appointment List ---------- */}
          {/* Renders past appointment cards */}
          <div className="space-y-3">
            {filteredAppointments.map((appt) => (
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
                  Advocate: {appt.advocate?.name || "N/A"}
                </p>

                <div className="mt-1 space-y-1 text-sm text-text-secondary">
                  <p>
                    <strong>Date:</strong> {appt.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {appt.timeSlot}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize font-medium">
                      {appt.status}
                    </span>
                  </p>
                </div>

                {/* ---------- Rejection Reason ---------- */}
                {/* Displayed only when appointment is rejected */}
                {appt.status === "rejected" && appt.notes && (
                  <p className="mt-2 text-sm text-error">
                    <strong>Reason:</strong> {appt.notes}
                  </p>
                )}

                {/* ---------- Case Link ---------- */}
                {/* Available only when a completed appointment resulted in a case */}
                {appt.status === "completed" && appt.linkedCase && (
                  <button
                    onClick={() =>
                      navigate(
                        `/client/my-cases/${appt.linkedCase}`
                      )
                    }
                    className="
                      mt-3 rounded-lg
                      border border-border
                      px-3 py-1 text-sm
                      text-text-secondary
                      hover:bg-surfaceElevated
                      hover:text-text-primary
                      transition-colors
                    "
                  >
                    View Case
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default PastAppointments;
