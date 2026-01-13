import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdvocateAddEvidence = () => {
  // Extract case identifier from route params
  const { caseId } = useParams();

  // Navigation helper
  const navigate = useNavigate();

  // Local state for file input
  const [file, setFile] = useState(null);

  // Optional textual description for the evidence
  const [description, setDescription] = useState("");

  // UI state flags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles evidence submission
   *
   * - Validates file selection
   * - Constructs multipart form payload
   * - Uploads evidence to backend
   * - Redirects back to case evidence view on success
   */
  const handleSubmit = async () => {
    // Client-side validation for mandatory file input
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Prepare multipart form payload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", caseId);

      // Append description only if provided
      if (description) {
        formData.append("description", description);
      }

      // Submit evidence to backend
      await api.post("/evidence", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Redirect back to evidence listing for the case
      navigate(`/advocate/my-cases/${caseId}/evidence`);
    } catch (err) {
      // Log error for debugging and show user-facing message
      console.error(err);
      setError("Failed to upload evidence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Add Evidence"
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
      {/* ---------- Loading State ---------- */}
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="mx-auto sm:mx-0 max-w-md space-y-5">
          {/* ---------- File Upload ---------- */}
          <div>
            <label className="mb-1 block font-medium text-text-primary">
              Upload File <span className="text-error">*</span>
            </label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="application/pdf,image/*,audio/*,video/*"
              className="
                w-full rounded-lg
                border border-border
                bg-bg
                px-3 py-2
                text-text-primary
                focus:outline-none
                focus:ring-2 focus:ring-primary/30
              "
            />

            <p className="mt-1 text-xs text-text-muted">
              Supported: documents, images, audio, video
            </p>
          </div>

          {/* ---------- Description ---------- */}
          <div>
            <label className="mb-1 block font-medium text-text-primary">
              Description (optional)
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Brief context for this evidence"
              className="
                w-full rounded-lg
                border border-border
                bg-bg
                px-3 py-2
                text-text-primary
                placeholder:text-text-muted
                focus:outline-none
                focus:ring-2 focus:ring-primary/30
              "
            />
          </div>

          {/* ---------- Error ---------- */}
          {error && (
            <p className="text-sm text-error">
              {error}
            </p>
          )}

          {/* ---------- Actions ---------- */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                rounded-lg
                bg-primary
                px-4 py-2
                text-sm font-medium text-text-primary
                hover:bg-primary-hover
                disabled:opacity-50
                transition-colors
              "
            >
              Upload Evidence
            </button>

            <button
              onClick={() => navigate(-1)}
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
              Cancel
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdvocateAddEvidence;
