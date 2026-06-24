package com.example.travelagency.service;

import com.example.travelagency.dto.request.LoginRequest;
import com.example.travelagency.dto.request.RegisterRequest;
import com.example.travelagency.entity.Role;
import com.example.travelagency.entity.User;
import com.example.travelagency.repository.UserRepository;
import com.example.travelagency.security.JwtUtil;
import com.example.travelagency.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    UserRepository userRepository;
    @Mock
    BCryptPasswordEncoder passwordEncoder;
    @Mock
    AuthenticationManager authenticationManager;
    @Mock
    JwtUtil jwtUtil;

    AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthServiceImpl(userRepository, passwordEncoder, authenticationManager, jwtUtil);
    }

    @Test
    void registerSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test"); req.setEmail("t@example.com"); req.setPassword("secret");
        when(userRepository.existsByEmail("t@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret")).thenReturn("encoded");
        authService.register(req);
        ArgumentCaptor<User> cap = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(cap.capture());
        User saved = cap.getValue();
        assertEquals("t@example.com", saved.getEmail());
        assertEquals("encoded", saved.getPassword());
        assertTrue(saved.getRoles().size() > 0);
    }

    @Test
    void loginGeneratesToken() {
        LoginRequest req = new LoginRequest();
        req.setEmail("t2@example.com"); req.setPassword("pw");
        when(userRepository.findByEmail("t2@example.com")).thenReturn(Optional.of(new User(){
            { setEmail("t2@example.com"); setPassword("x"); setRoles(Set.of(Role.ROLE_CUSTOMER)); }
        }));
        when(jwtUtil.generateToken("t2@example.com")).thenReturn("token123");
        // authenticationManager.authenticate should return an Authentication (mocked)
        org.springframework.security.core.Authentication authMock = mock(org.springframework.security.core.Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
        String token = authService.login(req);
        assertEquals("token123", token);
    }
}
