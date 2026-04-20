/**
 * Copyright(C) 2026 Luvina Software Company
 * MainApplication.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la;

import com.luvina.la.config.Constants;
import com.luvina.la.config.DefaultProfileUtil;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

/**
 * Lớp khởi chạy ứng dụng Spring Boot chính.
 * Mở rộng InitializingBean để tiến hành kiểm tra cấu hình khi khởi động.
 * 
 * @author Nguyen Huy Hoang
 */
@SpringBootApplication
public class MainApplication implements InitializingBean {

    private static final Logger log = LoggerFactory.getLogger(MainApplication.class);

    private final Environment env;

    public MainApplication(Environment env) {
        this.env = env;
    }

    /**
     * Phương thức được gọi tự động sau khi Spring hoàn tất việc Inject Bean properties.
     * Kiểm tra xem các profile chạy có bị xung đột không (VD: Chạy cả dev và prod cùng lúc).
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        if (activeProfiles.contains(Constants.SPRING_PROFILE_DEVELOPMENT)
                && activeProfiles.contains(Constants.SPRING_PROFILE_PRODUCTION)) {
            log.error("Bạn đang cấu hình sai phương thức chạy! Ứng dụng không thể chạy "
                    + "với cả hai biến môi trường 'dev' và 'prod' cùng lúc.");
        }
    }

    /**
     * Hàm chính khởi chạy luồng của ứng dụng Back-end.
     * @param args tham số dòng lệnh
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MainApplication.class);
        DefaultProfileUtil.addDefaultProfile(app);
        Environment env = app.run(args).getEnvironment();
        logApplicationStartup(env);
    }

    /**
     * Logic in ra Log đường link truy cập API để cho nhà phát triển tiện click vào mở trang
     * khi dự án Start thành công.
     * @param env môi trường Spring chứa các biến config
     */
    private static void logApplicationStartup(Environment env) {
        String protocol = "http";
        String serverPort = env.getProperty("server.port");
        String contextPath = env.getProperty("server.servlet.context-path");
        if (!StringUtils.hasText(contextPath)) {
            contextPath = "/";
        }
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.warn("Không xác định được hostname của máy, hệ thống tự lùi về fallback `localhost`");
        }
        String[] profile = env.getActiveProfiles();
        if (profile.length == 0) {
            profile = env.getDefaultProfiles();
        }

        String textBlock = """
                
                ----------------------------------------------------------
                Application '{}' is running! Access URLs:
                Local: \t\t{}://localhost:{}{}
                External: \t{}://{}:{}{}
                Profile(s): {}
                ----------------------------------------------------------
                
                """;

        log.info(textBlock, env.getProperty("spring.application.name"),
                protocol, serverPort, contextPath,
                protocol, hostAddress, serverPort, contextPath, profile);
    }
}
