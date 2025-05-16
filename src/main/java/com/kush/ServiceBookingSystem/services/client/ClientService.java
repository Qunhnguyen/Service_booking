package com.kush.ServiceBookingSystem.services.client;

import com.kush.ServiceBookingSystem.dto.AdDTO;
import com.kush.ServiceBookingSystem.dto.AdDetailsForClientDTO;
import com.kush.ServiceBookingSystem.dto.ReservationDTO;
import com.kush.ServiceBookingSystem.dto.ReviewDTO;

import java.util.List;

public interface ClientService {
    List<AdDTO> getAllAds(String search, String category);
    List<AdDTO> searchAdByName(String name);
    boolean bookService (ReservationDTO reservationDTO);
    AdDetailsForClientDTO getAdDetailsByAdId(Long adId);
    List<ReservationDTO> getAllBookingsByUserId(Long userId);
    Boolean giveReview (ReviewDTO reviewDTO);
    Boolean deleteBooking(Long bookingId);
    List<AdDTO> getTop8AdsByReservationCount();
    List<AdDTO> getLatestAds();
    List<String> getAllCategories();

}
