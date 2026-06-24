import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/login-form';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}));

describe('LoginForm', () => {
  beforeEach(() => {
    push.mockClear();
    window.localStorage.clear();
  });

  it('shows validation for invalid email', async () => {
    render(<LoginForm />);
    await userEvent.clear(screen.getByLabelText(/email/i));
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
    expect(push).not.toHaveBeenCalled();
  });
});
