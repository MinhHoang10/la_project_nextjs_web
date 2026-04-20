/**
 * Copyright(C) 2026 Luvina Software Company
 * DefaultProfileUtil.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config;

import org.springframework.boot.SpringApplication;

import java.util.HashMap;
import java.util.Map;

/**
 * Lớp tiện ích quản lý Profile chạy mặc định của Spring Boot.
 * 
 * @author Nguyen Huy Hoang
 */
public class DefaultProfileUtil {

    private static final String SPRING_PROFILE_DEFAULT = "spring.profiles.default";

    private DefaultProfileUtil() {
        // Ngăn chặn khởi tạo instance
    }

    /**
     * Thiết lập profile cấu hình mặc định (dev) khi chưa có profile nào được chỉ định từ biến môi trường.
     * Cấu hình này không thể thiết lập qua file application.yml do Spring Boot xử lý.
     *
     * @param app Khởi tạo của SpringApplication
     */
    public static void addDefaultProfile(SpringApplication app) {
        Map<String, Object> defProperties = new HashMap<>();
        // Gán cấu hình chạy mặc định là 'dev'
        defProperties.put(SPRING_PROFILE_DEFAULT, Constants.SPRING_PROFILE_DEVELOPMENT);
        app.setDefaultProperties(defProperties);
    }
}
