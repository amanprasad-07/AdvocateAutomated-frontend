const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className="
          mb-3 h-10 w-10
          animate-spin
          rounded-full
          border-4 border-border
          border-t-primary
        "
      />
      <p className="text-sm text-text-muted">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
