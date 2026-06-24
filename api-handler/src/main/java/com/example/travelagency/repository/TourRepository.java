package com.example.travelagency.repository;

import com.example.travelagency.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByLocationContainingIgnoreCase(String location);
    List<Tour> findByCategoryContainingIgnoreCase(String category);
    List<Tour> findByPriceBetween(BigDecimal min, BigDecimal max);

    @Query("SELECT t FROM Tour t WHERE (:location IS NULL OR lower(t.location) LIKE lower(concat('%',:location,'%'))) AND (:category IS NULL OR lower(t.category) LIKE lower(concat('%',:category,'%'))) AND (:min IS NULL OR t.price >= :min) AND (:max IS NULL OR t.price <= :max)")
    List<Tour> search(@Param("location") String location, @Param("category") String category, @Param("min") BigDecimal min, @Param("max") BigDecimal max);
}
