package com.example.travelagency.service.impl;

import com.example.travelagency.dto.request.LoginRequest;
import com.example.travelagency.dto.request.RegisterRequest;
import com.example.travelagency.entity.Role;
import com.example.travelagency.entity.User;
import com.example.travelagency.repository.UserRepository;
import com.example.travelagency.security.JwtUtil;
import com.example.travelagency.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User u = new User();
        u.setName(request.getName());
        u.setEmail(request.getEmail());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null) {
            request.getRoles().forEach(r -> {
                switch (r.toUpperCase()) {
                    case "ADMIN": roles.add(Role.ROLE_ADMIN); break;
                    case "TRAVEL_AGENT": roles.add(Role.ROLE_TRAVEL_AGENT); break;
                    default: roles.add(Role.ROLE_CUSTOMER);
                }
            });
        } else {
            roles.add(Role.ROLE_CUSTOMER);
        }
        u.setRoles(roles);
        userRepository.save(u);
    }

    @Override
    public String login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        return jwtUtil.generateToken(user.getEmail());
    }
}
