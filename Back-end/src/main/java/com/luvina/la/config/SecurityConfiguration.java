/**
 * Copyright(C) 2026 Luvina Software Company
 * SecurityConfiguration.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config;

import com.luvina.la.config.jwt.AuthEntryPoint;
import com.luvina.la.config.jwt.JwtTokenFilter;
import com.luvina.la.config.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.context.MessageSource;

/**
 * Lớp cấu hình bảo mật chính của ứng dụng bằng Spring Security.
 * Chứa cấu hình chuỗi bộ lọc (Filter Chain), Token provider và cơ chế xác thực CORS/CSRF.
 * 
 * @author Nguyen Huy Hoang
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final MessageSource messageSource;
    
    SecurityConfiguration(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService, MessageSource messageSource) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
        this.messageSource = messageSource;
    }

    /**
     * Đăng ký Bean bộ đánh chặn (Interceptor) Token Filter xử lý JWT auth trước mỗi Request.
     * @return JwtTokenFilter
     */
    @Bean
    public JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter(this.tokenProvider, this.userDetailsService);
    }

    /**
     * Quản lý tiến trình xử lý xác thực danh tính mặc định của Spring.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Trình mã hóa mật khẩu sử dụng chuỗi bảo mật BCrypt mạnh nhất hỗ trợ bởi Spring.
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Hàm cấu hình chuỗi vòng an ninh cho mọi request Http đi qua backend.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // Bật CORS và tắt CSRF vì hệ thống sử dụng jwt (stateless) không cần anti-csrf tokens.
        http.cors().and().csrf().disable();

        // Ứng dụng headers và tắt chặn iframe (hỗ trợ console database if any)
        http.headers().frameOptions().disable();

        // Chuyển session behavior sang STATELESS (Không lưu session trên RAM Server)
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Thiết lập phân quyền trên các Endpoint
        http.authorizeRequests(authz -> authz
                // Các đường dẫn chia sẻ (không cần token)
                .antMatchers(Constants.ENDPOINTS_PUBLIC).permitAll()
                // Các đường dẫn bị kiểm duyệt dưới quyền ROLE USER
                .antMatchers(Constants.ENDPOINTS_WITH_ROLE).hasRole("USER")
                // Các request khác bắt buộc có Authenticated state
                .anyRequest().authenticated()
        );

        // Khai báo handle xử lý ném lỗi chuẩn AuthEntryPoint nếu cố tình truy cập trái phép
        http.exceptionHandling().authenticationEntryPoint(new AuthEntryPoint(this.messageSource));

        // Đẩy Jwt Filter lên đứng chặn trước UsernameFilter mặc định để nhận token header.
        http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bộ lọc cấu hình danh sách domain, origin cho phép gọi xuyên suốt vào API (Fix lỗi CORS error Frontend).
     * Phụ thuộc vào cờ IS_CROSS_ALLOW bên lớp Constants.
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        if (Constants.IS_CROSS_ALLOW) {
            config.addAllowedOriginPattern("*");
        } else {
            config.addAllowedOrigin("*");
        }
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}
