import { getTourById } from '@/lib/api';
import { notFound } from 'next/navigation';
import TourDetails from '@/components/tour-details';
import BookingForm from '@/components/booking-form';
import FeedbackForm from '@/components/feedback-form';

export const dynamic = 'force-dynamic';

export default async function TourDetailsPage({ params }) {
  let tour = null;

  try {
    tour = await getTourById(params.id);
  } catch {
    // Backend unavailable or tour not found
  }

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
