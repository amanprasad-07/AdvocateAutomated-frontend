import { useAuth } from "../auth/AuthContext";

const VerificationStatusBanner = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Clients never see this
  if (user.verificationStatus === "not_required") return null;

  let styles =
    "bg-surface-elevated text-warning border border-warning";
  let message = "Your account verification is pending.";

  if (user.verificationStatus === "approved") {
    styles =
      "bg-surface-elevated text-success border border-success";
    message = "Verified user.";
  }

  if (user.verificationStatus === "rejected") {
    styles =
      "bg-surface-elevated text-error border border-error";
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
