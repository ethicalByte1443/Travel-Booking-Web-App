package com.example.travelagency.controller;

import com.example.travelagency.entity.Tour;
import com.example.travelagency.service.TourService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) { this.tourService = tourService; }

    @GetMapping
    public ResponseEntity<List<Tour>> getAll() { return ResponseEntity.ok(tourService.getAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getById(@PathVariable Long id) { return ResponseEntity.ok(tourService.getById(id)); }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_TRAVEL_AGENT')")
    public ResponseEntity<Tour> create(@Valid @RequestBody Tour tour) { return ResponseEntity.ok(tourService.create(tour)); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_TRAVEL_AGENT')")
    public ResponseEntity<Tour> update(@PathVariable Long id, @Valid @RequestBody Tour tour) { return ResponseEntity.ok(tourService.update(id, tour)); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_TRAVEL_AGENT')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        tourService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Tour>> search(@RequestParam(required = false) String location,
                                             @RequestParam(required = false) String category,
                                             @RequestParam(required = false) BigDecimal min,
                                             @RequestParam(required = false) BigDecimal max) {
        return ResponseEntity.ok(tourService.search(location, category, min, max));
    }
}
