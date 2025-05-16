package com.example.servicebookingsystem.repository;

import com.example.servicebookingsystem.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByService_Id(Long serviceId);
} 