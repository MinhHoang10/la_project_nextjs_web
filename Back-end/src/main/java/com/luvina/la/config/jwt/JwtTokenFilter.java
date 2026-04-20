/**
 * Copyright(C) 2026 Luvina Software Company
 * JwtTokenFilter.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config.jwt;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Bộ lọc tùy chỉnh chặn lại các Request được thực thi mỗi lần gọi API.
 * Đảm nhiệm việc bóc tách, đọc và xác thực chuỗi token trên Header HTTP (nếu có).
 * 
 * @author Nguyen Huy Hoang
 */
public class JwtTokenFilter extends OncePerRequestFilter {

    private final Logger log = LoggerFactory.getLogger(this.getClass());
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtTokenFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Phương thức xử lý luồng lọc request/response bên trong Servlet pipeline.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {

        try {
            String jwt = this.getJwtFromRequest(request);
            UsernamePasswordAuthenticationToken authentication = null;
            
            // Nếu có token và token chưa hết hạn/hợp lệ
            if (StringUtils.hasText(jwt) && this.tokenProvider.validateToken(jwt)) {

                // Kiểm tra User hiện tại có đang trong Spring Security Context chưa
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    String username = this.tokenProvider.getUsernameFromJWT(jwt);
                    UserDetails userDetail = this.userDetailsService.loadUserByUsername(username);

                    if (StringUtils.hasText(userDetail.getUsername())) { // Nếu user tồn tại trong hệ thống
                        // Set cờ đăng nhập Security thành công cho luồng này
                        authentication = new UsernamePasswordAuthenticationToken(userDetail, null, userDetail.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } else {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Lỗi do không thể thiết lập thông tin bảo mật của người dùng (authentication)", ex);
        }

        // Chuyển quyền đến các filter tiếp theo trong chuỗi
        chain.doFilter(request, response);
    }

    /**
     * Phương thức phụ trợ cắt chuỗi Token.
     * Bóc tách hậu tố của tiền tố Bearer trên Authorization header của Request tải lên.
     * @return Chuỗi token đã được làm sạch, hoặc null nếu không tồn tại.
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Kiểm tra Token trên Header xem có chứa định dạng 'Bearer ' không
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
            return bearerToken.substring(7); // Trả về lõi JWT từ vị trí sau chữ 'Bearer ' (thứ 7)
        }
        return null;
    }
}
