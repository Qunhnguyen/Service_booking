package com.kush.ServiceBookingSystem.dto;

import com.kush.ServiceBookingSystem.enums.ReservationStatus;
import com.kush.ServiceBookingSystem.enums.ReviewStatus;

import java.time.LocalTime;
import java.util.Date;


public class ReservationDTO {

    private Long id;
    private Date bookDate;
    private LocalTime bookTime;
    private String message;
    private String serviceName;
    private ReservationStatus reservationStatus;
    private ReviewStatus reviewStatus;
    private Long userId;
    private String userName;
    private Long companyId;
    private Long adId;

    // Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Date getBookDate() {
        return bookDate;
    }
    public void setBookDate(Date bookDate) {
        this.bookDate = bookDate;
    }

    public LocalTime getBookTime() {
        return bookTime;
    }

    public void setBookTime(LocalTime bookTime) {
        this.bookTime = bookTime;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public String getServiceName() {
        return serviceName;
    }
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public ReservationStatus getReservationStatus() {
        return reservationStatus;
    }
    public void setReservationStatus(ReservationStatus reservationStatus) {
        this.reservationStatus = reservationStatus;
    }

    public ReviewStatus getReviewStatus() {
        return reviewStatus;
    }
    public void setReviewStatus(ReviewStatus reviewStatus) {
        this.reviewStatus = reviewStatus;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getCompanyId() {
        return companyId;
    }
    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getAdId() {
        return adId;
    }
    public void setAdId(Long adId) {
        this.adId = adId;
    }
}
