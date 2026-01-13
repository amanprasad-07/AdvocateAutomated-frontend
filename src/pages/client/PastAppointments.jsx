import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Status Styles (Semantic) ---------- */
const STATUS_STYLES = {
  completed: "border-l-success text-success",
  rejected: "border-l-error text-error",
};

const PastAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments");

        const past = res.data.data.filter(
          (appt) =>
            appt.status === "completed" ||
            appt.status === "rejected"
        );

        setAppointments(past || []);
      } catch {
        setError("Failed to load past appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* ---------- Filters ---------- */
  const statusParam = searchParams.get("status");

  const filteredAppointments = statusParam
    ? appointments.filter(a => a.status === statusParam)
    : appointments;

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
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {filteredAppointments.length === 0 && (
            <p className="text-text-muted">
              No past appointments match this filter.
            </p>
          )}

          {/* ---------- Appointment List ---------- */}
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
                {appt.status === "rejected" && appt.notes && (
                  <p className="mt-2 text-sm text-error">
                    <strong>Reason:</strong> {appt.notes}
                  </p>
                )}

                {/* ---------- Case Link ---------- */}
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
