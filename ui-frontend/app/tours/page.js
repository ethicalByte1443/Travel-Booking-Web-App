import { getTours } from '@/lib/api';
import TourList from '@/components/tour-list';

export const dynamic = 'force-dynamic';

export default async function ToursPage() {
  let tours = [];

  try {
    tours = await getTours();
  } catch {
    // Backend may be unavailable
  }

  return (
    <section className="stack-large">
      <header className="section-heading">
        <div>
          <span className="eyebrow">Tours</span>
          <h1>Browse destinations with rich cards and quick actions.</h1>
        </div>
      </header>
      {tours.length > 0 ? (
        <TourList tours={tours} />
      ) : (
        <p className="muted center-text">No tours available. Start the backend server to load tour data.</p>
      )}
    </section>
  );
}
