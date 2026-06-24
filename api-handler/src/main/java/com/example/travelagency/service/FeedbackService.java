package com.example.travelagency.service;

import com.example.travelagency.dto.request.FeedbackRequest;
import com.example.travelagency.dto.response.FeedbackResponse;

import java.util.List;

public interface FeedbackService {
    FeedbackResponse submitFeedback(Long bookingId, FeedbackRequest request, String userEmail);
    FeedbackResponse updateFeedback(Long bookingId, FeedbackRequest request, String userEmail);
    List<FeedbackResponse> getFeedbackByTour(Long tourId);
    List<FeedbackResponse> getAllFeedback();
}
