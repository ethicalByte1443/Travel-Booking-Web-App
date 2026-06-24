package com.example.travelagency.service.impl;

import com.example.travelagency.dto.request.UserUpdateRequest;
import com.example.travelagency.dto.response.UserResponse;
import com.example.travelagency.entity.User;
import com.example.travelagency.exception.ResourceNotFoundException;
import com.example.travelagency.repository.UserRepository;
import com.example.travelagency.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse getProfile(String email) {
        User u = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(u);
    }

    @Override
    public UserResponse updateProfile(String email, UserUpdateRequest request) {
        User u = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setName(request.getName());
        u.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        User saved = userRepository.save(u);
        return toResponse(saved);
    }

    @Override
    public UserResponse getById(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(u);
    }

    private UserResponse toResponse(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setName(u.getName());
        r.setEmail(u.getEmail());
        r.setRoles(u.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
        return r;
    }
}
