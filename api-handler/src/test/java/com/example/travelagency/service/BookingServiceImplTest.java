package com.example.travelagency.service;

import com.example.travelagency.dto.request.BookingRequest;
import com.example.travelagency.dto.response.BookingResponse;
import com.example.travelagency.entity.Booking;
import com.example.travelagency.entity.Tour;
import com.example.travelagency.entity.User;
import com.example.travelagency.repository.BookingRepository;
import com.example.travelagency.repository.TourRepository;
import com.example.travelagency.repository.UserRepository;
import com.example.travelagency.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookingServiceImplTest {

    @Mock BookingRepository bookingRepository;
    @Mock TourRepository tourRepository;
    @Mock UserRepository userRepository;

    BookingServiceImpl bookingService;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); bookingService = new BookingServiceImpl(bookingRepository, tourRepository, userRepository); }

    @Test
    void createBooking() {
        BookingRequest req = new BookingRequest(); req.setTourId(1L);
        User u = new User(); u.setId(2L); u.setEmail("a@b.com");
        Tour t = new Tour(); t.setId(1L);
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(u));
        when(tourRepository.findById(1L)).thenReturn(Optional.of(t));
        Booking saved = new Booking(); saved.setId(5L); saved.setUser(u); saved.setTour(t); saved.setCreatedAt(LocalDateTime.now());
        when(bookingRepository.save(any())).thenReturn(saved);
        BookingResponse r = bookingService.createBooking(req, "a@b.com");
        assertEquals(5L, r.getId());
    }

    @Test
    void getMyBookingsEmpty() {
        User u = new User(); u.setId(2L); u.setEmail("x@y.com");
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(u));
        when(bookingRepository.findByUser(u)).thenReturn(List.of());
        assertTrue(bookingService.getMyBookings("x@y.com").isEmpty());
    }
}
