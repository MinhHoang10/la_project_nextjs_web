/**
 * Copyright(C) 2026 Luvina Software Company
 * AuthEntryPoint.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * Lớp rào chắn xác thực, xử lý các phản hồi (response) khi có lỗi người dùng
 * chưa đăng nhập.
 * Bắt và trả về lỗi chuẩn 401 Unauthorized thay vì Exception stack trace.
 * 
 * @author Nguyen Huy Hoang
 */
public class AuthEntryPoint implements AuthenticationEntryPoint {

    private final Logger log = LoggerFactory.getLogger(this.getClass());
    private final MessageSource messageSource;

    public AuthEntryPoint(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Phương thức đánh chặn (interceptor) yêu cầu xác thực.
     * Xảy ra khi một người dùng (client) cố gắng truy cập vào một tài nguyên (URL)
     * được bảo vệ nhưng không có Token.
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        log.error("Lỗi xác thực (Unauthorized): {}", authException.getMessage());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, 
                messageSource != null ? messageSource.getMessage("err.auth.unauthorized", null, LocaleContextHolder.getLocale()) 
                                      : "Lỗi: Không có quyền truy cập (Unauthorized)");
    }
}
