import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const VerificationProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    enrollmentNumber: "",
    barCouncil: "",
    experienceYears: "",
    documents: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Safety guard (UI-level)
  if (
    user?.verificationStatus === "approved" ||
    user?.advocateProfile?.submittedAt
  ) {
    navigate("/advocate");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.enrollmentNumber || !formData.barCouncil) {
      setError("Enrollment number and bar council are required");
      return;
    }

    try {
      setLoading(true);

      await api.patch("/verification/profile", {
        enrollmentNumber: formData.enrollmentNumber,
        barCouncil: formData.barCouncil,
        experienceYears: Number(formData.experienceYears),
        documents: formData.documents
      });

      navigate("/advocate");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to submit verification details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Advocate Verification"
      navItems={[
        { label: "Dashboard", path: "/advocate" }
      ]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="max-w-xl rounded-xl border border-border bg-surface p-6">
          {/* Card Heading */}
          <h2 className="mb-1 text-lg font-semibold text-text-primary">
            Submit Verification Details
          </h2>

          <p className="mb-4 text-sm text-text-muted">
            Provide your professional details to complete advocate verification.
          </p>

          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Enrollment Number */}
            <div>
              <label className="block text-sm text-text-secondary">
                Enrollment Number *
              </label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Bar Council */}
            <div>
              <label className="block text-sm text-text-secondary">
                Bar Council *
              </label>
              <input
                type="text"
                name="barCouncil"
                value={formData.barCouncil}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm text-text-secondary">
                Years of Experience
              </label>
              <input
                type="number"
                name="experienceYears"
                min="0"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

           

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="
          rounded-lg
          bg-primary
          px-4 py-2
          text-sm font-medium
          text-text-primary
          hover:opacity-90
        "
              >
                Submit for Verification
              </button>

              <button
                type="button"
                onClick={() => navigate("/advocate")}
                className="
          rounded-lg
          border border-border
          px-4 py-2
          text-sm
          text-text-secondary
          hover:bg-surfaceElevated
        "
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info Section (non-blocking) */}
          <div className="mt-6 rounded-lg bg-surfaceElevated p-3 text-xs text-text-muted">
            <p>
              Once submitted, your details will be reviewed by an administrator.
              You will be notified once verification is approved or rejected.
            </p>
          </div>
        </div>

      )}
    </DashboardLayout>
  );
};

export default VerificationProfile;
