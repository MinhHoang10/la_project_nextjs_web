/**
 * Copyright(C) 2026 Luvina Software Company
 * LoginResponse.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import java.util.HashMap;
import java.util.Map;
import lombok.Data;

/**
 * Lớp Payload đại diện định dạng dữ liệu đầu ra trả về phía người dùng (Front-end).
 * Cấu trúc Response xuất ra sau khi đăng nhập thành công hay thất bại.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class LoginResponse {

    /** Chìa khóa JWT dùng làm giấy thông hành */
    private String accessToken;
    
    /** Tiền tố gắn kèm với Token (thường là Bearer) */
    private String tokenType;
    
    /** Kho lưu trữ các báo lỗi từ Back-end định dạng Map key-value */
    private Map<String, String> errors = new HashMap<>();

    /**
     * Khởi tạo bản trả về nếu đăng nhập xác thực thành công lấy được Token.
     */
    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }

    /**
     * Khởi tạo bản tin rớt xác thực kèm một mảng lỗi định danh.
     */
    public LoginResponse(Map<String, String> errors) {
        this.errors = errors;
    }

}
