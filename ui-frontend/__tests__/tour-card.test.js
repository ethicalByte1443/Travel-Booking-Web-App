import { render, screen } from '@testing-library/react';
import TourCard from '@/components/tour-card';

const tour = {
  id: '1',
  name: 'Santorini Escape',
  location: 'Greece',
  price: 1299,
  duration: '6 days',
  rating: 4.9,
  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  description: 'Sunset cliffs and blue domes.'
};

describe('TourCard', () => {
  it('renders tour details', () => {
    render(<TourCard tour={tour} />);

    expect(screen.getByText(/santorini escape/i)).toBeInTheDocument();
    expect(screen.getByText(/greece/i)).toBeInTheDocument();
  });
});
