package com.example.travelagency.service.impl;

import com.example.travelagency.dto.request.FeedbackRequest;
import com.example.travelagency.dto.response.FeedbackResponse;
import com.example.travelagency.entity.Booking;
import com.example.travelagency.entity.Feedback;
import com.example.travelagency.entity.BookingStatus;
import com.example.travelagency.exception.BadRequestException;
import com.example.travelagency.exception.ResourceNotFoundException;
import com.example.travelagency.repository.BookingRepository;
import com.example.travelagency.repository.FeedbackRepository;
import com.example.travelagency.service.FeedbackService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final BookingRepository bookingRepository;
    private final FeedbackRepository feedbackRepository;

    public FeedbackServiceImpl(BookingRepository bookingRepository, FeedbackRepository feedbackRepository) {
        this.bookingRepository = bookingRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public FeedbackResponse submitFeedback(Long bookingId, FeedbackRequest request, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!(booking.getStatus() == BookingStatus.STARTED || booking.getStatus() == BookingStatus.COMPLETED)) {
            throw new BadRequestException("Feedback allowed only for STARTED or COMPLETED bookings");
        }
        if (request.getRating() <= 3 && (request.getComment() == null || request.getComment().isBlank())) {
            throw new BadRequestException("Comment is required for rating 1-3");
        }
        Feedback f = new Feedback();
        f.setBooking(booking);
        f.setRating(request.getRating());
        f.setComment(request.getComment());
        Feedback saved = feedbackRepository.save(f);
        return toResponse(saved);
    }

    @Override
    public FeedbackResponse updateFeedback(Long bookingId, FeedbackRequest request, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Feedback target = feedbackRepository.findByBooking_Id(bookingId).stream().findFirst().orElseThrow(() -> new ResourceNotFoundException("Feedback not found for booking"));
        if (request.getRating() <= 3 && (request.getComment() == null || request.getComment().isBlank())) {
            throw new BadRequestException("Comment is required for rating 1-3");
        }
        target.setRating(request.getRating());
        target.setComment(request.getComment());
        Feedback updated = feedbackRepository.save(target);
        return toResponse(updated);
    }

    @Override
    public List<FeedbackResponse> getFeedbackByTour(Long tourId) {
        return feedbackRepository.findByBooking_Tour_Id(tourId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private FeedbackResponse toResponse(Feedback f) {
        FeedbackResponse r = new FeedbackResponse();
        r.setId(f.getId());
        r.setBookingId(f.getBooking().getId());
        r.setRating(f.getRating());
        r.setComment(f.getComment());
        return r;
    }
}
