package com.example.travelagency.service;

import com.example.travelagency.dto.request.UserUpdateRequest;
import com.example.travelagency.dto.response.UserResponse;

public interface UserService {
    UserResponse getProfile(String email);
    UserResponse updateProfile(String email, UserUpdateRequest request);
    UserResponse getById(Long id);
}
