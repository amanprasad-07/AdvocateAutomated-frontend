import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Evidence Type Styles (Semantic) ----------
   Maps evidence file types to left-border styles
   for quick visual differentiation in the UI.
---------------------------------------------------- */
const TYPE_STYLES = {
  document: "border-l-primary",
  image: "border-l-success",
  audio: "border-l-warning",
  video: "border-l-warning",
  other: "border-l-border",
};

const AdvocateCaseEvidence = () => {
  // Extract case ID from route parameters
  const { caseId } = useParams();

  // URL search params for filter persistence
  const [searchParams, setSearchParams] = useSearchParams();

  // Stores evidence list for the case
  const [evidence, setEvidence] = useState([]);

  // Indicates loading state while fetching evidence
  const [loading, setLoading] = useState(true);

  // Stores fetch or processing errors
  const [error, setError] = useState("");

  /**
   * Fetch evidence associated with the given case ID
   * Runs on initial mount and when caseId changes
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

  /* ---------- Filters ----------
     Evidence can be filtered by file type
     using URL query parameters.
  ----------------------------- */
  const typeParam = searchParams.get("type");

  // Apply type filter if present
  const filteredEvidence = typeParam
    ? evidence.filter((e) => e.fileType === typeParam)
    : evidence;

  /**
   * Updates the URL search params to reflect
   * selected evidence type filter.
   */
  const setFilter = (type) => {
    if (!type) {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
  };

  return (
    <DashboardLayout
      title="Case Evidence"
      navItems={[
        { label: "Dashboard", path: "/advocate" },
        { label: "My Appointments", path: "/advocate/my-appointments" },
        { label: "My Cases", path: "/advocate/my-cases" },
        {
          label: "Back to Case",
          path: `/advocate/my-cases/${caseId}`,
        },
      ]}
    >
      {/* ---------- Loading ---------- */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- Filters ---------- */}
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

          {/* ---------- Error ---------- */}
          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Empty State ---------- */}
          {filteredEvidence.length === 0 && (
            <p className="text-text-muted">
              No evidence matches this filter.
            </p>
          )}

          {/* ---------- Evidence List ---------- */}
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
                {/* Evidence title */}
                <p className="text-sm sm:text-base font-medium text-text-primary">
                  {e.title}
                </p>

                {/* Optional description */}
                {e.description && (
                  <p className="mt-1 text-sm text-text-muted">
                    {e.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="mt-2 space-y-1 sm:space-y-2 text-sm text-text-secondary">
                  <p>
                    <strong>Uploaded by:</strong>{" "}
                    {e.uploadedBy?.name || "N/A"}
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
        </>
      )}
    </DashboardLayout>
  );
};

export default AdvocateCaseEvidence;
