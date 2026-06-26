const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const LOCATION_IMAGES = {
  Bali: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80',
  Greece: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  Japan: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80',
  Switzerland: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  Iceland: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=1200&q=80',
  Thailand: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80',
  Italy: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
  'New Zealand': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
  Peru: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
  Morocco: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'
};

const DURATION_SEQUENCE = ['3 days', '4 days', '5 days', '6 days', '7 days', '8 days', '9 days'];
const RATING_SEQUENCE = [4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];

/**
 * Generic fetch wrapper that injects the JWT token, handles errors,
 * and parses JSON responses from the Spring Boot backend.
 */
async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store'
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      try {
        message = await response.text();
      } catch {
        message = response.statusText || message;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/* ---------- Transformers ---------- */

/**
 * Enrich a raw Tour entity from the backend with computed display fields
 * (image, duration, rating) so every TourCard / TourDetails looks great.
 */
function toTour(tour) {
  const id = String(tour.id);
  const numericId = Number.parseInt(id, 10) || 1;
  const location = tour.location || 'Worldwide';

  return {
    id,
    title: tour.title,
    name: tour.title,
    location,
    category: tour.category || 'Adventure',
    price: Number(tour.price || 0),
    duration: DURATION_SEQUENCE[(numericId - 1) % DURATION_SEQUENCE.length],
    rating: RATING_SEQUENCE[(numericId - 1) % RATING_SEQUENCE.length],
    image: LOCATION_IMAGES[location] || LOCATION_IMAGES.Greece,
    description: tour.description || ''
  };
}

/**
 * Enrich a BookingResponse with tour name / location for display.
 */
function toBooking(booking, tourMap = new Map()) {
  const tour = tourMap.get(String(booking.tourId));
  return {
    id: String(booking.id),
    tourId: String(booking.tourId),
    tourName: tour?.title || `Tour #${booking.tourId}`,
    tourLocation: tour?.location || '',
    status: booking.status,
    createdAt: booking.createdAt,
    travelDate: booking.travelDate || null,
    guests: booking.guests || 1,
    feedbackRating: booking.feedbackRating || null,
    feedbackComment: booking.feedbackComment || null
  };
}

/* ---------- Auth ---------- */

export async function loginRequest(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

export async function registerRequest(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: payload
  });
}

/* ---------- Users ---------- */

export async function fetchCurrentUser(token) {
  return request('/api/users/me', { token });
}

export async function updateCurrentUser(token, payload) {
  return request('/api/users/me', {
    method: 'PUT',
    token,
    body: payload
  });
}

/* ---------- Tours ---------- */

export async function getTours() {
  const tours = await request('/api/tours');
  return (tours || []).map(toTour);
}

export async function getTourById(id) {
  const tour = await request(`/api/tours/${id}`);
  return tour ? toTour(tour) : null;
}

export async function searchTours(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  const tours = await request(`/api/tours/search${queryString ? `?${queryString}` : ''}`);
  return (tours || []).map(toTour);
}

/** Admin / Travel Agent: create a new tour */
export async function createTour(token, payload) {
  return request('/api/tours', {
    method: 'POST',
    token,
    body: payload
  });
}

/** Admin / Travel Agent: update an existing tour */
export async function updateTour(token, tourId, payload) {
  return request(`/api/tours/${tourId}`, {
    method: 'PUT',
    token,
    body: payload
  });
}

/** Admin / Travel Agent: delete a tour */
export async function deleteTour(token, tourId) {
  return request(`/api/tours/${tourId}`, {
    method: 'DELETE',
    token
  });
}

/* ---------- Bookings ---------- */

export async function getMyBookings(token) {
  const [bookings, tours] = await Promise.all([
    request('/api/bookings/my', { token }),
    getTours()
  ]);
  const tourMap = new Map(tours.map((tour) => [tour.id, tour]));
  return (bookings || []).map((booking) => toBooking(booking, tourMap));
}

export async function getAllBookings(token) {
  const [bookings, tours] = await Promise.all([
    request('/api/bookings', { token }),
    getTours()
  ]);
  const tourMap = new Map(tours.map((tour) => [tour.id, tour]));
  return (bookings || []).map((booking) => toBooking(booking, tourMap));
}

export async function createBooking(token, payload) {
  return request('/api/bookings', {
    method: 'POST',
    token,
    body: {
      tourId: Number(payload.tourId),
      travelDate: payload.travelDate,
      guests: Number(payload.guests) || 1
    }
  });
}

export async function cancelBooking(token, bookingId) {
  return request(`/api/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    token
  });
}

/* ---------- Feedback ---------- */

export async function submitFeedback(token, bookingId, payload) {
  return request(`/api/bookings/${bookingId}/feedback`, {
    method: 'POST',
    token,
    body: payload
  });
}

export async function updateFeedback(token, bookingId, payload) {
  return request(`/api/bookings/${bookingId}/feedback`, {
    method: 'PUT',
    token,
    body: payload
  });
}

export async function getFeedbackForTour(tourId) {
  return request(`/api/tours/${tourId}/feedback`);
}

export async function getAllFeedback(token) {
  return request('/api/feedback', { token });
}
