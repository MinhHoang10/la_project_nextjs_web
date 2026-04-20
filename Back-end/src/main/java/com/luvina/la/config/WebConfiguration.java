/**
 * Copyright(C) 2026 Luvina Software Company
 * WebConfiguration.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.servlet.ServletContext;

/**
 * Lớp cấu hình Container cho ứng dụng Web. 
 * Thực thi giao diện ServletContextInitializer để mở rộng việc thiết lập Servlet lúc startup.
 * 
 * @author Nguyen Huy Hoang
 */
@Configuration
public class WebConfiguration implements ServletContextInitializer {
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    private final Environment env;

    WebConfiguration(Environment env) {
        this.env = env;
    }

    /**
     * Hàm được gọi tự động khi Servlet container biên dịch website lúc đang start app. 
     * Hỗ trợ in ra các log môi trường khởi chạy hợp lệ.
     */
    @Override
    public void onStartup(ServletContext servletContext) {
        if (env.getActiveProfiles().length != 0) {
            log.info("Cấu hình thiết lập App thành công, profile hiện tại: {}", (Object[]) env.getActiveProfiles());
        }
        log.info("App web đã khởi động xong vòng đời Servlet.");
    }
}
