export default function Loader({ label = 'Loading' }) {
  return (
    <div className="loader" aria-live="polite" aria-busy="true">
      <div className="stack-small center-text">
        <div className="spinner" aria-hidden="true" />
        <p className="muted">{label}</p>
      </div>
    </div>
  );
}
