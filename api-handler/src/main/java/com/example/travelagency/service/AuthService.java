package com.example.travelagency.service;

import com.example.travelagency.dto.request.LoginRequest;
import com.example.travelagency.dto.request.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
    String login(LoginRequest request);
}
