import { getTourById, getTours } from '@/lib/mock-api';
import { notFound } from 'next/navigation';
import TourDetails from '@/components/tour-details';
import BookingForm from '@/components/booking-form';
import FeedbackForm from '@/components/feedback-form';

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((tour) => ({ id: tour.id }));
}

export default async function TourDetailsPage({ params }) {
  const tour = await getTourById(params.id);

  if (!tour) {
    notFound();
  }

  return (
    <div className="stack-large">
      <TourDetails tour={tour} />
      <div className="two-column-grid">
        <BookingForm tour={tour} />
        <FeedbackForm tour={tour} />
      </div>
    </div>
  );
}
