//package com.kush.ServiceBookingSystem.services.authentication;
//
//import com.kush.ServiceBookingSystem.dto.SignUpRequestDTO;
//import com.kush.ServiceBookingSystem.dto.UserDto;
//import com.kush.ServiceBookingSystem.entity.User;
//import com.kush.ServiceBookingSystem.enums.UserRole;
//import com.kush.ServiceBookingSystem.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthServiceImpl implements AuthService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public UserDto signupClient(SignUpRequestDTO signUpRequestDTO){
//        User user=new User();
//
//        user.setName(signUpRequestDTO.getName());
//        user.setLastname(signUpRequestDTO.getLastname());
//        user.setEmail(signUpRequestDTO.getEmail());
//        user.setPhone(signUpRequestDTO.getPhone());
//        user.setPassword(new BCryptPasswordEncoder().encode(signUpRequestDTO.getPassword()));
//        user.setRole(UserRole.CLIENT);
//
//        return userRepository.save(user).getDto();
//    }
//
//    public Boolean presentByEmail(String email){
//        return userRepository.findFirstByEmail(email) != null;
//    }
//
//    public UserDto signupCompany(SignUpRequestDTO signUpRequestDTO){
//        User user=new User();
//
//        user.setName(signUpRequestDTO.getName());
//        user.setEmail(signUpRequestDTO.getEmail());
//        user.setPhone(signUpRequestDTO.getPhone());
//        user.setPassword(new BCryptPasswordEncoder().encode(signUpRequestDTO.getPassword()));
//        user.setRole(UserRole.COMPANY);
//
//        return userRepository.save(user).getDto();
//    }
//}
package com.kush.ServiceBookingSystem.services.authentication;

import com.kush.ServiceBookingSystem.dto.SignUpRequestDTO;
import com.kush.ServiceBookingSystem.dto.UserDto;
import com.kush.ServiceBookingSystem.entity.User;
import com.kush.ServiceBookingSystem.enums.UserRole;
import com.kush.ServiceBookingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDto signupClient(SignUpRequestDTO signUpRequestDTO){
        User user = new User();
        user.setName(signUpRequestDTO.getName());
        user.setLastname(signUpRequestDTO.getLastname());
        user.setEmail(signUpRequestDTO.getEmail());
        user.setPhone(signUpRequestDTO.getPhone());
        user.setPassword(new BCryptPasswordEncoder().encode(signUpRequestDTO.getPassword()));
        user.setRole(UserRole.CLIENT);
        return userRepository.save(user).getDto();
    }

    @Override
    public Boolean presentByEmail(String email){
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public UserDto signupCompany(SignUpRequestDTO signUpRequestDTO){
        User user = new User();
        user.setName(signUpRequestDTO.getName());
        user.setEmail(signUpRequestDTO.getEmail());
        user.setPhone(signUpRequestDTO.getPhone());
        user.setPassword(new BCryptPasswordEncoder().encode(signUpRequestDTO.getPassword()));
        user.setRole(UserRole.COMPANY);
        return userRepository.save(user).getDto();
    }



    @Override
    public void resetPasswordWithOtp(String email, String otp, String newPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (!optionalUser.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = optionalUser.get();
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            throw new RuntimeException("OTP not generated for this user");
        }
        if (!user.getOtpCode().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        // Mã hoá mật khẩu mới trước khi lưu
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        // Xoá OTP sau khi reset mật khẩu thành công
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }


}


