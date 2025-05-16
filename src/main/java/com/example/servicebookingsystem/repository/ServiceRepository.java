package com.example.servicebookingsystem.repository;

import com.example.servicebookingsystem.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByRatingGreaterThanEqual(Double minRating);
} 