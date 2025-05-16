package com.kush.ServiceBookingSystem.payment;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class VNPayController {

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO req, HttpServletRequest httpRequest) {
        try {
            String vnp_TxnRef = String.valueOf(System.currentTimeMillis());
            String vnp_IpAddr = httpRequest.getRemoteAddr();

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", "2.1.0");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(req.getAmount() * 100));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = sdf.format(cal.getTime());
            cal.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = sdf.format(cal.getTime());

            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (String name : fieldNames) {
                String value = vnp_Params.get(name);
                hashData.append(name).append("=").append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(name, StandardCharsets.US_ASCII)).append("=").append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                if (!name.equals(fieldNames.get(fieldNames.size() - 1))) {
                    hashData.append("&");
                    query.append("&");
                }
            }

            String vnp_SecureHash = VNPayUtil.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
            query.append("&vnp_SecureHash=").append(vnp_SecureHash);

            String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + query;
            return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi tạo URL thanh toán");
        }
    }
    @GetMapping("/return")
    public ResponseEntity<String> returnUrl(HttpServletRequest request) {
        Map<String, String> fields = VNPayUtil.getFieldsFromRequest(request);
        String secureHash = request.getParameter("vnp_SecureHash");

        // Kiểm tra tính hợp lệ của chữ ký
        if (VNPayUtil.isChecksumValid(fields, secureHash)) {
            String responseCode = request.getParameter("vnp_ResponseCode");

            if ("00".equals(responseCode)) {
                return ResponseEntity.ok("✅ Giao dịch thành công!");
            } else {
                return ResponseEntity.ok("❌ Giao dịch thất bại! Mã lỗi: " + responseCode);
            }

        } else {
            return ResponseEntity.status(400).body("❌ Chữ ký không hợp lệ! Có thể bị giả mạo dữ liệu.");
        }
    }
}

