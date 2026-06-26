export default function AboutPage() {
  return (
    <section className="stack-large">
      <div className="content-card stack-medium">
        <span className="eyebrow">About</span>
        <h1>Built like a portfolio piece, not a template.</h1>
        <p>
          This is a full-stack travel booking application featuring a <strong>Spring Boot</strong> backend
          with JWT authentication, role-based access control, and a <strong>Next.js</strong> frontend
          with the App Router, server components, and a polished design system.
        </p>
      </div>

      <div className="two-column-grid">
        <div className="content-card stack-medium">
          <h2>Frontend Tech Stack</h2>
          <ul className="feature-list">
            <li>Next.js 14 with App Router</li>
            <li>React 18 with Server Components</li>
            <li>JWT token management in localStorage</li>
            <li>Role-based UI (Customer, Admin, Travel Agent)</li>
            <li>Light &amp; dark theme with CSS custom properties</li>
            <li>Accessible forms with validation</li>
            <li>Responsive glassmorphism design</li>
            <li>Jest &amp; React Testing Library</li>
          </ul>
        </div>
        <div className="content-card stack-medium">
          <h2>Backend Tech Stack</h2>
          <ul className="feature-list">
            <li>Java 21 with Spring Boot 3.2</li>
            <li>Spring Security with JWT filter chain</li>
            <li>Spring Data JPA with PostgreSQL</li>
            <li>Bean Validation &amp; Global Exception Handling</li>
            <li>Swagger / OpenAPI documentation</li>
            <li>BCrypt password encryption</li>
            <li>CORS configured for frontend integration</li>
            <li>Sample data seeder for development</li>
          </ul>
        </div>
      </div>

      <div className="content-card stack-medium">
        <h2>Application Architecture</h2>
        <div className="two-column-grid">
          <div className="stack-small">
            <h3>API Endpoints</h3>
            <ul className="feature-list">
              <li><code>POST /api/auth/register</code> — Create account</li>
              <li><code>POST /api/auth/login</code> — Get JWT token</li>
              <li><code>GET /api/tours</code> — Browse all tours</li>
              <li><code>POST /api/bookings</code> — Book a tour</li>
              <li><code>POST /api/bookings/:id/feedback</code> — Submit review</li>
            </ul>
          </div>
          <div className="stack-small">
            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>Protected dashboard routes</li>
              <li>Admin tour management (CRUD)</li>
              <li>Booking lifecycle (Create → Confirm → Start → Complete)</li>
              <li>Feedback with conditional validation</li>
              <li>Cross-tab authentication sync</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="content-card stack-medium">
        <h2>Interview Talking Points</h2>
        <p className="muted">
          This project demonstrates real-world patterns frequently asked about in technical interviews:
        </p>
        <ul className="feature-list">
          <li><strong>Auth flow:</strong> JWT generation, storage, and automatic injection via fetch wrapper</li>
          <li><strong>Role-based rendering:</strong> Navbar, dashboard sidebar, and protected routes adapt per role</li>
          <li><strong>State management:</strong> useAuthUser hook with cross-tab sync via storage events</li>
          <li><strong>Server/Client components:</strong> Server components for data fetching, client for interactivity</li>
          <li><strong>Backend architecture:</strong> Clean layered structure with DTOs preventing entity exposure</li>
          <li><strong>Security:</strong> CORS, CSRF disabled for SPA, SecurityFilterChain with method-level auth</li>
        </ul>
      </div>
    </section>
  );
}
