package com.example.travelagency.service;

import com.example.travelagency.entity.Tour;

import java.math.BigDecimal;
import java.util.List;

public interface TourService {
    Tour create(Tour tour);
    Tour update(Long id, Tour tour);
    void delete(Long id);
    List<Tour> getAll();
    Tour getById(Long id);
    List<Tour> search(String location, String category, BigDecimal min, BigDecimal max);
}
