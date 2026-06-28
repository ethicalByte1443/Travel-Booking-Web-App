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
                               BCryptPasswordEncoder encoder) {
        return args -> {
            // 1 Admin
            if (!userRepository.existsByEmail("admin@travelapp.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@travelapp.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.getRoles().add(Role.ROLE_ADMIN);
                userRepository.save(admin);
            }

            // 5 Travel Agents
            for (int i = 1; i <= 5; i++) {
                String agentEmail = "agent" + i + "@travelapp.com";
                if (!userRepository.existsByEmail(agentEmail)) {
                    User agent = new User();
                    agent.setName("Agent " + i);
                    agent.setEmail(agentEmail);
                    agent.setPassword(encoder.encode("agent123"));
                    agent.getRoles().add(Role.ROLE_TRAVEL_AGENT);
                    userRepository.save(agent);
                }
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
        };
    }
}
