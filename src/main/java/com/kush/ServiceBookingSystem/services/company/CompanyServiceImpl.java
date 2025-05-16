package com.kush.ServiceBookingSystem.services.company;

import com.kush.ServiceBookingSystem.dto.AdDTO;
import com.kush.ServiceBookingSystem.dto.ReservationDTO;
import com.kush.ServiceBookingSystem.entity.Ad;
import com.kush.ServiceBookingSystem.entity.Reservation;
import com.kush.ServiceBookingSystem.entity.User;
import com.kush.ServiceBookingSystem.enums.ReservationStatus;
import com.kush.ServiceBookingSystem.repository.AdRepository;
import com.kush.ServiceBookingSystem.repository.ResevationRepository;
import com.kush.ServiceBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private ResevationRepository resevationRepository;

    public boolean postAd(Long userId, AdDTO adDTO) throws IOException {
        Optional<User> optionalUser = userRepository.findById(userId);
        if(optionalUser.isPresent()) {
            Ad ad=new Ad();
            ad.setServiceName(adDTO.getServiceName());
            ad.setDescription(adDTO.getDescription());
            ad.setImg(adDTO.getImg().getBytes());
            ad.setPrice(adDTO.getPrice());
            ad.setUser(optionalUser.get());

            adRepository.save(ad);
            return true;
        }
        return false;
    }

    public List<AdDTO> getAllAds(Long userId){
        return adRepository.findAllByUserId(userId).stream().map(Ad::getAdDto).collect(Collectors.toList());
    }

    public AdDTO getAdById(Long adId){
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if(optionalAd.isPresent()) {
            return optionalAd.get().getAdDto();
        }
        return null;
    }

    public boolean updateAd(Long adId,AdDTO adDTO) throws IOException {
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if(optionalAd.isPresent()) {
            Ad ad=optionalAd.get();
            ad.setServiceName(adDTO.getServiceName());
            ad.setDescription(adDTO.getDescription());
            ad.setPrice(adDTO.getPrice());

            if(adDTO.getImg()!=null) {
                ad.setImg(adDTO.getImg().getBytes());
            }

            adRepository.save(ad);
            return true;
        }else{
            return false;
        }
    }



    public boolean deleteAd(Long adId){
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if(optionalAd.isPresent()) {
            adRepository.delete(optionalAd.get());
            return true;
        }
        return false;
    }

    public List<ReservationDTO> getAllAdBookings(Long companyId){
        return resevationRepository.findAllByCompanyId(companyId).stream().map(Reservation::getReservationDto).collect(Collectors.toList());
    }

    public Boolean deleteBooking(Long bookingId) {
        Optional<Reservation> optionalBooking = resevationRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            resevationRepository.delete(optionalBooking.get());
            return true;
        }
        return false;
    }

    public boolean changeBookingStatus(Long bookingId,String status){
        Optional<Reservation> optionalReservation = resevationRepository.findById(bookingId);
        if(optionalReservation.isPresent()) {
            Reservation existingReservation=optionalReservation.get();
            if(Objects.equals(status,"Approve")){
                existingReservation.setReservationStatus(ReservationStatus.APPROVED);
            }else if(Objects.equals(status,"Reject")){
                existingReservation.setReservationStatus(ReservationStatus.REJECTED);
            }else if(Objects.equals(status,"Pending")){
                existingReservation.setReservationStatus(ReservationStatus.PENDING);
            }

            resevationRepository.save(existingReservation);
            return true;
        }
        return false;
    }
}
