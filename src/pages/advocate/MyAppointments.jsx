import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdvocateMyAppointments = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

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
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Helpers ---------- */

  const caseExistsForAppointment = (appointmentId) =>
    cases.some((c) =>
      typeof c.appointment === "string"
        ? c.appointment === appointmentId
        : c.appointment?._id === appointmentId
    );

  const getStatusStyles = (status) => {
    switch (status) {
      case "requested":
        return "border-l-warning text-warning";
      case "approved":
        return "border-l-success text-success";
      case "rejected":
        return "border-l-error text-error";
      default:
        return "";
    }
  };

  /* ---------- Filters ---------- */

  const filter = searchParams.get("filter") || "active";

  const visibleAppointments = appointments.filter((appt) => {
    const hasCase = caseExistsForAppointment(appt._id);

    switch (filter) {
      case "active":
        return (
          appt.status === "requested" ||
          (appt.status === "approved" && !hasCase)
        );
      case "rejected":
        return appt.status === "rejected";
      case "with_case":
        return appt.status === "approved" && hasCase;
      case "all":
        return true;
      default:
        return true;
    }
  });

  const setFilter = (value) => {
    setSearchParams({ filter: value });
  };

  /* ---------- Actions ---------- */

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

    setShowRejectModal(false);
    setRejectReason("");
    setSelectedAppointmentId(null);
  };

  return (
    <DashboardLayout
      title="My Appointments"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {loading && <LoadingSpinner />}
      {error && (
        <p className="mb-3 text-sm text-error">
          {error}
        </p>
      )}

      {/* ---------- Filters ---------- */}
      <div className="mb-4 flex flex-row flex-wrap gap-2 justify-center lg:justify-normal">
        {[
          ["active", "Active"],
          ["rejected", "Rejected"],
          ["with_case", "With Case"],
          ["all", "All"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              rounded-lg border border-border
              px-3 py-1 text-sm
              ${filter === key
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-surfaceElevated"
              }
              transition-colors
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleAppointments.length === 0 && (
        <p className="text-text-muted">
          No appointments match this filter.
        </p>
      )}

      {/* ---------- List ---------- */}
      <div className="space-y-4">
        {visibleAppointments.map((appt) => {
          const hasCase = caseExistsForAppointment(appt._id);

          return (
            <div
              key={appt._id}
              className={`
                rounded-xl border border-border
                border-l-4
                bg-surface
                p-4
                ${getStatusStyles(appt.status)}
              `}
            >
              <p className="font-semibold text-text-primary">
                Client: {appt.client?.name} ({appt.client?.email})
              </p>

              <div className="mt-1 space-y-1 text-sm text-text-secondary">
                <p>
                  <strong>Date:</strong> {appt.date}
                </p>
                <p>
                  <strong>Time Slot:</strong> {appt.timeSlot}
                </p>
                <p>
                  <strong>Purpose:</strong> {appt.purpose}
                </p>
                <p className="capitalize">
                  <strong>Status:</strong>{" "}
                  {appt.status.replace("_", " ")}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {appt.status === "requested" && (
                  <>
                    <button
                      onClick={() =>
                        approveAppointment(appt._id)
                      }
                      className="
                        rounded-lg
                        bg-success
                        px-3 py-1
                        text-sm font-medium text-white
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

                {appt.status === "approved" && !hasCase && (
                  <button
                    onClick={() =>
                      navigate(
                        `/advocate/create-case/${appt._id}`
                      )
                    }
                    className="
                      rounded-lg
                      bg-primary
                      px-3 py-1
                      text-sm font-medium text-white
                      hover:bg-primary-hover
                      transition-colors
                    "
                  >
                    Create Case
                  </button>
                )}

                {appt.status === "approved" && hasCase && (
                  <span className="text-sm font-medium text-success">
                    Case already created
                  </span>
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
              onChange={(e) =>
                setRejectReason(e.target.value)
              }
              className="
                mb-4 w-full rounded-lg
                border border-border
                bg-bg
                px-3 py-2
                text-text-primary
                focus:outline-none
                focus:ring-2 focus:ring-primary/30
              "
              rows={3}
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
                  text-sm font-medium text-white
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
