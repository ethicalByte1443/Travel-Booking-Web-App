package com.example.travelagency.service;

import com.example.travelagency.dto.request.BookingRequest;
import com.example.travelagency.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request, String userEmail);
    List<BookingResponse> getMyBookings(String userEmail);
    BookingResponse getBookingById(Long id, String userEmail);
    void cancelBooking(Long id, String userEmail);
    List<BookingResponse> getAllBookings();
}
