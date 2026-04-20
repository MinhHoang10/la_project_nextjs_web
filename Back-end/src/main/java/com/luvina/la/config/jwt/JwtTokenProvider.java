/**
 * Copyright(C) 2026 Luvina Software Company
 * JwtTokenProvider.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.luvina.la.config.Constants;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Trình cung cấp tiện ích chuyên sinh và dịch ngược Token.
 * Sử dụng thư viện Auth0 sinh mã hóa HMAC512 bảo mật cao.
 * 
 * @author Nguyen Huy Hoang
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    /**
     * Tạo một Json Web Token dựa trên thông tin User. 
     * Thiết lập đính kèm thời gian sản xuất và hạn sử dụng của Token.
     */
    public String generateToken(AuthUserDetails userDetails) {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + Constants.JWT_EXPIRATION * 1000);

        return JWT.create()
                .withIssuer("self")
                .withIssuedAt(now)
                .withExpiresAt(expiryDate)
                .withSubject(userDetails.getEmployee().getEmployeeLoginId())
                .withClaim("employee", toMap(userDetails.getEmployee()))
                .sign(Algorithm.HMAC512(Constants.JWT_SECRET));
    }

    /**
     * Trích xuất object và lấy ra dữ liệu mong muốn được map ở cấu hình.
     * Sử dụng Reflection đệ quy nội quan.
     *
     * @param obj Thực thể Employee
     * @return Map trả về dạng JSON để đúc vào Payload JWT
     */
    private Map<String, Object> toMap(Object obj) {
        Map<String, Object> map = new HashMap<>();
        for (Field field : obj.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            if (Arrays.stream(Constants.ATTRIBUTIES_TO_TOKEN).anyMatch(field.getName()::equals)) {
                try {
                    map.put(field.getName(), field.get(obj));
                } catch (Exception e) {
                    // Cố tình bỏ qua các trường sai sót
                }
            }
        }
        return map;
    }

    /**
     * Thông dịch Token lấy ra Username (id người dùng gốc thiết lập tại withSubject lúc khởi tạo).
     *
     * @param token chuỗi token 
     * @return  Cấu trúc login id ứng viên
     */
    public String getUsernameFromJWT(String token) {
        return JWT.decode(token).getSubject();
    }

    /**
     * Hàm xác nhận hợp lệ của một chữ ký (ký bằng secret) và kiểm tra đã hết hạn chưa.
     *
     * @param authToken chuỗi mã JWT đang test
     * @return true = hợp lệ ; false = token bị giả mạo / hết hạn
     */
    public boolean validateToken(String authToken) {
        try {
            DecodedJWT token = JWT.require(Algorithm.HMAC512(Constants.JWT_SECRET)).build().verify(authToken);

            // Kiểm tra tính hiệu lực theo thời gian
            Date expireAt = token.getExpiresAt();
            if (expireAt.compareTo(new Date()) > 0) {
                return true;
            }
        } catch (JWTVerificationException ex) {
            log.error("Token JWT không khả dụng hoặc chữ ký bất hợp pháp!");
        }
        return false;
    }

}
