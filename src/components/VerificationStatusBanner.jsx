import { useAuth } from "../auth/AuthContext";

/**
 * VerificationStatusBanner Component
 *
 * Displays the current verification status of the authenticated user.
 * Intended for advocates and junior advocates only.
 * Clients and unauthenticated users do not see this banner.
 */
const VerificationStatusBanner = () => {
  // Access authenticated user from auth context
  const { user } = useAuth();

  // Do not render if no authenticated user is present
  if (!user) return null;

  // Clients or roles that do not require verification never see this banner
  if (user.verificationStatus === "not_required") return null;

  // Default styling and message for pending verification
  let styles =
    "bg-surfaceElevated text-warning border border-warning";
  let message = "Your account verification is pending.";

  // Update styling and message for approved users
  if (user.verificationStatus === "approved") {
    styles =
      "bg-surfaceElevated text-success border border-success";
    message = "Verified user.";
  }

  // Update styling and message for rejected users
  if (user.verificationStatus === "rejected") {
    styles =
      "bg-surfaceElevated text-error border border-error";
    message =
      "Your verification was rejected. Please contact support or re-register.";
  }

  return (
    <div
      className={`
        mb-3 w-fit
        rounded-lg px-4 py-2
        text-sm font-medium
        ${styles}
      `}
    >
      <strong>Status:</strong> {message}
    </div>
  );
};

export default VerificationStatusBanner;
