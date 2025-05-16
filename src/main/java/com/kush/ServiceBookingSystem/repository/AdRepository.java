package com.kush.ServiceBookingSystem.repository;

import com.kush.ServiceBookingSystem.entity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {


    List<Ad> findAllByUserId(Long userId);

    List<Ad> findAllByServiceNameContaining(String name);

    @Query(value = "SELECT * FROM ads ORDER BY id DESC LIMIT 8;", nativeQuery = true)
    List<Ad> LatestAdIds();

}
