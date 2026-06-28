'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking, getAgentBookings, updateBookingStatus } from '@/lib/api';
import { getToken, useAuthUser } from '@/lib/auth';
import BookingStepper from '@/components/booking-stepper';

export default function DashboardPage() {
  const { user } = useAuthUser();
  const [personalBookings, setPersonalBookings] = useState([]);
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const personal = await getMyBookings(token);
        setPersonalBookings(personal);

        if (user?.role === 'TRAVEL_AGENT') {
          const assigned = await getAgentBookings(token);
          setAssignedBookings(assigned);
        }
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      load();
    }
  }, [user]);

  const handleCancelPersonal = async (bookingId) => {
    const token = getToken();
    if (!token) return;

    try {
      await cancelBooking(token, bookingId);
      setPersonalBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch {
      // Silently fail
    }
  };

  const handleUpdateAssignedStatus = async (bookingId, newStatus) => {
    const token = getToken();
    if (!token) return;

    let reason = null;
    if (newStatus === 'CANCELLED') {
      reason = prompt("Enter reason for cancellation:");
      if (reason === null) return;
      if (!reason.trim()) {
        alert("Cancellation reason is required.");
        return;
      }
    }

    try {
      await updateBookingStatus(token, bookingId, newStatus, reason);
      setAssignedBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, cancellationReason: reason } : b))
      );
    } catch {
      // API error
    }
  };

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="Dashboard" subtitle="Your personalized travel control center">
        <div className="stack-medium">
          
          {/* ASSIGNED BOOKINGS (For Agents to Manage) */}
          {user?.role === 'TRAVEL_AGENT' && (
            <div className="content-card stack-medium">
              <h2>Assigned Bookings (To Manage)</h2>
              {loading ? (
                <p className="muted">Loading assigned bookings…</p>
              ) : assignedBookings.length === 0 ? (
                <p className="muted">No bookings currently assigned to you.</p>
              ) : (
                <div className="stack-small">
                  {assignedBookings.map((booking) => (
                    <article key={booking.id} className="mini-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong>{booking.tourName}</strong>
                          <p className="muted">{booking.travelDate} · {booking.guests} guest(s)</p>
                          {booking.customerName && (
                            <p className="muted" style={{ marginTop: '4px' }}>
                              Customer: {booking.customerName} ({booking.customerEmail})
                            </p>
                          )}
                          {booking.status === 'CANCELLED' && booking.cancellationReason && (
                            <p className="error-text" style={{ marginTop: '4px', fontWeight: 'bold' }}>
                              Cancellation Reason: {booking.cancellationReason}
                            </p>
                          )}
                        </div>
                        <div className="button-row">
                          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                            <div className="button-row">
                              {booking.status === 'CREATED' && (
                                <button type="button" className="button ghost" onClick={() => handleUpdateAssignedStatus(booking.id, 'CONFIRMED')}>Confirm</button>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <button type="button" className="button ghost" onClick={() => handleUpdateAssignedStatus(booking.id, 'STARTED')}>Start</button>
                              )}
                              {booking.status === 'STARTED' && (
                                <button type="button" className="button ghost" onClick={() => handleUpdateAssignedStatus(booking.id, 'COMPLETED')}>Complete</button>
                              )}
                              <button type="button" className="button ghost" onClick={() => handleUpdateAssignedStatus(booking.id, 'CANCELLED')}>Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="button-row" style={{ width: '100%' }}>
                        <BookingStepper status={booking.status} />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PERSONAL BOOKINGS (As Customer) */}
          <div className="content-card stack-medium">
            <h2>{user?.role === 'TRAVEL_AGENT' ? 'My Personal Bookings (As Customer)' : 'My bookings'}</h2>
            {loading ? (
              <p className="muted">Loading bookings…</p>
            ) : personalBookings.length === 0 ? (
              <p className="muted">No personal bookings found.</p>
            ) : (
              <div className="stack-small">
                {personalBookings.map((booking) => (
                  <article key={booking.id} className="mini-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong>{booking.tourName}</strong>
                        {booking.travelDate && (
                          <p className="muted">{booking.travelDate} · {booking.guests} guest(s)</p>
                        )}
                        {booking.assignedAgentName && (
                          <p className="muted">Agent: {booking.assignedAgentName}</p>
                        )}
                        {booking.status === 'CANCELLED' && booking.cancellationReason && (
                          <p className="error-text" style={{ marginTop: '4px', fontWeight: 'bold' }}>
                            Cancellation Reason: {booking.cancellationReason}
                          </p>
                        )}
                      </div>
                      {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          className="button ghost"
                          onClick={() => handleCancelPersonal(booking.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    <div className="button-row" style={{ width: '100%' }}>
                      <BookingStepper status={booking.status} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
