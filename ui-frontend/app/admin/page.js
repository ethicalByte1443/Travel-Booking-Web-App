 'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getAllBookings, getAllFeedback, getTours } from '@/lib/mock-api';
import { getToken } from '@/lib/auth';

export default function AdminPage() {
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const loadAdminData = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      const [tourData, bookingData, feedbackData] = await Promise.all([
        getTours(),
        getAllBookings(token),
        getAllFeedback(token)
      ]);

      setTours(tourData);
      setBookings(bookingData);
      setFeedback(feedbackData);
    };

    loadAdminData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="Admin Dashboard" subtitle="Manage tours, bookings, and feedback">
        <div className="two-column-grid">
          <section className="content-card stack-medium">
            <h2>Tour inventory</h2>
            <ul className="stack-small">
              {tours.map((tour) => (
                <li key={tour.id} className="mini-card">
                  <strong>{tour.name}</strong>
                  <span>{tour.location}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="content-card stack-medium">
            <h2>Quick actions</h2>
            <p className="muted">Add, edit, and review bookings and feedback from a polished admin surface.</p>
            <div className="mini-card">
              <strong>{bookings.length}</strong>
              <span>Total bookings</span>
            </div>
            <div className="mini-card">
              <strong>{feedback.length}</strong>
              <span>Total feedback entries</span>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
