import RegisterForm from '@/components/register-form';

export default function RegisterPage() {
  return (
    <section className="auth-layout">
      <div className="auth-copy card">
        <span className="eyebrow">Register</span>
        <h1>Create a secure account in seconds.</h1>
        <p className="muted">Validation, accessible labels, and role selection are built into the flow.</p>
      </div>
      <RegisterForm />
    </section>
  );
}
