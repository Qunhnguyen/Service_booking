package com.kush.ServiceBookingSystem.repository;

import com.kush.ServiceBookingSystem.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResevationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findAllByCompanyId(Long companyId);

    List<Reservation> findAllByUserId(Long userId);

    @Query(value = "SELECT ad_id FROM reservation GROUP BY ad_id ORDER BY COUNT(ad_id) DESC LIMIT 8", nativeQuery = true)
    List<Long> findTop8AdIdsByCount();

}
