export const tours = [
  {
    id: '1',
    name: 'Santorini Escape',
    location: 'Greece',
    price: 1299,
    duration: '6 days',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Sunset cliffs, blue domes, and premium private experiences.'
  },
  {
    id: '2',
    name: 'Tokyo Nights',
    location: 'Japan',
    price: 1599,
    duration: '7 days',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80',
    description: 'A neon-filled city break with food, tech, and culture.'
  },
  {
    id: '3',
    name: 'Bali Retreat',
    location: 'Indonesia',
    price: 1099,
    duration: '5 days',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80',
    description: 'Wellness villas, ocean air, and a calm premium experience.'
  },
  {
    id: '4',
    name: 'Swiss Alpine Loop',
    location: 'Switzerland',
    price: 1899,
    duration: '8 days',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    description: 'Luxury rail journeys and mountain scenery at every stop.'
  }
];

export const featuredTours = tours.slice(0, 3);

export const users = [
  { id: 'u1', name: 'Aseem', email: 'aseem@example.com', role: 'CUSTOMER' },
  { id: 'u2', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' },
  { id: 'u3', name: 'Agent', email: 'agent@example.com', role: 'TRAVEL_AGENT' }
];

export const bookings = [
  { id: 'b1', userId: 'u1', tourId: '1', tourName: 'Santorini Escape', status: 'CONFIRMED', travelDate: '2026-07-18' },
  { id: 'b2', userId: 'u1', tourId: '2', tourName: 'Tokyo Nights', status: 'STARTED', travelDate: '2026-08-06' }
];

export const feedback = [
  { id: 'f1', userId: 'u1', tourId: '1', tourName: 'Santorini Escape', rating: 5, comment: 'Perfect itinerary and beautiful UI.' }
];

export function getTourById(id) {
  return tours.find((tour) => tour.id === id);
}
