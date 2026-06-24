import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export default function TourDetails({ tour }) {
  return (
    <article className="content-card stack-medium">
      <div className="hero-visual">
        <Image src={tour.image} alt={tour.name} width={1280} height={720} className="hero-image" />
      </div>
      <div className="stack-small">
        <span className="eyebrow">Tour details</span>
        <h1>{tour.name}</h1>
        <p className="muted">{tour.description}</p>
      </div>
      <div className="pill-row">
        <span className="pill">{tour.location}</span>
        <span className="pill">{tour.duration}</span>
        <span className="pill">★ {tour.rating}</span>
        <span className="pill">{formatCurrency(tour.price)}</span>
      </div>
      <div className="content-card">
        <h2>Why travelers choose this trip</h2>
        <p>
          Curated pacing, premium visuals, and a clear path to book, review, and manage the journey from one interface.
        </p>
      </div>
    </article>
  );
}
