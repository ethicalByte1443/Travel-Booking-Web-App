/**
 * Legacy re-export layer.
 *
 * All functions now delegate directly to the real API client.
 * This file exists so that any remaining imports from '@/lib/mock-api'
 * continue to work without code changes.
 */
export {
  cancelBooking,
  createBooking,
  getAllBookings,
  getAllFeedback,
  getFeedbackForTour,
  getMyBookings as getBookingsForUser,
  getTourById,
  getTours,
  searchTours,
  submitFeedback,
  updateFeedback,
  createTour,
  updateTour,
  deleteTour
} from './api';
