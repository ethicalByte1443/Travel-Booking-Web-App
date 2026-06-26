'use client';

import { useState } from 'react';
import Input from './input';
import Button from './button';
import { createBooking, getMyBookings } from '@/lib/api';
import { getCurrentUser, getToken } from '@/lib/auth';

export default function BookingForm({ tour }) {
  const [values, setValues] = useState({ travelDate: '', guests: 2 });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!values.travelDate) {
      nextErrors.travelDate = 'Select a travel date.';
    }

    if (Number(values.guests) < 1) {
      nextErrors.guests = 'Guests must be at least 1.';
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
      setStatus('Please sign in before booking this trip.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      await createBooking(token, {
        tourId: tour.id,
        travelDate: values.travelDate,
        guests: Number(values.guests)
      });

      const bookings = await getMyBookings(token);
      const latest = bookings.find((booking) => booking.tourId === String(tour.id));
      setStatus(latest ? `Booking submitted successfully. Reference ${latest.id}.` : 'Booking submitted successfully.');
    } catch (error) {
      setStatus(error.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="content-card form" onSubmit={handleSubmit} aria-label="Booking form">
      <h2>Book this tour</h2>
      <Input
        label="Travel date"
        id="travel-date"
        type="date"
        value={values.travelDate}
        error={errors.travelDate}
        onChange={(event) => setValues({ ...values, travelDate: event.target.value })}
      />
      <Input
        label="Guests"
        id="guests"
        type="number"
        min="1"
        value={values.guests}
        error={errors.guests}
        onChange={(event) => setValues({ ...values, guests: event.target.value })}
      />
      <Button type="submit" disabled={loading}>{loading ? 'Booking…' : 'Submit booking'}</Button>
      {status ? <p role="status" className="pill">{status}</p> : null}
    </form>
  );
}
