import { render, screen } from '@testing-library/react';
import TourList from '@/components/tour-list';

const tours = [
  {
    id: '1',
    name: 'Santorini Escape',
    location: 'Greece',
    price: 1299,
    duration: '6 days',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Sunset cliffs and blue domes.'
  }
];

describe('TourList', () => {
  it('renders all tours', () => {
    render(<TourList tours={tours} />);

    expect(screen.getByRole('heading', { name: /santorini escape/i })).toBeInTheDocument();
  });
});
