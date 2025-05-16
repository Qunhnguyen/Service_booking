package com.example.servicebookingsystem.dto;

import lombok.Data;

@Data
public class ServiceRatingDTO {
    private Long serviceId;
    private Double rating;
    private Integer totalReviews;
} 