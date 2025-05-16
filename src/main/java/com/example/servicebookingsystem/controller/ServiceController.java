package com.example.servicebookingsystem.controller;

import com.example.servicebookingsystem.dto.ServiceRatingDTO;
import com.example.servicebookingsystem.entity.Service;
import com.example.servicebookingsystem.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/ads")
public class ServiceController {
    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Service>> getServicesByRating(@RequestParam(required = false) Double minRating) {
        if (minRating != null) {
            return ResponseEntity.ok(serviceService.getServicesByMinRating(minRating));
        }
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping("/{serviceId}/rating")
    public ResponseEntity<ServiceRatingDTO> getServiceRating(@PathVariable Long serviceId) {
        ServiceRatingDTO ratingDTO = serviceService.getServiceRating(serviceId);
        return ResponseEntity.ok(ratingDTO);
    }

    @PutMapping("/{serviceId}/rating")
    public ResponseEntity<Void> updateServiceRating(@PathVariable Long serviceId) {
        serviceService.updateServiceRating(serviceId);
        return ResponseEntity.ok().build();
    }
} 