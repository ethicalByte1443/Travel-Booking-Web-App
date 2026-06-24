import { getTours } from '@/lib/mock-api';
import Link from 'next/link';
import Image from 'next/image';
import TourList from '@/components/tour-list';

export default async function HomePage() {
  const featuredTours = (await getTours()).slice(0, 3);

  return (
    <div className="stack-large">
      <section className="hero card hero-surface">
        <div className="hero-copy">
          <span className="eyebrow">Travel Booking Web App</span>
          <h1>Design-forward travel planning that feels premium from the first click.</h1>
          <p className="muted">
            A standout frontend with JWT-aware flows, role-based dashboards, and a theme system that works everywhere.
          </p>
          <div className="button-row">
            <Link href="/tours" className="button primary">Explore tours</Link>
            <Link href="/register" className="button ghost">Create account</Link>
          </div>
          <ul className="hero-stats" aria-label="Highlights">
            <li><strong>3</strong><span>roles supported</span></li>
            <li><strong>100%</strong><span>theme coverage</span></li>
            <li><strong>RTL</strong><span>tested components</span></li>
          </ul>
        </div>
        <div className="hero-visual">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            alt="Ocean travel scene"
            width={720}
            height={540}
            priority
            className="hero-image"
          />
        </div>
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">Featured tours</span>
          <h2>Curated picks with strong visual hierarchy.</h2>
        </div>
        <Link href="/tours" className="link-arrow">View all tours →</Link>
      </section>

      <TourList tours={featuredTours} />
    </div>
  );
}
