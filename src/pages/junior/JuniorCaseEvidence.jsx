import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

/* ---------- Evidence Type Styles (Semantic) ---------- */
const TYPE_STYLES = {
  document: "border-l-primary",
  image: "border-l-success",
  audio: "border-l-warning",
  video: "border-l-warning",
  other: "border-l-border",
};

const JuniorCaseEvidence = () => {
  const { caseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const typeParam = searchParams.get("type");

  const filteredEvidence = typeParam
    ? evidence.filter((e) => e.fileType === typeParam)
    : evidence;

  const setFilter = (type) => {
    if (!type) {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <DashboardLayout title="Case Evidence">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  /* ---------- Error ---------- */
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
        { label: "Home", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
        {
          label: "Back to Case",
          path: `/junior_advocate/cases/${caseId}`,
        },
      ]}
    >
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
              ${typeParam === key || (!key && !typeParam)
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
            <p className="font-medium text-text-primary">
              {e.title}
            </p>

            {e.description && (
              <p className="mt-1 text-sm text-text-muted">
                {e.description}
              </p>
            )}

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
