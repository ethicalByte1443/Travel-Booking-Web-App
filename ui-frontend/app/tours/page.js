import { getTours } from '@/lib/mock-api';
import TourList from '@/components/tour-list';

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <section className="stack-large">
      <header className="section-heading">
        <div>
          <span className="eyebrow">Tours</span>
          <h1>Browse destinations with rich cards and quick actions.</h1>
        </div>
      </header>
      <TourList tours={tours} />
    </section>
  );
}
