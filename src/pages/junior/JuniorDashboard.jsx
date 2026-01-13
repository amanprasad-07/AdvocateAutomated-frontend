import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import VerificationStatusBanner from "../../components/VerificationStatusBanner";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const JuniorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/cases");
        setCases(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const isVerified = user?.verificationStatus === "approved";

  /* ---------- Derived Data ---------- */
  const openCases = cases.filter(
    (c) => c.status === "open" || c.status === "in_progress"
  );

  const inProgressCases = cases.filter(
    (c) => c.status === "in_progress"
  );

  const closedCases = cases.filter(
    (c) => c.status === "closed"
  );

  const recentCase = [...cases].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  )[0];

  return (
    <DashboardLayout
      title="Junior Advocate Dashboard"
      navItems={[
        { label: "Dashboard", path: "/junior_advocate" },
        { label: "My Cases", path: "/junior_advocate/cases" },
      ]}
    >
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
          {/* ---------- User Info ---------- */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-4">
            <p className="text-lg font-semibold text-text-primary">
              Welcome, {user?.name}
            </p>

            <p className="pb-3 text-sm text-text-secondary">
              {user?.email}
            </p>

            <VerificationStatusBanner />

            {user?.verificationStatus === "rejected" && (
              <div className="mt-3 rounded-lg border border-error bg-error/10 p-3">
                <p className="text-sm font-medium text-error">
                  Verification Rejected
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  Reason: {user.verificationRejectionReason}
                </p>

                <button
                  onClick={() => navigate("/junior_advocate/verification/profile")}
                  className="
                  mt-2 rounded-lg bg-primary px-3 py-1
                  text-sm font-medium text-text-primary
                  hover:opacity-90
                "
                >
                  Update Details & Resubmit
                </button>
              </div>
            )}


            {user?.verificationStatus === "pending" &&
              (!user?.advocateProfile || !user?.advocateProfile?.submittedAt) && (
                <button
                  onClick={() => navigate("/junior_advocate/verification/profile")}
                  className="
                      mt-2
                      rounded-lg
                      bg-primary
                      px-4 py-2
                      text-sm font-medium
                      text-text-primary
                      hover:opacity-90
                    "
                >
                  Submit Verification Details
                </button>
              )}

            {user?.verificationStatus === "pending" &&
              user?.advocateProfile?.submittedAt && (
                <p className="mt-2 text-sm text-text-muted italic">
                  Verification details submitted. Awaiting admin review.
                </p>
              )}
          </div>

          {/* ---------- Metrics ---------- */}

          <div
            className={`
    ${!isVerified ? "opacity-40 pointer-events-none" : ""}
  `}
          >
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                {
                  label: "Assigned Cases",
                  value: cases.length,
                  action: () =>
                    navigate("/junior_advocate/cases"),
                },
                {
                  label: "Open / In Progress",
                  value: openCases.length,
                  action: () =>
                    navigate(
                      "/junior_advocate/cases?status=open,in_progress"
                    ),
                },
                {
                  label: "In Progress",
                  value: inProgressCases.length,
                  action: () =>
                    navigate(
                      "/junior_advocate/cases?status=in_progress"
                    ),
                },
                {
                  label: "Closed Cases",
                  value: closedCases.length,
                  action: () =>
                    navigate(
                      "/junior_advocate/cases?status=closed"
                    ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={item.action}
                  className="
                  cursor-pointer rounded-xl border border-border
                  bg-surface p-4 transition
                  hover:bg-surfaceElevated
                "
                >
                  <p className="text-sm text-text-secondary">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ---------- Focus Section ---------- */}
            <div className="mb-6 rounded-xl border border-border bg-surface p-4">
              <p className="mb-1 font-medium text-text-primary">
                Case Requiring Attention
              </p>

              {recentCase ? (
                <p className="text-sm text-text-secondary">
                  {recentCase.caseNumber} • {recentCase.title}
                </p>
              ) : (
                <p className="text-sm text-muted">
                  No active cases assigned.
                </p>
              )}
            </div>

            {/* ---------- Quick Actions ---------- */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  navigate("/junior_advocate/cases")
                }
                className="
                rounded-lg bg-primary px-4 py-2
                text-sm font-medium text-text-primary
                transition-opacity hover:opacity-90
              "
              >
                View My Cases
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default JuniorDashboard;
