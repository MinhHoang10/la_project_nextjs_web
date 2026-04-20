/**
 * Copyright(C) 2010 Luvina Software Company
 * EmployeeListResponse.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

/**
 * Đối tượng bao bọc dữ liệu phản hồi (Response Wrapper) cho API danh sách nhân
 * viên.
 * Giúp chuẩn hóa cấu hình JSON trả về cho Frontend, bao gồm cả trường hợp thành
 * công và lỗi.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class EmployeeListResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Mã trạng thái phản hồi (Ví dụ: "200" cho thành công, "ERxxx" cho lỗi nghiệp
     * vụ)
     */
    private String code;

    /**
     * Tổng số lượng bản ghi tìm thấy trong Database (dùng để tính toán phân trang ở
     * UI)
     */
    private Long totalRecords;

    /** Thông điệp thông báo người dùng (đã được xử lý đa ngôn ngữ) */
    private String message;

    /**
     * Danh sách các tham số động để điền vào thông điệp lỗi (Ví dụ: tên trường vi
     * phạm)
     */
    private List<String> params;

    /** Danh sách các đối tượng nhân viên chứa dữ liệu hiển thị trên bảng */
    private List<EmployeeDTO> employees;

    /**
     * Phương thức khởi tạo nhanh một đối tượng phản hồi lỗi.
     * Đảm bảo các trường bổ trợ luôn được khởi tạo đúng định dạng.
     * 
     * @param code    Mã lỗi quy định trong AppConstants
     * @param message Nội dung lỗi chi tiết đã được dịch sang ngôn ngữ người dùng
     * @return Đối tượng response mang thông tin lỗi
     */
    public static EmployeeListResponse error(String code, String message) {
        EmployeeListResponse response = new EmployeeListResponse();
        response.setCode(code);
        response.setMessage(message);
        response.setParams(new ArrayList<>()); // Trả về mảng rỗng [] thay vì null để tránh lỗi Frontend
        return response;
    }
}
