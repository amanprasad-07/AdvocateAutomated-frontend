import { useNavigate } from "react-router-dom";

/**
 * BackButton Component
 *
 * Provides a reusable navigation control that
 * moves the user back to the previous route
 * in the browser history.
 */
const BackButton = () => {
  // React Router navigation hook
  const navigate = useNavigate();

  /**
   * Navigates one step back in the browser history
   */
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className="
        flex items-center justify-center
        rounded-full border border-border
        w-10 h-10
        text-text-secondary
        hover:bg-surfaceElevated
        hover:text-text-primary
        transition-colors
      "
    >
      {/* Left arrow icon representing backward navigation */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
};

export default BackButton;
