import TourCard from './tour-card';

export default function TourList({ tours = [] }) {
  return (
    <div className="tour-grid" aria-label="Tour listing">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
