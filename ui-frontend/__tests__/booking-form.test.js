import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '@/components/booking-form';

jest.mock('@/lib/auth', () => ({
  getCurrentUser: () => ({ id: 'u1' })
}));

jest.mock('@/lib/mock-api', () => ({
  createBooking: jest.fn().mockResolvedValue({})
}));

describe('BookingForm', () => {
  it('shows validation for missing date', async () => {
    render(<BookingForm tour={{ id: '1', name: 'Santorini Escape' }} />);
    await userEvent.click(screen.getByRole('button', { name: /submit booking/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/select a travel date/i);
  });
});
