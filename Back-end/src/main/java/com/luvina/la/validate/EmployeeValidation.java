/**
 * Copyright(C) 2026 Luvina Software Company
 * ValidateParamDM002.java, 4/16/2026 NguyenHuyHoang
 */
package com.luvina.la.validate;

/**
 * Lớp tiện ích kiểm tra tính hợp lệ của các tham số dành cho bộ lọc màn hình
 * ADM002.
 * Giúp tập trung logic kiểm tra đầu vào, làm gọn mã nguồn trong Controller.
 * 
 * @author NguyenHuyHoang
 */
public class EmployeeValidation {

    /**
     * Kiểm tra xem tham số định hướng sắp xếp (Sort) có hợp lệ hay không.
     * Chỉ chấp nhận các giá trị tăng dần ("asc") hoặc giảm dần ("desc").
     * 
     * @param sort Giá trị sắp xếp nhận từ yêu cầu (Request)
     * @return true nếu giá trị hợp lệ hoặc trống, false nếu là giá trị không được
     *         phép
     */
    public static boolean isValidSort(String sort) {
        if (sort == null || sort.isEmpty()) {
            return true;
        }
        String val = sort.trim().toLowerCase();
        return "asc".equals(val) || "desc".equals(val);
    }

    /** Cấu trúc private để ngăn việc khởi tạo đối tượng lớp tiện ích */
    private EmployeeValidation() {
        throw new UnsupportedOperationException("Đây là lớp tiện ích, không thể khởi tạo đối tượng trực tiếp");
    }
}
