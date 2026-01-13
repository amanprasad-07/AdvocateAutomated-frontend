import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Evidence Type Styles (Semantic) ---------- */
// Maps evidence file types to semantic border styles
const TYPE_STYLES = {
  document: "border-l-primary",
  image: "border-l-success",
  audio: "border-l-warning",
  video: "border-l-warning",
  other: "border-l-border",
};

const JuniorCaseEvidence = () => {
  // Extract case ID from route parameters
  const { caseId } = useParams();

  // URL search params for client-side filtering
  const [searchParams, setSearchParams] = useSearchParams();

  // Stores all fetched evidence records
  const [evidence, setEvidence] = useState([]);

  // Loading state while fetching evidence
  const [loading, setLoading] = useState(true);

  // Error message for failed fetch operations
  const [error, setError] = useState("");

  /**
   * Fetch evidence related to the current case.
   * Access is restricted by backend role and case assignment.
   */
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await api.get(`/evidence?caseId=${caseId}`);
        setEvidence(res.data.data || []);
      } catch {
        setError("Failed to load evidence.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, [caseId]);

  /* ---------- Filters ---------- */
  // Current evidence type filter from query params
  const typeParam = searchParams.get("type");

  // Apply type-based filtering if a filter is active
  const filteredEvidence = typeParam
    ? evidence.filter((e) => e.fileType === typeParam)
    : evidence;

  // Update URL search params to reflect selected filter
  const setFilter = (type) => {
    if (!type) {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
  };

  /* ---------- Loading ---------- */
  // Display spinner while evidence data is loading
  if (loading) {
    return (
      <DashboardLayout title="Case Evidence">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  /* ---------- Error ---------- */
  // Display error message if evidence fetch fails
  if (error) {
    return (
      <DashboardLayout title="Case Evidence">
        <p className="text-sm text-error">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Case Evidence"
      navItems={[
        { label: "Dashboard", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
        {
          label: "Back to Case",
          path: `/junior_advocate/cases/${caseId}`,
        },
      ]}
    >
      {/* ---------- Filters ---------- */}
      {/* Allows filtering evidence by file type */}
      <div className="mb-4 flex flex-wrap gap-3 justify-center">
        {[
          [null, "All"],
          ["document", "Documents"],
          ["image", "Images"],
          ["audio", "Audio"],
          ["video", "Video"],
          ["other", "Other"],
        ].map(([key, label]) => (
          <button
            key={key || "all"}
            onClick={() => setFilter(key)}
            className={`
              rounded-lg border border-border
              px-3 py-1 text-sm
              ${
                typeParam === key || (!key && !typeParam)
                  ? "bg-surfaceElevated text-text-primary"
                  : "text-text-secondary hover:bg-surfaceElevated"
              }
              transition-colors
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------- Empty State ---------- */}
      {/* Displayed when no evidence matches the current filter */}
      {filteredEvidence.length === 0 && (
        <p className="text-text-muted">
          No evidence matches this filter.
        </p>
      )}

      {/* ---------- Evidence List ---------- */}
      {/* Render each evidence item with metadata and access link */}
      <div className="space-y-3">
        {filteredEvidence.map((e) => (
          <div
            key={e._id}
            className={`
              rounded-xl border border-border
              border-l-4
              bg-surface
              p-4
              ${TYPE_STYLES[e.fileType] || TYPE_STYLES.other}
            `}
          >
            <p className="font-medium text-text-primary">
              {e.title}
            </p>

            {/* Optional evidence description */}
            {e.description && (
              <p className="mt-1 text-sm text-text-muted">
                {e.description}
              </p>
            )}

            {/* Evidence metadata */}
            <div className="mt-2 space-y-1 text-sm text-text-secondary">
              <p>
                <strong>Uploaded by:</strong>{" "}
                {e.uploadedBy?.name || "N/A"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(e.createdAt).toLocaleDateString()}
              </p>

              <p className="capitalize">
                <strong>Type:</strong> {e.fileType}
              </p>
            </div>

            {/* Evidence access link */}
            <div className="mt-3">
              <a
                href={e.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center
                  rounded-lg border border-border
                  px-3 py-1.5
                  text-sm
                  text-primary
                  hover:bg-surfaceElevated
                  transition-colors
                "
              >
                Open Evidence
              </a>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default JuniorCaseEvidence;
