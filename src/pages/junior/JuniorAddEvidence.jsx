import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const JuniorAddEvidence = () => {
  // Extract case ID from route parameters
  const { caseId } = useParams();

  // Navigation helper for redirects
  const navigate = useNavigate();

  // Holds the selected file object
  const [file, setFile] = useState(null);

  // Optional textual description for the uploaded evidence
  const [description, setDescription] = useState("");

  // Indicates whether the upload request is in progress
  const [loading, setLoading] = useState(false);

  // Stores validation or upload-related error messages
  const [error, setError] = useState("");

  /**
   * Handles evidence submission.
   * Validates file presence, constructs multipart form data,
   * uploads evidence to the backend, and redirects on success.
   */
  const handleSubmit = async () => {
    // Client-side validation: file is mandatory
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Prepare multipart form data payload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", caseId);

      // Attach description only if provided
      if (description) formData.append("description", description);

      // Upload evidence to backend API
      await api.post("/evidence", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Redirect to case evidence listing after successful upload
      navigate(`/junior_advocate/cases/${caseId}/evidence`);
    } catch (err) {
      // Log error for debugging and show user-friendly message
      console.error(err);
      setError("Failed to upload evidence");
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Add Evidence"
      navItems={[
        { label: "Dashboard", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
        {
          label: "Back to Case",
          path: `/junior_advocate/cases/${caseId}`,
        },
      ]}
    >
      <div className="max-w-md space-y-5">
        {/* ---------- File Upload ---------- */}
        {/* Required file input for evidence upload */}
        <div>
          <label className="mb-1 block font-medium text-text-primary">
            Upload File <span className="text-error">*</span>
          </label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,image/*"
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
        </div>

        {/* ---------- Description ---------- */}
        {/* Optional description to provide context for the evidence */}
        <div>
          <label className="mb-1 block font-medium text-text-primary">
            Description (optional)
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
        {/* Displays validation or upload errors */}
        {error && (
          <p className="text-sm text-error">
            {error}
          </p>
        )}

        {/* ---------- Actions ---------- */}
        {/* Submit and cancel actions */}
        <div className="flex flex-wrap gap-3">
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
            {loading ? "Uploading..." : "Upload Evidence"}
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
    </DashboardLayout>
  );
};

export default JuniorAddEvidence;
