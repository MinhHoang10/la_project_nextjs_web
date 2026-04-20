/**
 * Copyright(C) 2026 Luvina Software Company
 * Constant.java, 4/10/2026 NguyenHuyHoang
 */
package com.luvina.la.config;

/**
 * Lớp Constants lưu trữ tập trung các hằng số cấu hình của ứng dụng.
 * Được thiết kế theo mẫu Singleton (private constructor) để ngăn chặn việc khởi
 * tạo đối tượng.
 */
public class Constants {

        private Constants() {
                // Ngăn chặn khởi tạo instance từ bên ngoài
        }

        /** Môi trường phát triển cục bộ (Development) */
        public static final String SPRING_PROFILE_DEVELOPMENT = "dev";

        /** Môi trường máy chủ thực tế (Production) */
        public static final String SPRING_PROFILE_PRODUCTION = "prod";

        /** Cờ đánh dấu cấu hình cho phép gọi chéo miền (Cross-Origin CORS) */
        public static final boolean IS_CROSS_ALLOW = true;

        /** Khóa bí mật dùng để mã hóa thuật toán chữ ký JWT */
        public static final String JWT_SECRET = "Luvina-Academe";

        /**
         * Thời gian hết hạn của JWT Token.
         * Cấu hình hiện tại: 160 giờ
         */
        public static final long JWT_EXPIRATION = 160 * 60 * 60; // Tính bằng giây

        /**
         * Danh sách các đường dẫn (endpoints) công khai.
         * Mọi người dùng đều có thể truy cập mà không cần xác thực token.
         */
        public static final String[] ENDPOINTS_PUBLIC = new String[] {
                        "/",
                        "/login/**",
                        "/error/**"
        };

        /**
         * Danh sách các đường dẫn yêu cầu phân quyền mức ROLE_USER.
         * Bắt buộc có token chứa role hợp lệ mới có thể truy cập.
         */
        public static final String[] ENDPOINTS_WITH_ROLE = new String[] {
                        "/user/**"
        };

        /**
         * Các trường thông tin (claims/attributes) của người dùng sẽ được đưa vào nội
         * dung (payload) của token.
         */
        public static final String[] ATTRIBUTIES_TO_TOKEN = new String[] {
                        "employeeId",
                        "employeeName",
                        "employeeLoginId",
                        "employeeEmail"
        };
}
