package com.kush.ServiceBookingSystem.dto;

import java.util.List;

public class AdDetailsForClientDTO {
    private AdDTO adDTO;
    private List<ReviewDTO> reviewDTOList;

    // Getter & Setter for adDTO
    public AdDTO getAdDTO() {
        return adDTO;
    }

    public void setAdDTO(AdDTO adDTO) {
        this.adDTO = adDTO;
    }

    // Getter & Setter for reviewDTOList
    public List<ReviewDTO> getReviewDTOList() {
        return reviewDTOList;
    }

    public void setReviewDTOList(List<ReviewDTO> reviewDTOList) {
        this.reviewDTOList = reviewDTOList;
    }
}
