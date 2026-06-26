'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
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

    loadBookings();
  }, []);

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
      <DashboardLayout title="My Bookings" subtitle="Track upcoming travel and manage reservations">
        <div className="content-card stack-medium">
          {loading ? (
            <p className="muted">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="muted">No bookings found.</p>
          ) : (
            <div className="stack-small">
              {bookings.map((booking) => (
                <article key={booking.id} className="mini-card">
                  <div>
                    <strong>{booking.tourName}</strong>
                    {booking.tourLocation && (
                      <span className="muted"> · {booking.tourLocation}</span>
                    )}
                    <p className="muted">
                      {booking.travelDate || 'No date set'} · {booking.guests} guest(s)
                    </p>
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
