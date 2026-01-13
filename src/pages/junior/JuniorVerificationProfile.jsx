import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const JuniorVerificationProfile = () => {
  // Router navigation helper
  const navigate = useNavigate();

  // Auth context access for user state and refresh hook
  const { user, refreshUser } = useAuth();

  // Local form state for verification details
  const [formData, setFormData] = useState({
    enrollmentNumber: "",
    barCouncil: "",
    experienceYears: "",
    documents: [],
  });

  // UI state flags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- REDIRECT GUARD (FIXED LOGIC) ---------- */
  useEffect(() => {
    if (
      user?.verificationStatus === "approved" ||
      (user?.verificationStatus === "pending" &&
        user?.advocateProfile?.submittedAt)
    ) {
      navigate("/junior_advocate", { replace: true });
    }
  }, [user, navigate]);

  /* ---------- PURE RENDER GUARD ---------- */
  if (
    user?.verificationStatus === "approved" ||
    (user?.verificationStatus === "pending" &&
      user?.advocateProfile?.submittedAt)
  ) {
    return null;
  }

  /**
   * Generic input change handler
   *
   * Updates form state dynamically based on input name.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Form submission handler
   *
   * - Performs basic client-side validation
   * - Submits verification details to backend
   * - Refreshes authenticated user data on success
   * - Redirects back to junior advocate dashboard
   */
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
        documents: formData.documents,
      });

      // Refresh logged-in user state to reflect submission status
      await refreshUser();

      navigate("/junior_advocate", { replace: true });
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
      title="Junior Advocate Verification"
      navItems={[{ label: "Dashboard", path: "/junior_advocate" }]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="max-w-xl rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-1 text-lg font-semibold text-text-primary">
            Submit Verification Details
          </h2>

          <p className="mb-4 text-sm text-text-muted">
            Provide your professional details to complete junior advocate verification.
          </p>

          {error && (
            <p className="mb-3 text-sm text-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary">
                Enrollment Number *
              </label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary">
                Bar Council *
              </label>
              <input
                type="text"
                name="barCouncil"
                value={formData.barCouncil}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

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
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-text-primary hover:bg-primary-hover transition-colors"
              >
                Submit for Verification
              </button>

              <button
                type="button"
                onClick={() => navigate("/junior_advocate")}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surfaceElevated transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JuniorVerificationProfile;
