import LoginForm from '@/components/login-form';

export default function LoginPage() {
  return (
    <section className="auth-layout">
      <div className="auth-copy card">
        <span className="eyebrow">Login</span>
        <h1>Return to your travel dashboard.</h1>
        <p className="muted">The UI adapts instantly to customer, admin, and travel agent roles.</p>
      </div>
      <LoginForm />
    </section>
  );
}
