import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const JuniorAddEvidence = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", caseId);
      if (description) formData.append("description", description);

      await api.post("/evidence", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/junior_advocate/cases/${caseId}/evidence`);
    } catch (err) {
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
        {error && (
          <p className="text-sm text-error">
            {error}
          </p>
        )}

        {/* ---------- Actions ---------- */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
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
            {loading ? "Uploading..." : "Upload Evidence"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              rounded-lg
              border border-border
              px-4 py-2
              text-sm text-text-secondary
              hover:bg-surface-elevated
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
