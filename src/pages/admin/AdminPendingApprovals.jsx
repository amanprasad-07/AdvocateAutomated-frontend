import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminPendingApprovals = () => {
  // Holds advocates / junior advocates awaiting verification approval
  const [pendingUsers, setPendingUsers] = useState([]);

  // Controls loading state during API calls
  const [loading, setLoading] = useState(true);

  // Stores any fetch-level error message
  const [error, setError] = useState("");

  /* ---------- Data Fetch ---------- */
  // Retrieves all advocates and junior advocates pending verification
  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/admin/pending-advocates");
      setPendingUsers(res.data.data || []);
    } catch {
      setError("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  /* ---------- Approval Action ---------- */
  // Approves an advocate or junior advocate after verification review
  const approveUser = async (userId) => {
    try {
      await api.patch(`/admin/pending-advocates/${userId}/approve`);
      // Refresh list to reflect updated approval state
      fetchPendingUsers();
    } catch {
      alert("Failed to approve user");
    }
  };

  /* ---------- Rejection Action ---------- */
  // Rejects an advocate or junior advocate with an explicit rejection reason
  const rejectUser = async (userId) => {
    // Admin must provide a rejection reason (shown to the advocate)
    const reason = window.prompt(
      "Enter rejection reason (this will be visible to the advocate):"
    );

    if (!reason) return;

    try {
      await api.patch(
        `/admin/pending-advocates/${userId}/reject`,
        { reason }
      );
      // Refresh list after rejection
      fetchPendingUsers();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Failed to reject user"
      );
    }
  };

  return (
    <DashboardLayout
      title="Pending Approvals"
      navItems={[
        { label: "Dashboard", path: "/admin" },
        { label: "Pending Approvals", path: "/admin/pending-approvals" },
        { label: "Verified Advocates", path: "/admin/verified" },
        { label: "All Users", path: "/admin/users" },
        { label: "Cases (Read Only)", path: "/admin/cases" },
        { label: "Payments", path: "/admin/payments" },
        { label: "Evidence", path: "/admin/evidence" },
        { label: "Audit Logs", path: "/admin/audit-logs" },
      ]}
    >
      {/* ---------- Loading State ---------- */}
      {loading && <LoadingSpinner />}

      {/* ---------- Error State ---------- */}
      {error && (
        <p className="text-sm text-error">
          {error}
        </p>
      )}

      {/* ---------- Empty State ---------- */}
      {!loading && pendingUsers.length === 0 && (
        <p className="text-sm text-muted">
          No pending advocate or junior advocate approvals.
        </p>
      )}

      {/* ---------- Pending Approvals List ---------- */}
      {!loading && pendingUsers.length > 0 && (
        <div className="space-y-3">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="
                flex flex-col gap-4
                rounded-xl border border-border
                bg-surface p-4
              "
            >
              {/* ---------- User Identity ---------- */}
              <div className="space-y-1">
                <p className="font-medium text-text-primary">
                  {user.name}
                </p>

                <p className="text-sm text-text-secondary">
                  {user.email}
                </p>

                <p className="text-sm capitalize text-text-secondary">
                  Role: {user.role.replace("_", " ")}
                </p>

                <p className="text-xs text-muted">
                  Registered on{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <hr className="border-border" />

              {/* ---------- Verification Details ---------- */}
              {/* Displayed only if the advocate has submitted verification info */}
              {user.advocateProfile ? (
                <div className="rounded-lg bg-surfaceElevated p-3 text-sm">
                  <p className="mb-2 font-semibold text-text-primary">
                    Verification Details
                  </p>

                  <p>
                    <span className="font-medium">Enrollment Number:</span>{" "}
                    {user.advocateProfile.enrollmentNumber}
                  </p>

                  <p>
                    <span className="font-medium">Bar Council:</span>{" "}
                    {user.advocateProfile.barCouncil}
                  </p>

                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {user.advocateProfile.experienceYears || "N/A"} years
                  </p>

                  <p className="text-xs text-text-muted mt-1">
                    Submitted on{" "}
                    {new Date(
                      user.advocateProfile.submittedAt
                    ).toLocaleDateString()}
                  </p>

                  {/* ---------- Supporting Documents ---------- */}
                  {user.advocateProfile.documents?.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-xs text-primary">
                      {user.advocateProfile.documents.map((doc, index) => (
                        <li key={index}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            View document {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="text-sm italic text-text-muted">
                  No verification details submitted.
                </p>
              )}

              {/* ---------- Admin Actions ---------- */}
              <div className="flex gap-2">
                {/* Approve action is disabled until verification is submitted */}
                <button
                  disabled={!user.advocateProfile?.submittedAt}
                  onClick={() => approveUser(user._id)}
                  className={`
                    rounded-lg px-3 py-1 text-sm font-medium
                    ${
                      user.advocateProfile?.submittedAt
                        ? "bg-primary text-text-primary hover:opacity-90"
                        : "bg-border text-text-muted cursor-not-allowed"
                    }
                  `}
                  title={
                    user.advocateProfile?.submittedAt
                      ? "Approve advocate"
                      : "Cannot approve without verification details"
                  }
                >
                  Approve
                </button>

                {/* Reject action always available, requires reason */}
                <button
                  onClick={() => rejectUser(user._id)}
                  className="
                    rounded-lg border border-border px-3 py-1
                    text-sm text-text-secondary
                    hover:bg-surfaceElevated hover:text-text-primary
                    transition-colors
                  "
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminPendingApprovals;
