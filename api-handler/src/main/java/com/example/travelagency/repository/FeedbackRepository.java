package com.example.travelagency.repository;

import com.example.travelagency.entity.Feedback;
import com.example.travelagency.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByBooking_Tour_Id(Long tourId);
    java.util.List<Feedback> findByBooking_Id(Long bookingId);
}
