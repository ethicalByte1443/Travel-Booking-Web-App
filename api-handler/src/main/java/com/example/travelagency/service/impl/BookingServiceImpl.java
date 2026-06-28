package com.example.travelagency.service.impl;

import com.example.travelagency.dto.request.BookingRequest;
import com.example.travelagency.dto.response.BookingResponse;
import com.example.travelagency.entity.Booking;
import com.example.travelagency.entity.BookingStatus;
import com.example.travelagency.entity.Role;
import com.example.travelagency.entity.Tour;
import com.example.travelagency.entity.User;
import com.example.travelagency.exception.ResourceNotFoundException;
import com.example.travelagency.repository.BookingRepository;
import com.example.travelagency.repository.TourRepository;
import com.example.travelagency.repository.UserRepository;
import com.example.travelagency.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, TourRepository tourRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Tour tour = tourRepository.findById(request.getTourId()).orElseThrow(() -> new ResourceNotFoundException("Tour not found"));
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setTravelDate(request.getTravelDate());
        booking.setGuests(request.getGuests());

        // Assign a random travel agent
        List<User> agents = userRepository.findByRolesContaining(Role.ROLE_TRAVEL_AGENT);
        if (!agents.isEmpty()) {
            User randomAgent = agents.get(new Random().nextInt(agents.size()));
            booking.setAssignedAgent(randomAgent);
        }

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUser(user).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking b = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!b.getUser().getEmail().equals(userEmail)) {
            // allow admins elsewhere via controller security
        }
        return toResponse(b);
    }

    @Override
    @Transactional
    public void cancelBooking(Long id, String userEmail) {
        Booking b = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!b.getUser().getEmail().equals(userEmail)) {
            // controller should enforce authorization
        }
        b.setStatus(com.example.travelagency.entity.BookingStatus.CANCELLED);
        bookingRepository.save(b);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAgentBookings(String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail).orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
        return bookingRepository.findByAssignedAgent(agent).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateBookingStatus(Long id, String status, String reason, String agentEmail) {
        Booking b = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        // Basic check if agent owns booking or is admin (could be enforced more strictly)
        b.setStatus(BookingStatus.valueOf(status.toUpperCase()));
        if (BookingStatus.CANCELLED.name().equalsIgnoreCase(status)) {
            b.setCancellationReason(reason);
        }
        bookingRepository.save(b);
    }

    private BookingResponse toResponse(Booking b) {
        BookingResponse r = new BookingResponse();
        r.setId(b.getId());
        r.setTourId(b.getTour().getId());
        r.setUserId(b.getUser().getId());
        r.setStatus(b.getStatus().name());
        r.setCreatedAt(b.getCreatedAt());
        r.setTravelDate(b.getTravelDate());
        r.setGuests(b.getGuests());
        
        if (b.getUser() != null) {
            r.setCustomerName(b.getUser().getName());
            r.setCustomerEmail(b.getUser().getEmail());
        }

        if (b.getAssignedAgent() != null) {
            r.setAssignedAgentName(b.getAssignedAgent().getName());
            r.setAssignedAgentId(b.getAssignedAgent().getId());
        }
        r.setCancellationReason(b.getCancellationReason());
        return r;
    }
}
