package com.example.servicebookingsystem.service;

import com.example.servicebookingsystem.dto.ServiceRatingDTO;
import com.example.servicebookingsystem.entity.Service;
import com.example.servicebookingsystem.entity.Review;
import com.example.servicebookingsystem.repository.ServiceRepository;
import com.example.servicebookingsystem.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;


public class ServiceService {
    private static final Logger logger = LoggerFactory.getLogger(ServiceService.class);

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public List<Service> getServicesByMinRating(Double minRating) {
        return serviceRepository.findByRatingGreaterThanEqual(minRating);
    }

    public ServiceRatingDTO getServiceRating(Long serviceId) {
        try {
            logger.info("Getting rating for service: {}", serviceId);
            
            ServiceRatingDTO ratingDTO = new ServiceRatingDTO();
            ratingDTO.setServiceId(serviceId);

            // Lấy tất cả đánh giá của dịch vụ
            List<Review> reviews = reviewRepository.findByService_Id(serviceId);
            logger.info("Found {} reviews for service", reviews.size());
            
            if (reviews.isEmpty()) {
                ratingDTO.setRating(0.0);
                ratingDTO.setTotalReviews(0);
                return ratingDTO;
            }

            // Tính trung bình rating
            double totalRating = reviews.stream()
                    .mapToDouble(review -> review.getRating())
                    .sum();
            double averageRating = totalRating / reviews.size();

            // Làm tròn đến 1 chữ số thập phân
            averageRating = Math.round(averageRating * 10.0) / 10.0;
            logger.info("Calculated average rating: {}", averageRating);

            ratingDTO.setRating(averageRating);
            ratingDTO.setTotalReviews(reviews.size());

            return ratingDTO;
        } catch (Exception e) {
            logger.error("Error getting service rating: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get service rating", e);
        }
    }

    @Transactional
    public void updateServiceRating(Long serviceId) {
        try {
            logger.info("Updating rating for service: {}", serviceId);
            
            ServiceRatingDTO ratingDTO = getServiceRating(serviceId);
            Optional<Service> serviceOpt = serviceRepository.findById(serviceId);
            
            if (serviceOpt.isPresent()) {
                Service service = serviceOpt.get();
                service.setRating(ratingDTO.getRating());
                serviceRepository.save(service);
                logger.info("Service rating updated to: {}", ratingDTO.getRating());
            } else {
                logger.warn("Service not found with id: {}", serviceId);
            }
        } catch (Exception e) {
            logger.error("Error updating service rating: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update service rating", e);
        }
    }
} 