package com.example.travelagency.controller;

import com.example.travelagency.dto.request.BookingRequest;
import com.example.travelagency.dto.response.BookingResponse;
import com.example.travelagency.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        String email = getCurrentUserEmail();
        BookingResponse resp = bookingService.createBooking(request, email);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> myBookings() {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(bookingService.getMyBookings(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getById(@PathVariable Long id) {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(bookingService.getBookingById(id, email));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        String email = getCurrentUserEmail();
        bookingService.cancelBooking(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_TRAVEL_AGENT')")
    public ResponseEntity<List<BookingResponse>> allBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object p = auth.getPrincipal();
        if (p instanceof UserDetails) return ((UserDetails) p).getUsername();
        return String.valueOf(p);
    }
}
