package com.example.travelagency.config;

import com.example.travelagency.entity.Role;
import com.example.travelagency.entity.Booking;
import com.example.travelagency.entity.BookingStatus;
import com.example.travelagency.entity.Tour;
import com.example.travelagency.entity.User;
import com.example.travelagency.entity.Feedback;
import com.example.travelagency.repository.BookingRepository;
import com.example.travelagency.repository.FeedbackRepository;
import com.example.travelagency.repository.TourRepository;
import com.example.travelagency.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(UserRepository userRepository,
                               TourRepository tourRepository,
                               BookingRepository bookingRepository,
                               FeedbackRepository feedbackRepository,
                               BCryptPasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@example.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(encoder.encode("password"));
                admin.getRoles().add(Role.ROLE_ADMIN);
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("agent@example.com")) {
                User agent = new User();
                agent.setName("Agent");
                agent.setEmail("agent@example.com");
                agent.setPassword(encoder.encode("password"));
                agent.getRoles().add(Role.ROLE_TRAVEL_AGENT);
                userRepository.save(agent);
            }

            if (!userRepository.existsByEmail("user@example.com")) {
                User user = new User();
                user.setName("Customer");
                user.setEmail("user@example.com");
                user.setPassword(encoder.encode("password"));
                user.getRoles().add(Role.ROLE_CUSTOMER);
                userRepository.save(user);
            }

            if (tourRepository.count() == 0) {
                List<String> locations = List.of(
                        "Bali", "Greece", "Japan", "Switzerland", "Iceland",
                        "Thailand", "Italy", "New Zealand", "Peru", "Morocco"
                );
                List<String> categories = List.of("Relax", "Adventure", "Culture", "Luxury", "Nature");
                List<String> experiences = List.of(
                        "sunset escapes", "city lights", "mountain trails", "food journeys", "wellness retreats"
                );

                for (int i = 0; i < 50; i++) {
                    int displayIndex = i + 1;
                    Tour tour = new Tour();
                    tour.setTitle(String.format("%s %02d", categories.get(i % categories.size()), displayIndex));
                    tour.setLocation(locations.get(i % locations.size()));
                    tour.setCategory(categories.get(i % categories.size()));
                    tour.setPrice(BigDecimal.valueOf(299 + (i * 37L) % 1500).setScale(2, BigDecimal.ROUND_HALF_UP));
                    tour.setDescription(String.format("%s featuring %s in %s.",
                            categories.get(i % categories.size()),
                            experiences.get(i % experiences.size()),
                            locations.get(i % locations.size())));
                    tourRepository.save(tour);
                }
            }

            if (bookingRepository.count() == 0 && tourRepository.count() > 0) {
                User customer = userRepository.findByEmail("user@example.com").orElseThrow();
                User admin = userRepository.findByEmail("admin@example.com").orElseThrow();
                List<Tour> tours = tourRepository.findAll();

                for (int i = 0; i < Math.min(6, tours.size()); i++) {
                    Booking booking = new Booking();
                    booking.setUser(customer);
                    booking.setTour(tours.get(i));
                    booking.setTravelDate(LocalDate.now().plusDays(7 + i));
                    booking.setGuests(2 + (i % 3));
                    booking.setCreatedAt(LocalDateTime.now().minusDays(10 - i));
                    booking.setStatus(switch (i % 5) {
                        case 0 -> BookingStatus.CREATED;
                        case 1 -> BookingStatus.CONFIRMED;
                        case 2 -> BookingStatus.STARTED;
                        case 3 -> BookingStatus.COMPLETED;
                        default -> BookingStatus.CANCELLED;
                    });
                    bookingRepository.save(booking);
                }

                if (feedbackRepository.count() == 0) {
                    bookingRepository.findAll().stream()
                            .filter(b -> b.getStatus() == BookingStatus.STARTED || b.getStatus() == BookingStatus.COMPLETED)
                            .limit(4)
                            .forEach(booking -> {
                                Feedback feedback = new Feedback();
                                feedback.setBooking(booking);
                                feedback.setRating(booking.getStatus() == BookingStatus.COMPLETED ? 5 : 4);
                                feedback.setComment(String.format("Great trip for %s managed by %s.",
                                        booking.getTour().getTitle(),
                                        admin.getName()));
                                feedbackRepository.save(feedback);
                            });
                }
            }
        };
    }
}
