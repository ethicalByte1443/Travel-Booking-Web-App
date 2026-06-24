 'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getBookingsForUser, getFeedbackForTour } from '@/lib/mock-api';
import { getToken } from '@/lib/auth';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const loadFeedback = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      const bookings = await getBookingsForUser(token);
      const results = await Promise.all(
        bookings.map(async (booking) => {
          const items = await getFeedbackForTour(booking.tourId);
          return items.map((item) => ({ ...item, tourName: booking.tourName }));
        })
      );

      setFeedback(results.flat());
    };

    loadFeedback();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="Feedback" subtitle="Review and update your travel feedback">
        <div className="content-card stack-medium">
          {feedback.map((item) => (
            <article key={item.id} className="mini-card">
              <strong>{item.tourName}</strong>
              <p>{item.comment}</p>
            </article>
          ))}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
