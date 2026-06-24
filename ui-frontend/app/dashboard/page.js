 'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getBookingsForUser } from '@/lib/mock-api';
import { getToken, useAuthUser } from '@/lib/auth';

export default function DashboardPage() {
  useAuthUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      setBookings(await getBookingsForUser(token));
    };

    load();
  }, [user?.id]);

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="Dashboard" subtitle="Your personalized travel control center">
        <div className="content-card stack-medium">
          <h2>My bookings</h2>
          <ul className="stack-small">
            {bookings.map((booking) => (
              <li key={booking.id} className="mini-card">
                <strong>{booking.tourName}</strong>
                <span>{booking.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
