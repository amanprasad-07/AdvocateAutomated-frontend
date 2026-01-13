import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ----------
   Maps appointment status to visual indicators
   for quick recognition and consistency.
*/
const STATUS_STYLES = {
  requested: "border-l-warning text-warning",
  approved: "border-l-success text-success",
  rejected: "border-l-error text-error",
};

const MyAppointments = () => {
  // Stores all fetched appointments for the client
  const [appointments, setAppointments] = useState([]);

  // Tracks rejected appointments hidden by the user (persisted in localStorage)
  const [hiddenRejected, setHiddenRejected] = useState(() => {
    const stored = localStorage.getItem("hiddenRejectedAppointments");
    return stored ? JSON.parse(stored) : [];
  });

  // Controls loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Stores API or fetch-related errors
  const [error, setError] = useState("");

  // URL query parameter handler for filtering
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Fetch all appointments for the authenticated client
   * Runs once on component mount.
   */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments");
        setAppointments(res.data.data || []);
      } catch {
        setError("Failed to load appointments.");
      } finally {
        // Ensure loading state is cleared
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* ---------- Filters ---------- */

  // Extracts the current status filter from query params
  const statusParam = searchParams.get("status");

  /**
   * Applies visibility rules:
   * - Hidden rejected appointments are excluded
   * - Completed appointments are hidden by default
   * - Status filter applied when present
   */
  const visibleAppointments = appointments.filter((a) => {
    if (hiddenRejected.includes(a._id)) return false;
    if (!statusParam) return a.status !== "completed";
    return a.status === statusParam;
  });

  /**
   * Updates URL query params to apply or clear filters
   */
  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  /**
   * Hides a rejected appointment from the list
   * and persists the choice in localStorage.
   */
  const hideRejectedAppointment = (id) => {
    const updated = [...hiddenRejected, id];
    setHiddenRejected(updated);
    localStorage.setItem(
      "hiddenRejectedAppointments",
      JSON.stringify(updated)
    );
  };

  return (
    <DashboardLayout
      title="My Appointments"
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
          {/* Status-based appointment filters */}
          <div className="mb-4 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter(null)}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${!statusParam
                  ? "bg-primary text-text-primary"
                  : "text-text-secondary hover:bg-surfaceElevated"}
                transition-colors
              `}
            >
              All
            </button>

            <button
              onClick={() => setFilter("requested")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${statusParam === "requested"
                  ? "bg-surfaceElevated text-warning"
                  : "text-text-secondary hover:bg-surfaceElevated"}
                transition-colors
              `}
            >
              Requested
            </button>

            <button
              onClick={() => setFilter("approved")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${statusParam === "approved"
                  ? "bg-surfaceElevated text-success"
                  : "text-text-secondary hover:bg-surfaceElevated"}
                transition-colors
              `}
            >
              Approved
            </button>

            <button
              onClick={() => setFilter("rejected")}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${statusParam === "rejected"
                  ? "bg-surfaceElevated text-error"
                  : "text-text-secondary hover:bg-surfaceElevated"}
                transition-colors
              `}
            >
              Rejected
            </button>
          </div>

          {/* ---------- Error ---------- */}
          {/* Displays fetch-related errors */}
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {/* Shown when no appointments match filters */}
          {visibleAppointments.length === 0 && (
            <p className="text-text-muted">
              No appointments match this filter.
            </p>
          )}

          {/* ---------- Appointment List ---------- */}
          {/* Renders filtered appointment cards */}
          <div className="space-y-3">
            {visibleAppointments.map((appt) => (
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
                    <strong>Purpose:</strong> {appt.purpose}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize font-medium">
                      {appt.status}
                    </span>
                  </p>
                </div>

                {/* Rejection reason display */}
                {appt.status === "rejected" && appt.notes && (
                  <p className="mt-2 text-sm text-error">
                    <strong>Reason:</strong> {appt.notes}
                  </p>
                )}

                {/* Client-side removal of rejected appointment */}
                {appt.status === "rejected" && (
                  <button
                    onClick={() =>
                      hideRejectedAppointment(appt._id)
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
                    Remove
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

export default MyAppointments;
