package com.example.travelagency.repository;

import com.example.travelagency.entity.Booking;
import com.example.travelagency.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}
