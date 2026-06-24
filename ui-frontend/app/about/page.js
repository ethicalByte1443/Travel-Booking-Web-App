export default function AboutPage() {
  return (
    <section className="content-card stack-medium">
      <span className="eyebrow">About</span>
      <h1>Built like a portfolio piece, not a template.</h1>
      <p>
        This frontend focuses on polished interaction patterns, accessible forms, reusable components, and a theme system
        that stays consistent across every page and component.
      </p>
      <p className="muted">
        It is intentionally structured for real-world React and Next.js interviews: good state boundaries, protected routes,
        mock API integration first, and room to plug in the backend later.
      </p>
    </section>
  );
}
