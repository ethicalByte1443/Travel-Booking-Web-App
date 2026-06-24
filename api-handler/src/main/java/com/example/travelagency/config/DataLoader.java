package com.example.travelagency.config;

import com.example.travelagency.entity.Role;
import com.example.travelagency.entity.Tour;
import com.example.travelagency.entity.User;
import com.example.travelagency.repository.TourRepository;
import com.example.travelagency.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(UserRepository userRepository, TourRepository tourRepository, BCryptPasswordEncoder encoder) {
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
                Tour t1 = new Tour();
                t1.setTitle("Beach Paradise");
                t1.setLocation("Bali");
                t1.setCategory("Relax");
                t1.setPrice(new BigDecimal("499.99"));
                t1.setDescription("5-day beach stay");
                tourRepository.save(t1);

                Tour t2 = new Tour();
                t2.setTitle("Mountain Adventure");
                t2.setLocation("Nepal");
                t2.setCategory("Adventure");
                t2.setPrice(new BigDecimal("899.00"));
                t2.setDescription("10-day trekking");
                tourRepository.save(t2);
            }
        };
    }
}
