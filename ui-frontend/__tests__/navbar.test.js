import { render, screen } from '@testing-library/react';
import Navbar from '@/components/navbar';
import { createTokenFromUser } from '@/lib/auth';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}));

jest.mock('@/components/theme-provider', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn()
  })
}));

describe('Navbar', () => {
  beforeEach(() => {
    push.mockClear();
    window.localStorage.clear();
  });

  it('renders login when user is absent', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('renders role badge for signed in user', () => {
    window.localStorage.setItem(
      'travel_booking_token',
      createTokenFromUser({ id: 'u2', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' })
    );

    render(<Navbar />);

    expect(screen.getByLabelText(/current role/i)).toHaveTextContent(/admin/i);
  });
});
