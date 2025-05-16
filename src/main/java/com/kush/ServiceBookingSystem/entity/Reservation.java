package com.kush.ServiceBookingSystem.entity;

import com.kush.ServiceBookingSystem.dto.ReservationDTO;
import com.kush.ServiceBookingSystem.enums.ReviewStatus;
import com.kush.ServiceBookingSystem.enums.ReservationStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.LocalTime;
import java.util.Date;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ReservationStatus reservationStatus;

    private ReviewStatus reviewStatus;

    private Date bookDate;
    @Column(name = "book_time")
    private LocalTime bookTime;

    private String message;

    @ManyToOne(fetch= FetchType.LAZY, optional=false)
    @JoinColumn(name="user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne(fetch= FetchType.LAZY, optional=false)
    @JoinColumn(name="company_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User company;

    @ManyToOne(fetch= FetchType.LAZY, optional=false)
    @JoinColumn(name="ad_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ad ad;

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public User getCompany() {
        return company;
    }
    public void setCompany(User company) {
        this.company = company;
    }

    public Ad getAd() {
        return ad;
    }
    public void setAd(Ad ad) {
        this.ad = ad;
    }

    // Convert to DTO
    public ReservationDTO getReservationDto() {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(id);
        dto.setServiceName(ad != null ? ad.getServiceName() : null);
        dto.setBookDate(bookDate);
        dto.setBookTime(bookTime);
        dto.setMessage(message);
        dto.setReservationStatus(reservationStatus);
        dto.setReviewStatus(reviewStatus);

        dto.setAdId(ad != null ? ad.getId() : null);
        dto.setCompanyId(company != null ? company.getId() : null);
        dto.setUserName(user != null ? user.getName() : null);

        return dto;
    }
}
