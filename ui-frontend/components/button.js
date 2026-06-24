export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`button ${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
