'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getMyBookings, getFeedbackForTour, getAllFeedback } from '@/lib/api';
import { getToken, useAuthUser } from '@/lib/auth';

const ADMIN_ROLES = ['ADMIN', 'TRAVEL_AGENT'];

export default function FeedbackPage() {
  const { user } = useAuthUser();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        if (user && ADMIN_ROLES.includes(user.role)) {
          // Admin / Travel Agent sees all feedback
          const allFeedback = await getAllFeedback(token);
          setFeedback(allFeedback || []);
        } else {
          // Customer sees feedback for their booked tours
          const bookings = await getMyBookings(token);
          const results = await Promise.all(
            bookings.map(async (booking) => {
              const items = await getFeedbackForTour(booking.tourId);
              return (items || []).map((item) => ({ ...item, tourName: booking.tourName }));
            })
          );
          setFeedback(results.flat());
        }
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFeedback();
    }
  }, [user?.id, user?.role]);

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="Feedback" subtitle="Review and update your travel feedback">
        <div className="content-card stack-medium">
          {loading ? (
            <p className="muted">Loading feedback…</p>
          ) : feedback.length === 0 ? (
            <p className="muted">No feedback submitted yet.</p>
          ) : (
            <div className="stack-small">
              {feedback.map((item) => (
                <article key={item.id} className="mini-card">
                  <div>
                    {item.tourName && <strong>{item.tourName}</strong>}
                    <p className="stars">{renderStars(item.rating)}</p>
                    {item.comment && <p className="muted">{item.comment}</p>}
                  </div>
                  <span className="badge badge-accent">Booking #{item.bookingId}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
