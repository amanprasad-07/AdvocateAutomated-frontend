import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const JuniorCaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await api.get(`/cases/${caseId}`);
        setCaseData(res.data.data);
      } catch {
        setError("Case not found or access denied.");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <DashboardLayout title="Case Details">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  /* ---------- Error ---------- */
  if (error || !caseData) {
    return (
      <DashboardLayout title="Case Details">
        <p className="text-sm text-error">
          {error}
        </p>
      </DashboardLayout>
    );
  }

  const isClosed = caseData.status === "closed";

  return (
    <DashboardLayout
      title="Case Details"
      navItems={[
        { label: "Dashboard", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
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
            <strong>Advocate:</strong>{" "}
            {caseData.advocate?.name || "N/A"}
          </p>
        </div>

        <div className="mt-3 text-sm">
          <strong>Status:</strong>{" "}
          <span className="capitalize font-medium text-text-primary">
            {caseData.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* ---------- Actions ---------- */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            navigate(`/junior_advocate/cases/${caseId}/tasks`)
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
          View Tasks
        </button>

        <button
          onClick={() =>
            navigate(`/junior_advocate/cases/${caseId}/evidence`)
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
          View Evidence
        </button>

        {!isClosed && (
          <button
            onClick={() =>
              navigate(
                `/junior_advocate/cases/${caseId}/add-evidence`
              )
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
            Add Evidence
          </button>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JuniorCaseDetails;
