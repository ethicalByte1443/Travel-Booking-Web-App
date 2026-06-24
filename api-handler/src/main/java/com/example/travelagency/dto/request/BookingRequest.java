package com.example.travelagency.dto.request;

import jakarta.validation.constraints.NotNull;

public class BookingRequest {
    @NotNull
    private Long tourId;

    public Long getTourId() { return tourId; }
    public void setTourId(Long tourId) { this.tourId = tourId; }
}
