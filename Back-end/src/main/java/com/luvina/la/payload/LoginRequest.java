/**
 * Copyright(C) 2026 Luvina Software Company
 * LoginRequest.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import lombok.Data;
import javax.validation.constraints.NotBlank;

/**
 * Lớp Payload đại diện định dạng dữ liệu đầu vào.
 * Lắng nghe thông tin Account - Password khi có luồng POST đăng nhập nạp lên.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class LoginRequest {

    /** Tên đăng nhập của tài khoản người dùng */
    @NotBlank(message = "ER001")
    private String username;
    
    /** Mật khẩu truy cập dạng chuỗi của tài khoản */
    @NotBlank(message = "ER001")
    private String password;
}
