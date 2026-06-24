import { render, screen } from '@testing-library/react';
import ProtectedRoute from '@/components/protected-route';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}));

jest.mock('@/lib/auth', () => ({
  getCurrentUser: () => null
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('shows loader while checking access', () => {
    render(
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <div>Protected</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/checking access/i)).toBeInTheDocument();
  });
});
