'use client';

import { useState } from 'react';
import Button from './button';
import Input from './input';
import { getCurrentUser, getToken } from '@/lib/auth';
import { getMyBookings, submitFeedback } from '@/lib/api';

export default function FeedbackForm({ tour }) {
  const [values, setValues] = useState({ rating: 5, comment: '' });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    const rating = Number(values.rating);

    if (rating < 1 || rating > 5) {
      nextErrors.rating = 'Rating must be between 1 and 5.';
    }

    // Backend requires a comment when rating is 1–3
    if (rating <= 3 && !values.comment.trim()) {
      nextErrors.comment = 'A comment is required for ratings 1–3.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const token = getToken();
    if (!token) {
      setStatus('Please sign in before leaving feedback.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const bookings = await getMyBookings(token);
      const booking = bookings.find((item) => item.tourId === String(tour.id));

      if (!booking) {
        setStatus('Book this trip first so feedback can be attached to a booking.');
        return;
      }

      if (booking.status !== 'STARTED' && booking.status !== 'COMPLETED') {
        setStatus('Feedback is only allowed for started or completed bookings.');
        return;
      }

      await submitFeedback(token, booking.id, {
        rating: Number(values.rating),
        comment: values.comment
      });

      setStatus('Feedback sent successfully.');
    } catch (error) {
      setStatus(error.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="content-card form" onSubmit={handleSubmit} aria-label="Feedback form">
      <h2>Leave feedback</h2>
      <Input
        label="Rating"
        id="rating"
        type="number"
        min="1"
        max="5"
        value={values.rating}
        error={errors.rating}
        onChange={(event) => setValues({ ...values, rating: event.target.value })}
      />
      <div className="field">
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          className="textarea"
          value={values.comment}
          onChange={(event) => setValues({ ...values, comment: event.target.value })}
        />
        {errors.comment ? <p role="alert" className="error-text">{errors.comment}</p> : null}
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Sending…' : 'Submit feedback'}</Button>
      {status ? <p role="status" className="pill">{status}</p> : null}
    </form>
  );
}
