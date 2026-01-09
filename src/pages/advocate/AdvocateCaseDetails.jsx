import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdvocateCaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCase = async () => {
    try {
      const res = await api.get(`/cases/${caseId}`);
      setCaseData(res.data.data);
    } catch {
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      await api.patch(`/cases/${caseId}/status`, { status: newStatus });
      await fetchCase();
    } catch {
      alert("Failed to update case status");
    } finally {
      setUpdating(false);
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <DashboardLayout title="Case Details">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  /* ---------- Access denied / not found ---------- */
  if (!caseData) {
    return (
      <DashboardLayout title="Case Details">
        <p className="text-sm text-error">
          You do not have permission to view this case.
        </p>
      </DashboardLayout>
    );
  }

  const isClosed = caseData.status === "closed";

  return (
    <DashboardLayout
      title="Case Details"
      navItems={[
        { label: "Home", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
      ]}
    >
      {/* ---------- Case Summary ---------- */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-4">
        <div className="space-y-1 text-sm text-text-secondary">
          <p>
            <strong>Case Number:</strong> {caseData.caseNumber}
          </p>
          <p>
            <strong>Title:</strong> {caseData.title}
          </p>
          <p>
            <strong>Client:</strong> {caseData.client?.name}
          </p>
        </div>

        <div className="mt-3 text-sm">
          <strong>Status:</strong>{" "}
          <span className="capitalize font-medium text-text-primary">
            {caseData.status.replace("_", " ")}
          </span>
        </div>

        {/* ---------- Status Actions ---------- */}
        {!isClosed && (
          <div className="mt-4 flex flex-wrap gap-3">
            {caseData.status === "open" && (
              <button
                disabled={updating}
                onClick={() => updateStatus("in_progress")}
                className="
                  rounded-lg
                  bg-primary
                  px-4 py-2
                  text-sm font-medium text-white
                  hover:bg-primary-hover
                  disabled:opacity-50
                  transition-colors
                "
              >
                Mark In Progress
              </button>
            )}

            {caseData.status === "in_progress" && (
              <button
                disabled={updating}
                onClick={() => updateStatus("closed")}
                className="
                  rounded-lg
                  bg-primary
                  px-4 py-2
                  text-sm font-medium text-white
                  hover:bg-primary-hover
                  disabled:opacity-50
                  transition-colors
                "
              >
                Mark Completed
              </button>
            )}
          </div>
        )}
      </div>

      {/* ---------- Case Actions ---------- */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              navigate(`/advocate/my-cases/${caseId}/tasks`)
            }
            className="
              rounded-lg
              border border-border
              px-3 py-2
              text-sm text-text-secondary
              hover:bg-surfaceElevated
              hover:text-text-primary
              transition-colors
            "
          >
            View Tasks
          </button>

          {!isClosed && (
            <button
              onClick={() =>
                navigate(`/advocate/my-cases/${caseId}/add-task`)
              }
              className="
                rounded-lg
                border border-border
                px-3 py-2
                text-sm text-text-secondary
                hover:bg-surfaceElevated
                hover:text-text-primary
                transition-colors
              "
            >
              Add Task
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              navigate(`/advocate/my-cases/${caseId}/evidence`)
            }
            className="
              rounded-lg
              border border-border
              px-3 py-2
              text-sm text-text-secondary
              hover:bg-surfaceElevated
              hover:text-text-primary
              transition-colors
            "
          >
            View Evidence
          </button>

          {!isClosed && (
            <button
              onClick={() =>
                navigate(`/advocate/my-cases/${caseId}/add-evidence`)
              }
              className="
                rounded-lg
                border border-border
                px-3 py-2
                text-sm text-text-secondary
                hover:bg-surfaceElevated
                hover:text-text-primary
                transition-colors
              "
            >
              Add Evidence
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {!isClosed && (
            <button
              onClick={() =>
                navigate(`/advocate/my-cases/${caseId}/create-bill`)
              }
              className="
                rounded-lg
                border border-border
                px-3 py-2
                text-sm text-text-secondary
                hover:bg-surfaceElevated
                hover:text-text-primary
                transition-colors
              "
            >
              Create Bill
            </button>
          )}

          <button
            onClick={() =>
              navigate(`/advocate/my-cases/${caseId}/bills`)
            }
            className="
              rounded-lg
              border border-border
              px-3 py-2
              text-sm text-text-secondary
              hover:bg-surfaceElevated
              hover:text-text-primary
              transition-colors
            "
          >
            View Bills
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdvocateCaseDetails;
