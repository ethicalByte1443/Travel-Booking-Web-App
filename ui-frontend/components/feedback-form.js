'use client';

import { useState } from 'react';
import Button from './button';
import Input from './input';
import { getCurrentUser, getToken } from '@/lib/auth';
import { getMyBookings, submitFeedback } from '@/lib/mock-api';

export default function FeedbackForm({ tour }) {
  const [values, setValues] = useState({ rating: 5, comment: '' });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!values.comment.trim()) {
      nextErrors.comment = 'Write a short review.';
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

    const user = getCurrentUser();
    const bookings = await getMyBookings(token);
    const booking = bookings.find((item) => item.tourId === String(tour.id));

    if (!booking) {
      setStatus('Book this trip first so feedback can be attached to a booking.');
      return;
    }

    await submitFeedback(token, booking.id, {
      rating: Number(values.rating),
      comment: values.comment,
      userId: user?.id
    });

    setStatus('Feedback sent successfully.');
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
      <Button type="submit">Submit feedback</Button>
      {status ? <p role="status" className="pill">{status}</p> : null}
    </form>
  );
}
