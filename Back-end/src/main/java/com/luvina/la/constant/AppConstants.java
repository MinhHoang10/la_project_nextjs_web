package com.luvina.la.constant;

/**
 * Lớp định nghĩa toàn bộ các hằng số dùng chung trong hệ thống.
 * Bao gồm: mã phản hồi, mã lỗi nghiệp vụ, hướng sắp xếp và cấu hình mặc định.
 * 
 * @author Nguyen Huy Hoang
 */
public class AppConstants {

    // ===== Mã trạng thái phản hồi API (HTTP-like status) =====
    public static final String SUCCESS_CODE = "200"; // Xử lý thành công
    public static final String SYSTEM_ERROR_CODE = "500"; // Lỗi hệ thống chưa xác định
    public static final String BAD_REQUEST_CODE = "400"; // Yêu cầu không hợp lệ (Dữ liệu đầu vào sai)

    // ===== Mã lỗi nghiệp vụ cho chức năng Nhân viên (ADM002) =====
    public static final String ER021 = "ER021"; // Tham số sắp xếp (Sort) không hợp lệ
    public static final String ER022 = "ER022"; // Vị trí bắt đầu (Offset) vượt quá tổng số bản ghi
    public static final String ER023 = "ER023"; // Lỗi ngoại lệ khi truy cập dữ liệu nhân viên

    // ===== Mã lỗi nghiệp vụ cho chức năng Đăng nhập (Login) =====
    public static final String LOGIN_FAILED_CODE = "100"; // Sai tên đăng nhập hoặc mật khẩu
    public static final String LOGIN_UNKNOWN_CODE = "000"; // Lỗi hệ thống phát sinh khi đăng nhập

    // ===== Hằng số điều khiển Phân trang và Sắp xếp =====
    public static final String SORT_ASC = "asc"; // Hướng sắp xếp tăng dần
    public static final String SORT_DESC = "desc"; // Hướng sắp xếp giảm dần
    public static final int DEFAULT_LIMIT = 20; // Số bản ghi mặc định trên mỗi trang (Số)
    public static final String DEFAULT_LIMIT_STR = "20"; // Số bản ghi mặc định trên mỗi trang (Chuỗi)

    /** Cấu trúc private để ngăn việc khởi tạo đối tượng hằng số */
    private AppConstants() {
        throw new UnsupportedOperationException("Đây là lớp hằng số, không thể khởi tạo đối tượng");
    }
}
