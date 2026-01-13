import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const JuniorCaseDetails = () => {
  // Extract the case ID from the route parameters
  const { caseId } = useParams();

  // Navigation helper for programmatic route changes
  const navigate = useNavigate();

  // Holds the fetched case details
  const [caseData, setCaseData] = useState(null);

  // Indicates whether the case data is still being loaded
  const [loading, setLoading] = useState(true);

  // Stores error messages related to fetching or access issues
  const [error, setError] = useState("");

  /**
   * Fetch case details for the given case ID.
   * Access is role-restricted on the backend, so failures may
   * indicate missing permissions or a non-existent case.
   */
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
  // Show a loading indicator while data is being fetched
  if (loading) {
    return (
      <DashboardLayout title="Case Details">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  /* ---------- Error ---------- */
  // Handle missing or inaccessible case data
  if (error || !caseData) {
    return (
      <DashboardLayout title="Case Details">
        <p className="text-sm text-error">
          {error}
        </p>
      </DashboardLayout>
    );
  }

  // Determine whether the case is closed to restrict further actions
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
      {/* Displays high-level, read-only information about the case */}
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
      {/* Navigation actions available to the junior advocate */}
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

        {/* Allow evidence upload only if the case is not closed */}
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
