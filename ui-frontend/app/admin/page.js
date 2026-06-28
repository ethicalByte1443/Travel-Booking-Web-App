'use client';

import DashboardLayout from '@/components/dashboard-layout';
import ProtectedRoute from '@/components/protected-route';
import { useEffect, useState } from 'react';
import { getAllBookings, getAgentBookings, getAllFeedback, getTours, createTour, deleteTour, updateBookingStatus } from '@/lib/api';
import { getToken, useAuthUser } from '@/lib/auth';
import Input from '@/components/input';
import Button from '@/components/button';

export default function AdminPage() {
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthUser();

  /* Add Tour form state */
  const [tourForm, setTourForm] = useState({
    title: '',
    location: '',
    category: '',
    price: '',
    description: ''
  });
  const [tourFormStatus, setTourFormStatus] = useState('');
  const [tourFormLoading, setTourFormLoading] = useState(false);

  /* Active tab */
  const [tab, setTab] = useState('tours');

  useEffect(() => {
    const loadAdminData = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [tourData, bookingData, feedbackData] = await Promise.all([
          getTours(),
          user?.role === 'TRAVEL_AGENT' ? getAgentBookings(token) : getAllBookings(token),
          getAllFeedback(token)
        ]);

        setTours(tourData);
        setBookings(bookingData);
        setFeedback(feedbackData || []);
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadAdminData();
    }
  }, [user]);

  /* Create Tour */
  const handleCreateTour = async (event) => {
    event.preventDefault();
    const token = getToken();
    if (!token) return;

    setTourFormLoading(true);
    setTourFormStatus('');

    try {
      await createTour(token, {
        title: tourForm.title,
        location: tourForm.location,
        category: tourForm.category,
        price: Number(tourForm.price),
        description: tourForm.description
      });

      setTourFormStatus('Tour created successfully.');
      setTourForm({ title: '', location: '', category: '', price: '', description: '' });

      // Refresh tour list
      const updatedTours = await getTours();
      setTours(updatedTours);
    } catch (error) {
      setTourFormStatus(error.message || 'Failed to create tour.');
    } finally {
      setTourFormLoading(false);
    }
  };

  /* Delete Tour */
  const handleDeleteTour = async (tourId) => {
    const token = getToken();
    if (!token) return;

    try {
      await deleteTour(token, tourId);
      setTours((prev) => prev.filter((t) => t.id !== tourId));
    } catch {
      // Silently fail
    }
  };

  /* Update Status */
  const handleUpdateStatus = async (bookingId, newStatus) => {
    const token = getToken();
    if (!token) return;

    let reason = null;
    if (newStatus === 'CANCELLED') {
      reason = prompt("Enter reason for cancellation:");
      if (reason === null) return; // User clicked cancel in prompt
      if (!reason.trim()) {
        alert("Cancellation reason is required.");
        return;
      }
    }

    try {
      await updateBookingStatus(token, bookingId, newStatus, reason);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, cancellationReason: reason } : b))
      );
    } catch {
      // API error
    }
  };

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'TRAVEL_AGENT']}>
      <DashboardLayout title="Admin Dashboard" subtitle="Manage tours, bookings, and feedback">

        {/* Tab navigation */}
        <div className="tab-row">
          <button
            type="button"
            className={`tab-button ${tab === 'tours' ? 'tab-active' : ''}`}
            onClick={() => setTab('tours')}
          >
            Tours ({tours.length})
          </button>
          <button
            type="button"
            className={`tab-button ${tab === 'bookings' ? 'tab-active' : ''}`}
            onClick={() => setTab('bookings')}
          >
            Bookings ({bookings.length})
          </button>
          <button
            type="button"
            className={`tab-button ${tab === 'feedback' ? 'tab-active' : ''}`}
            onClick={() => setTab('feedback')}
          >
            Feedback ({feedback.length})
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading admin data…</p>
        ) : (
          <>
            {/* TOURS TAB */}
            {tab === 'tours' && (
              <div className="two-column-grid">
                {/* Add Tour Form */}
                <form className="content-card form" onSubmit={handleCreateTour} aria-label="Add tour form">
                  <h2>Add new tour</h2>
                  <Input
                    label="Title"
                    id="tour-title"
                    value={tourForm.title}
                    onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                  />
                  <Input
                    label="Location"
                    id="tour-location"
                    value={tourForm.location}
                    onChange={(e) => setTourForm({ ...tourForm, location: e.target.value })}
                  />
                  <Input
                    label="Category"
                    id="tour-category"
                    value={tourForm.category}
                    onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                  />
                  <Input
                    label="Price"
                    id="tour-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={tourForm.price}
                    onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                  />
                  <div className="field">
                    <label htmlFor="tour-description">Description</label>
                    <textarea
                      id="tour-description"
                      className="textarea"
                      value={tourForm.description}
                      onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={tourFormLoading}>
                    {tourFormLoading ? 'Creating…' : 'Create tour'}
                  </Button>
                  {tourFormStatus ? <p className="pill" role="status">{tourFormStatus}</p> : null}
                </form>

                {/* Tour inventory */}
                <section className="content-card stack-medium">
                  <h2>Tour inventory</h2>
                  {tours.length === 0 ? (
                    <p className="muted">No tours found.</p>
                  ) : (
                    <div className="stack-small">
                      {tours.map((tour) => (
                        <article key={tour.id} className="mini-card">
                          <div>
                            <strong>{tour.name}</strong>
                            <p className="muted">{tour.location} · {tour.category}</p>
                          </div>
                          <div className="button-row">
                            <span className="pill">${tour.price}</span>
                            <button
                              type="button"
                              className="button ghost"
                              onClick={() => handleDeleteTour(tour.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {tab === 'bookings' && (
              <section className="content-card stack-medium">
                <h2>All bookings</h2>
                {bookings.length === 0 ? (
                  <p className="muted">No bookings found.</p>
                ) : (
                  <div className="stack-small">
                    {bookings.map((booking) => (
                      <article key={booking.id} className="mini-card">
                        <div>
                          <strong>{booking.tourName}</strong>
                          <p className="muted">
                            {booking.travelDate || 'No date'} · {booking.guests} guest(s)
                          </p>
                          {booking.customerName && (
                            <p className="muted" style={{ marginTop: '4px' }}>
                              Customer: {booking.customerName} ({booking.customerEmail})
                            </p>
                          )}
                          {booking.assignedAgentName && user?.role === 'ADMIN' && (
                            <p className="muted">Agent: {booking.assignedAgentName}</p>
                          )}
                          {booking.status === 'CANCELLED' && booking.cancellationReason && (
                            <p className="error-text" style={{ marginTop: '4px', fontWeight: 'bold' }}>
                              Cancellation Reason: {booking.cancellationReason}
                            </p>
                          )}
                        </div>
                        <div className="button-row">
                          <span className={`badge badge-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                          
                          {/* Agent status controls */}
                          {user?.role === 'TRAVEL_AGENT' && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                            <div className="button-row">
                              {booking.status === 'CREATED' && (
                                <button type="button" className="button ghost" onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}>Confirm</button>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <button type="button" className="button ghost" onClick={() => handleUpdateStatus(booking.id, 'STARTED')}>Start</button>
                              )}
                              {booking.status === 'STARTED' && (
                                <button type="button" className="button ghost" onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}>Complete</button>
                              )}
                              <button type="button" className="button ghost" onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}>Cancel</button>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* FEEDBACK TAB */}
            {tab === 'feedback' && (
              <section className="content-card stack-medium">
                <h2>Customer feedback</h2>
                {feedback.length === 0 ? (
                  <p className="muted">No feedback submitted yet.</p>
                ) : (
                  <div className="stack-small">
                    {feedback.map((item) => (
                      <article key={item.id} className="mini-card">
                        <div>
                          <p className="stars">{renderStars(item.rating)}</p>
                          {item.comment && <p className="muted">{item.comment}</p>}
                        </div>
                        <span className="badge badge-accent">Booking #{item.bookingId}</span>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
