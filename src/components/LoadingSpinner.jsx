/**
 * LoadingSpinner Component
 *
 * Displays a centered loading indicator with optional text.
 * Used to represent pending or asynchronous operations
 * such as data fetching or authentication checks.
 *
 * @param {string} text - Optional loading message displayed below the spinner
 */
const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinning circular loader */}
      <div
        className="
          mb-3 h-10 w-10
          animate-spin
          rounded-full
          border-4 border-border
          border-t-primary
        "
      />

      {/* Optional loading message */}
      <p className="text-sm text-text-muted">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
