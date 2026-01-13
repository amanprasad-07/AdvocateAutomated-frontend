import { useEffect, useState } from "react";
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
    documents: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- REDIRECT GUARD (FIXED LOGIC) ---------- */
  useEffect(() => {
    if (
      user?.verificationStatus === "approved" ||
      (user?.verificationStatus === "pending" &&
        user?.advocateProfile?.submittedAt)
    ) {
      navigate("/advocate", { replace: true });
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

  /* ---------- INPUT HANDLER ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------- SUBMIT HANDLER ---------- */
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

      navigate("/advocate", { replace: true });
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
      navItems={[{ label: "Dashboard", path: "/advocate" }]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="max-w-xl rounded-xl border border-border bg-surface p-6">
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

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-primary hover:opacity-90"
              >
                Submit for Verification
              </button>

              <button
                type="button"
                onClick={() => navigate("/advocate")}
                className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surfaceElevated"
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

export default VerificationProfile;
