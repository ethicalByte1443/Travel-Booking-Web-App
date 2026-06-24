import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="content-card stack-medium center-text">
      <span className="eyebrow">404</span>
      <h1>That destination could not be found.</h1>
      <p className="muted">Try another tour or return to the home page.</p>
      <Link href="/" className="button primary">Back home</Link>
    </section>
  );
}
