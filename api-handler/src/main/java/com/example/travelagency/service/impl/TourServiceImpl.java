package com.example.travelagency.service.impl;

import com.example.travelagency.entity.Tour;
import com.example.travelagency.exception.ResourceNotFoundException;
import com.example.travelagency.repository.TourRepository;
import com.example.travelagency.service.TourService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;

    public TourServiceImpl(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    @Override
    public Tour create(Tour tour) { return tourRepository.save(tour); }

    @Override
    public Tour update(Long id, Tour tour) {
        Tour t = tourRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tour not found"));
        t.setTitle(tour.getTitle());
        t.setDescription(tour.getDescription());
        t.setLocation(tour.getLocation());
        t.setCategory(tour.getCategory());
        t.setPrice(tour.getPrice());
        return tourRepository.save(t);
    }

    @Override
    public void delete(Long id) { tourRepository.deleteById(id); }

    @Override
    public List<Tour> getAll() { return tourRepository.findAll(); }

    @Override
    public Tour getById(Long id) { return tourRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tour not found")); }

    @Override
    public List<Tour> search(String location, String category, BigDecimal min, BigDecimal max) {
        return tourRepository.search(location, category, min, max);
    }
}
