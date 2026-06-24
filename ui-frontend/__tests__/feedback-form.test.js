import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackForm from '@/components/feedback-form';

jest.mock('@/lib/auth', () => ({
  getCurrentUser: () => ({ id: 'u1' })
}));

jest.mock('@/lib/mock-api', () => ({
  submitFeedback: jest.fn().mockResolvedValue({})
}));

describe('FeedbackForm', () => {
  it('validates comment field', async () => {
    render(<FeedbackForm tour={{ id: '1', name: 'Santorini Escape' }} />);
    await userEvent.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/write a short review/i);
  });
});
