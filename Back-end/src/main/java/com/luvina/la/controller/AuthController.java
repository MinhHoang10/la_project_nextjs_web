/**
 * Copyright(C) 2026 Luvina Software Company
 * AuthController.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.controller;

import com.luvina.la.config.jwt.AuthUserDetails;
import com.luvina.la.config.jwt.JwtTokenProvider;
import com.luvina.la.config.jwt.UserDetailsServiceImpl;
import com.luvina.la.payload.LoginRequest;
import com.luvina.la.payload.LoginResponse;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;
import com.luvina.la.constant.AppConstants;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * Controller chuyên trách xử lý thông tin Đăng nhập và Xác thực người dùng (Authentication).
 * 
 * @author Nguyen Huy Hoang
 */
@RestController
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    final JwtTokenProvider tokenProvider;
    final AuthenticationManager authenticationManager;
    final UserDetailsServiceImpl userDetailsService;
    final MessageSource messageSource;

    AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserDetailsServiceImpl userDetailsService, MessageSource messageSource) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
        this.messageSource = messageSource;
    }

    /**
     * API thực hiện xác thực thông tin đăng nhập từ màn hình Front-end cung cấp.
     * Cung cấp lại một chuỗi JWT Access Token dùng làm chìa khóa cho các request về sau.
     *
     * @param loginRequest Chứa username và password do người dùng submit
     * @param request Cấu trúc HTTP Request gốc tải lên
     * @return Chuỗi Json phản hồi (thành công chứa Bearer token, thất bại chứa List Errors)
     */
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        try {
            // Khởi tạo một phiên xác thực cục bộ
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            // Nếu qua ải kiểm định, nhét vào Spring Security Scope
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Nung token
            String accessToken = tokenProvider.generateToken((AuthUserDetails) authentication.getPrincipal());
            return new LoginResponse(accessToken);
            
        } catch (UsernameNotFoundException | BadCredentialsException ex) {
            log.warn(ex.getMessage());
            errors.put("code", AppConstants.LOGIN_FAILED_CODE); // Mã phụ báo hiệu sai username/password
            errors.put("message", messageSource.getMessage("err.login.failed", null, LocaleContextHolder.getLocale()));
        } catch (Exception ex) {
            log.warn(ex.getMessage());
            errors.put("code", AppConstants.LOGIN_UNKNOWN_CODE); // Mã phụ báo hiệu lỗi không xác định
            errors.put("message", messageSource.getMessage("err.login.unknown", null, LocaleContextHolder.getLocale()));
        }
        return new LoginResponse(errors);
    }

    /**
     * API bí mật dùng để gỡ rối, test thử xem Token hiện tại có vượt qua được cổng Auth không.
     * Yêu cầu gắn Token ở Header HTTP trước khi Request.
     *
     * @return Dòng trạng thái báo Token là có thực và còn hạn
     */
    @RequestMapping("/test-auth")
    public Map<String, String> testAuth() {
        Map<String, String> testData = new HashMap<>();
        testData.put("msg", messageSource.getMessage("msg.auth.test.valid", null, LocaleContextHolder.getLocale()));
        return testData;
    }
}
