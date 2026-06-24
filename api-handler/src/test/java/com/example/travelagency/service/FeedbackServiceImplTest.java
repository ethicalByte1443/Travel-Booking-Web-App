package com.example.travelagency.service;

import com.example.travelagency.dto.request.FeedbackRequest;
import com.example.travelagency.entity.Booking;
import com.example.travelagency.entity.BookingStatus;
import com.example.travelagency.entity.Feedback;
import com.example.travelagency.repository.BookingRepository;
import com.example.travelagency.repository.FeedbackRepository;
import com.example.travelagency.service.impl.FeedbackServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FeedbackServiceImplTest {

    @Mock BookingRepository bookingRepository;
    @Mock FeedbackRepository feedbackRepository;

    FeedbackServiceImpl feedbackService;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); feedbackService = new FeedbackServiceImpl(bookingRepository, feedbackRepository); }

    @Test
    void submitAndValidate() {
        Booking b = new Booking(); b.setId(1L); b.setStatus(BookingStatus.COMPLETED);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(b));
        Feedback f = new Feedback(); f.setId(10L); f.setBooking(b);
        when(feedbackRepository.save(any())).thenReturn(f);
        FeedbackRequest req = new FeedbackRequest(); req.setRating(5); req.setComment("Nice");
        var res = feedbackService.submitFeedback(1L, req, "user@x");
        assertEquals(10L, res.getId());
    }
}
