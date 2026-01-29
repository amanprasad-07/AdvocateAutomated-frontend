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
    specialization: [],
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
    if (formData.specialization.length === 0) {
  setError("Please select at least one area of specialization");
  return;
}


    try {
      setLoading(true);

      await api.patch("/verification/profile", {
        enrollmentNumber: formData.enrollmentNumber,
        barCouncil: formData.barCouncil,
        experienceYears: Number(formData.experienceYears),
        specialization: formData.specialization,
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

          <form onSubmit={handleSubmit} className=" max-w-md
            rounded-xl
            bg-surface
            p-6
            shadow-sm">
            <div>
              <label className="block text-sm text-text-secondary">
                Enrollment Number *
              </label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                className="mb-3 w-full rounded-lg
              border border-border
              bg-bg
              px-3 py-2
              text-text-primary
              placeholder:text-text-muted
              focus:outline-none
              focus:ring-2 focus:ring-primary/30"
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
                className="mb-3 w-full rounded-lg
              border border-border
              bg-bg
              px-3 py-2
              text-text-primary
              placeholder:text-text-muted
              focus:outline-none
              focus:ring-2 focus:ring-primary/30"
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
                className="mb-3 w-full rounded-lg
              border border-border
              bg-bg
              px-3 py-2
              text-text-primary
              placeholder:text-text-muted
              focus:outline-none
              focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-text-secondary">
                Area(s) of Specialization *
              </label>

              <div className="grid grid-cols-2 gap-2 text-sm text-text-primary">
                {[
                  "Civil",
                  "Criminal",
                  "Family",
                  "Property",
                  "Corporate",
                  "Consumer Protection",
                  "Personal Injury",
                  "Labour",
                  "Intellectual Property",
                  "Tax",
                  "Other",
                ].map((spec) => (
                  <label key={spec} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={spec}
                      checked={formData.specialization.includes(spec)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          specialization: e.target.checked
                            ? [...prev.specialization, value]
                            : prev.specialization.filter((s) => s !== value),
                        }));
                      }}
                    />
                    {spec}
                  </label>
                ))}
              </div>
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
