package com.example.travelagency.service;

import com.example.travelagency.entity.Tour;
import com.example.travelagency.exception.ResourceNotFoundException;
import com.example.travelagency.repository.TourRepository;
import com.example.travelagency.service.impl.TourServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TourServiceImplTest {

    @Mock
    TourRepository tourRepository;

    TourServiceImpl tourService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        tourService = new TourServiceImpl(tourRepository);
    }

    @Test
    void createAndGet() {
        Tour t = new Tour(); t.setTitle("A"); t.setPrice(new BigDecimal("10"));
        when(tourRepository.save(any())).thenReturn(t);
        Tour saved = tourService.create(t);
        assertEquals("A", saved.getTitle());
    }

    @Test
    void updateNonExistingThrows() {
        when(tourRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> tourService.update(1L, new Tour()));
    }
}
