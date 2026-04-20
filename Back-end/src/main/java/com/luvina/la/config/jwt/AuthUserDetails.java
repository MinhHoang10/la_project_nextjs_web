/**
 * Copyright(C) 2026 Luvina Software Company
 * AuthUserDetails.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config.jwt;

import com.luvina.la.entity.Employee;
import java.util.Collection;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Lớp bọc thông tin người dùng được ủy quyền bởi quy chuẩn Spring Security.
 * Đóng gói đối tượng Employee hiện tại cùng các quyền (Roles) của họ trong phiên đăng nhập.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
@AllArgsConstructor
public class AuthUserDetails implements UserDetails {

    /** Biến thực thể đại diện cho bản ghi nhân viên lấy thẳng từ CSDL */
    Employee employee;
    
    /** Danh sách các quyền hạn hợp lệ hệ thống cấp cho nhân viên này */
    private Collection<GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return employee.getEmployeeLoginPassword();
    }

    @Override
    public String getUsername() {
        return employee.getEmployeeLoginId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
