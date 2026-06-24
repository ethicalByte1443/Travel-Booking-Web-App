import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export default function TourCard({ tour }) {
  return (
    <article className="tour-card">
      <Image src={tour.image} alt={tour.name} width={960} height={540} className="tour-image" />
      <div className="tour-card-body stack-medium">
        <div className="tour-meta">
          <span className="pill">{tour.location}</span>
          <span className="pill">{tour.duration}</span>
          <span className="pill">★ {tour.rating}</span>
        </div>
        <div>
          <h3>{tour.name}</h3>
          <p className="muted">{tour.description}</p>
        </div>
        <div className="mini-card">
          <strong>{formatCurrency(tour.price)}</strong>
          <Link href={`/tours/${tour.id}`} className="link-arrow">View details</Link>
        </div>
      </div>
    </article>
  );
}
