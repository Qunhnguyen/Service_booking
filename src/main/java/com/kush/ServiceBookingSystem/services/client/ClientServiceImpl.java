package com.kush.ServiceBookingSystem.services.client;

import com.kush.ServiceBookingSystem.dto.AdDTO;
import com.kush.ServiceBookingSystem.dto.AdDetailsForClientDTO;
import com.kush.ServiceBookingSystem.dto.ReservationDTO;
import com.kush.ServiceBookingSystem.dto.ReviewDTO;
import com.kush.ServiceBookingSystem.entity.Reservation;
import com.kush.ServiceBookingSystem.entity.Review;
import com.kush.ServiceBookingSystem.entity.User;
import com.kush.ServiceBookingSystem.repository.AdRepository;
import com.kush.ServiceBookingSystem.repository.ResevationRepository;
import com.kush.ServiceBookingSystem.repository.ReviewRepository;
import com.kush.ServiceBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kush.ServiceBookingSystem.entity.Ad;
import com.kush.ServiceBookingSystem.enums.ReviewStatus;
import com.kush.ServiceBookingSystem.enums.ReservationStatus;

import java.text.Normalizer;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.time.LocalTime;
import java.time.ZoneId;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResevationRepository resevationRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<AdDTO> getAllAds(String search, String category) {
        List<Ad> ads = adRepository.findAll();

        if (search != null && !search.isEmpty()) {
            String searchLower = removeAccents(search.toLowerCase());
            ads = ads.stream()
                    .filter(ad -> removeAccents(ad.getServiceName().toLowerCase()).contains(searchLower)
                            || removeAccents(ad.getDescription().toLowerCase()).contains(searchLower))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.isEmpty()) {
            ads = ads.stream()
                    .filter(ad -> ad.getCategory() != null && ad.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        return ads.stream().map(this::convertToDTO).collect(Collectors.toList());
    }



    public List<AdDTO> searchAdByName(String name){
        return adRepository.findAllByServiceNameContaining(name).stream().map(Ad::getAdDto).collect(Collectors.toList());    }


    public boolean bookService (ReservationDTO reservationDTO){
        Optional<Ad> optionalAd = adRepository.findById(reservationDTO.getAdId());
        Optional<User> optionalUser = userRepository.findById(reservationDTO.getUserId());
        if(optionalAd.isPresent() && optionalUser.isPresent()){
            Reservation reservation = new Reservation();
            reservation.setBookDate(reservationDTO.getBookDate());
            
            // Handle bookTime
            if (reservationDTO.getBookTime() != null) {
                reservation.setBookTime(reservationDTO.getBookTime());
            } else if (reservationDTO.getBookDate() != null) {
                LocalTime time = reservationDTO.getBookDate().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalTime();
                reservation.setBookTime(time);
            }
            
            reservation.setMessage(reservationDTO.getMessage());
            reservation.setReservationStatus(ReservationStatus.PENDING);
            reservation.setUser(optionalUser.get());
            reservation.setAd(optionalAd.get());
            reservation.setCompany(optionalAd.get().getUser());
            reservation.setReviewStatus(ReviewStatus.FALSE);
            resevationRepository.save(reservation);
            return true;
        }
        return false;
    }
    public Boolean deleteBooking(Long bookingId) {
        Optional<Reservation> optionalBooking = resevationRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            resevationRepository.delete(optionalBooking.get());
            return true;
        }
        return false;
    }

    public AdDetailsForClientDTO getAdDetailsByAdId(Long adId){
        Optional<Ad> optionalAd = adRepository.findById(adId);
        AdDetailsForClientDTO adDetailsForClientDTO=new AdDetailsForClientDTO();
        if(optionalAd.isPresent()){
            adDetailsForClientDTO.setAdDTO(optionalAd.get().getAdDto());

            List<Review> reviewList = reviewRepository.findAllByAdId(adId);
            adDetailsForClientDTO.setReviewDTOList(reviewList.stream().map(Review::getDto).collect(Collectors.toList()));
        }
        return adDetailsForClientDTO;
    }

    @Override
    public List<AdDTO> getTop8AdsByReservationCount() {
        List<Ad> ads = adRepository.findAll(); // lấy toàn bộ không sắp xếp gì
        return ads.stream()
                .map(ad -> convertToDTO(ad)) // hàm map từ entity sang DTO
                .limit(8)
                .collect(Collectors.toList());
    }
    public List<AdDTO> getLatestAds() {

        return adRepository.LatestAdIds().stream().map(Ad::getAdDto).collect(Collectors.toList());

    }

    public List<ReservationDTO> getAllBookingsByUserId(Long userId){
        return resevationRepository.findAllByUserId(userId).stream().map(Reservation::getReservationDto).collect(Collectors.toList());
    }


    public Boolean giveReview (ReviewDTO reviewDTO) {
        Optional<User> optionalUser = userRepository.findById(reviewDTO.getUserId());
        Optional<Reservation> optionalBooking = resevationRepository.findById(reviewDTO.getBookId());
        if (optionalUser.isPresent() && optionalBooking.isPresent()){
            Review review = new Review();
            review.setReviewDate(new Date());
            review.setReview (reviewDTO.getReview());
            review.setRating (reviewDTO.getRating());

            review.setUser(optionalUser.get());
            review.setAd (optionalBooking.get().getAd());

            reviewRepository.save(review);

            Reservation booking = optionalBooking.get();
            booking.setReviewStatus (ReviewStatus.TRUE);

            resevationRepository.save(booking);
            return true;
        }
        return false;
    }
    @Override
    public List<String> getAllCategories() {
        return adRepository.findAll()
                .stream()
                .map(Ad::getCategory)
                .filter(Objects::nonNull) // <-- lọc bỏ các giá trị null
                .distinct()
                .collect(Collectors.toList());
    }
    private AdDTO convertToDTO(Ad ad) {
        AdDTO dto = new AdDTO();
        dto.setId(ad.getId());
        dto.setServiceName(ad.getServiceName());
        dto.setPrice(ad.getPrice());
        dto.setReturnedImg(ad.getImg()); // nếu img là byte[]
        dto.setCompanyName(ad.getUser() != null ? ad.getUser().getName() : null);
        return dto;
    }
    private String removeAccents(String input) {
        if (input == null) return null;
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").replaceAll("đ", "d").replaceAll("Đ", "D");
    }

}
