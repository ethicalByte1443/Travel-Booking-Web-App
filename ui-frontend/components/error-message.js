export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-card">
      <section className="content-card stack-medium center-text">
        <span className="eyebrow">Something went wrong</span>
        <h1>We hit an unexpected issue.</h1>
        <p className="muted">{error?.message || 'Try again or go back to the previous screen.'}</p>
        {onRetry ? (
          <button type="button" className="button primary" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </section>
    </div>
  );
}
