package com.kush.ServiceBookingSystem.services.authentication;
import com.kush.ServiceBookingSystem.dto.SignUpRequestDTO;
import com.kush.ServiceBookingSystem.dto.UserDto;

public interface AuthService {
    UserDto signupClient(SignUpRequestDTO signUpRequestDTO);

    UserDto signupCompany(SignUpRequestDTO signUpRequestDTO);
    Boolean presentByEmail(String email);

    void resetPasswordWithOtp(String email, String otp, String newPassword);

    // Phương thức gửi OTP đến email c-*
    // `ủa người dùng
//    void forgotPassword(String email);
////
////    // Phương thức đặt lại mật khẩu dựa trên OTP
//    void resetPasswordWithOtp(String email, String otp, String newPassworm);
}