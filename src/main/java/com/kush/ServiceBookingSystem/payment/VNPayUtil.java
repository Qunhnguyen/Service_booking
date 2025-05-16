package com.kush.ServiceBookingSystem.payment;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class VNPayUtil {
    public static boolean isChecksumValid(Map<String, String> fields, String secureHash) {
        // ⚠️ Tạo TreeMap để tự động sắp xếp theo thứ tự key (a-z)
        Map<String, String> sorted = new TreeMap<>(fields);

        // ❌ Loại bỏ 2 trường không được tính vào chữ ký
        sorted.remove("vnp_SecureHashType");
        sorted.remove("vnp_SecureHash");

        // 🔐 Tạo chuỗi hashData theo format: key1=value1&key2=value2...
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : sorted.entrySet()) {
            hashData.append(entry.getKey())
                    .append('=')
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                    .append('&');
        }

        // ❗ Xóa dấu `&` cuối cùng
        if (hashData.length() > 0) {
            hashData.deleteCharAt(hashData.length() - 1);
        }

        // ✅ Tính hash sử dụng HMAC SHA512 với key bí mật
        String calculatedHash = hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());

        // 🧾 In log để debug nếu cần
        System.out.println(">>> [DEBUG] hashData: " + hashData);
        System.out.println(">>> [DEBUG] secureHash (VNPAY): " + secureHash);
        System.out.println(">>> [DEBUG] calculatedHash: " + calculatedHash);

        // ✅ So sánh chữ ký (không phân biệt hoa/thường)
        return calculatedHash.equalsIgnoreCase(secureHash);
    }

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKeySpec);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while generating HMAC SHA512", e);
        }
    }
    public static Map<String, String> getFieldsFromRequest(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String param = paramNames.nextElement();
            fields.put(param, request.getParameter(param));
        }
        return fields;
    }
}
