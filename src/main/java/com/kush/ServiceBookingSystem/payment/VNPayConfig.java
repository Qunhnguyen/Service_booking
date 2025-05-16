package com.kush.ServiceBookingSystem.payment;

public class VNPayConfig {
    public static final String vnp_TmnCode = "NA2H82IT"; // Thay bằng mã thực nhận từ VNPay
    public static final String vnp_HashSecret = "2V68EZIC3F599A6S1YE35JMHE7IUXZ6N"; // Thay bằng secret key nhận từ VNPay
    public static final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String vnp_ReturnUrl = "https://b899-42-119-181-157.ngrok-free.app/api/payment/return";
}
