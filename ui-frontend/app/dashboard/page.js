'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '@/lib/api';
import { getToken, useAuthUser } from '@/lib/auth';

export default function DashboardPage() {
  const { user } = useAuthUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setBookings(await getMyBookings(token));
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      load();
    }
  }, [user?.id]);

  const handleCancel = async (bookingId) => {
    const token = getToken();
    if (!token) return;

    try {
      await cancelBooking(token, bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch {
      // Silently fail
    }
  };

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="Dashboard" subtitle="Your personalized travel control center">
        <div className="content-card stack-medium">
          <h2>My bookings</h2>
          {loading ? (
            <p className="muted">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="muted">No bookings yet. Browse tours to book your first trip.</p>
          ) : (
            <div className="stack-small">
              {bookings.map((booking) => (
                <article key={booking.id} className="mini-card">
                  <div>
                    <strong>{booking.tourName}</strong>
                    {booking.travelDate && (
                      <p className="muted">{booking.travelDate} · {booking.guests} guest(s)</p>
                    )}
                  </div>
                  <div className="button-row">
                    <span className={`badge badge-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        className="button ghost"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
