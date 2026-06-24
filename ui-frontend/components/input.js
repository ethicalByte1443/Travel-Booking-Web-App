export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={`input ${className}`.trim()} {...props} />
      {error ? <p className="error-text" role="alert">{error}</p> : null}
    </div>
  );
}
