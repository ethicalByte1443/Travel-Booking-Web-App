import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '@/components/register-form';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    push.mockClear();
    window.localStorage.clear();
  });

  it('shows validation for missing name and email', async () => {
    render(<RegisterForm />);
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    expect(push).not.toHaveBeenCalled();
  });
});
