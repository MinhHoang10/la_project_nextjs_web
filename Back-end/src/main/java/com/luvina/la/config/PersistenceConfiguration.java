/**
 * Copyright(C) 2026 Luvina Software Company
 * PersistenceConfiguration.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Lớp cấu hình kết nối Cơ sở dữ liệu và Persistence context.
 * Quản lý Hikari connection pool và quy định đường dẫn truy cập các bean Repository, Entity.
 * 
 * @author Nguyen Huy Hoang
 */
@Configuration
@ComponentScan({"com.luvina.la"})
@EntityScan("com.luvina.la.entity")
@EnableJpaRepositories("com.luvina.la.repository")
@ConfigurationProperties("spring.datasource")
public class PersistenceConfiguration extends HikariConfig {

    private final Environment env;

    PersistenceConfiguration(Environment env) {
        this.env = env;
    }

    /**
     * Khởi tạo Data Source pool bằng thư viện HikariCP.
     * Tự động tắt tính năng Auto-Commit để Spring Data JPA quản lý Transaction đúng luồng.
     * @return DataSource object chứa các session kết nối CSDL
     */
    @Bean
    DataSource dataSource() {
        this.setAutoCommit(false);
        return new HikariDataSource(this);
    }
}
