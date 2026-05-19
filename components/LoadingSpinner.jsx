export default function LoadingSpinner() {
  return (
    <span className="spinner" role="status" aria-live="polite" aria-label="Loading">
      <span className="spinner-dot" />
      <span className="spinner-dot" />
      <span className="spinner-dot" />
    </span>
  );
}
