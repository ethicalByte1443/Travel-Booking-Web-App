 'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getBookingsForUser } from '@/lib/mock-api';
import { getToken } from '@/lib/auth';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      setBookings(await getBookingsForUser(token));
    };

    loadBookings();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="My Bookings" subtitle="Track upcoming travel and feedback status">
        <div className="content-card stack-medium">
          {bookings.map((booking) => (
            <article key={booking.id} className="mini-card">
              <div>
                <strong>{booking.tourName}</strong>
                <p className="muted">{booking.status}</p>
              </div>
              <span>{booking.travelDate}</span>
            </article>
          ))}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
