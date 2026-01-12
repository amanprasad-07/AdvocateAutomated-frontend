import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ---------- */
const STATUS_STYLES = {
  requested: "border-l-warning text-warning",
  approved: "border-l-success text-success",
  rejected: "border-l-error text-error",
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [hiddenRejected, setHiddenRejected] = useState(() => {
    const stored = localStorage.getItem("hiddenRejectedAppointments");
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments");
        setAppointments(res.data.data || []);
      } catch {
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* ---------- Filters ---------- */
  const statusParam = searchParams.get("status");

  const visibleAppointments = appointments.filter((a) => {
    if (hiddenRejected.includes(a._id)) return false;
    if (!statusParam) return a.status !== "completed";
    return a.status === statusParam;
  });

  const setFilter = (status) => {
    if (!status) {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

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
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Filters ---------- */}
          <div className="mb-4 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter(null)}
              className={`
                rounded-lg border border-border
                px-3 py-1 text-sm
                ${
                  !statusParam
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surface-elevated"
                }
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
                ${
                  statusParam === "requested"
                    ? "bg-surface-elevated text-warning"
                    : "text-text-secondary hover:bg-surface-elevated"
                }
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
                ${
                  statusParam === "approved"
                    ? "bg-surface-elevated text-success"
                    : "text-text-secondary hover:bg-surface-elevated"
                }
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
                ${
                  statusParam === "rejected"
                    ? "bg-surface-elevated text-error"
                    : "text-text-secondary hover:bg-surface-elevated"
                }
                transition-colors
              `}
            >
              Rejected
            </button>
          </div>

          {/* ---------- Error ---------- */}
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {visibleAppointments.length === 0 && (
            <p className="text-text-muted">
              No appointments match this filter.
            </p>
          )}

          {/* ---------- Appointment List ---------- */}
          <div className="space-y-3">
            {visibleAppointments.map((appt) => (
              <div
                key={appt._id}
                className={`
                  rounded-xl border border-border
                  border-l-4
                  bg-surface
                  p-4
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

                {appt.status === "rejected" && appt.notes && (
                  <p className="mt-2 text-sm text-error">
                    <strong>Reason:</strong> {appt.notes}
                  </p>
                )}

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
                      hover:bg-surface-elevated
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
