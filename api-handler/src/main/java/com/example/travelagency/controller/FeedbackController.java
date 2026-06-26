package com.example.travelagency.controller;

import com.example.travelagency.dto.request.FeedbackRequest;
import com.example.travelagency.dto.response.FeedbackResponse;
import com.example.travelagency.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/api/bookings/{bookingId}/feedback")
    public ResponseEntity<FeedbackResponse> submit(@PathVariable("bookingId") Long bookingId, @Valid @RequestBody FeedbackRequest request) {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(feedbackService.submitFeedback(bookingId, request, email));
    }

    @PutMapping("/api/bookings/{bookingId}/feedback")
    public ResponseEntity<FeedbackResponse> update(@PathVariable("bookingId") Long bookingId, @Valid @RequestBody FeedbackRequest request) {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(feedbackService.updateFeedback(bookingId, request, email));
    }

    @GetMapping("/api/tours/{tourId}/feedback")
    public ResponseEntity<List<FeedbackResponse>> forTour(@PathVariable("tourId") Long tourId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByTour(tourId));
    }

    @GetMapping("/api/feedback")
    public ResponseEntity<List<FeedbackResponse>> all() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object p = auth.getPrincipal();
        if (p instanceof UserDetails) return ((UserDetails) p).getUsername();
        return String.valueOf(p);
    }
}
