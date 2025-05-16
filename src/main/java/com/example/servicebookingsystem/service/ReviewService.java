package com.example.servicebookingsystem.service;

import com.example.servicebookingsystem.entity.Review;
import com.example.servicebookingsystem.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ServiceService serviceService;

    // ... các phương thức khác ...

    @Transactional
    public Review addReview(Review review) {
        try {
            logger.info("Adding review for service: {}", review.getService().getId());
            
            // Lưu review
            Review savedReview = reviewRepository.save(review);
            logger.info("Review saved successfully with id: {}", savedReview.getId());
            
            // Cập nhật rating của dịch vụ
            serviceService.updateServiceRating(review.getService().getId());
            logger.info("Service rating updated successfully");
            
            return savedReview;
        } catch (Exception e) {
            logger.error("Error adding review: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to add review", e);
        }
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        try {
            logger.info("Deleting review with id: {}", reviewId);
            
            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            
            Long serviceId = review.getService().getId();
            logger.info("Found review for service: {}", serviceId);
            
            // Xóa review
            reviewRepository.deleteById(reviewId);
            logger.info("Review deleted successfully");
            
            // Cập nhật lại rating sau khi xóa
            serviceService.updateServiceRating(serviceId);
            logger.info("Service rating updated after deletion");
        } catch (Exception e) {
            logger.error("Error deleting review: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete review", e);
        }
    }
} 