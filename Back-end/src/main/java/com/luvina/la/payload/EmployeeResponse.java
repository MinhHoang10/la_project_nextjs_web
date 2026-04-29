/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeResponse.java, 4/23/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import lombok.Data;
import java.util.List;

/**
 * DTO phản hồi thống nhất cho tất cả các thao tác trên nhân viên
 * (Thêm, Sửa, Validate, Xem chi tiết).
 *
 * @author Nguyen Huy Hoang
 */
@Data
public class EmployeeResponse {

    /** Mã trạng thái phản hồi (200, 400, 500) */
    private String code;

    /** ID nhân viên (chỉ có khi thêm mới / cập nhật thành công) */
    private Long employeeId;

    /** Thông tin thông báo (1 lỗi hoặc 1 thông báo thành công) */
    private MessageResponse message;

    /** Danh sách các thông báo lỗi (Dùng khi validation trả về nhiều lỗi). */
    private List<MessageResponse> messages;

    /** Dữ liệu chi tiết nhân viên (Dùng cho API GET /employee/{id}). */
    private EmployeeDetailResponse detail;

    /**
     * Khởi tạo phản hồi thành công (Thêm mới / Cập nhật).
     */
    public static EmployeeResponse success(String code, Long employeeId, MessageResponse message) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(code);
        response.setEmployeeId(employeeId);
        response.setMessage(message);
        return response;
    }

    /**
     * Khởi tạo phản hồi lỗi (Trường hợp 1 lỗi - System Error hoặc Logic Error).
     */
    public static EmployeeResponse error(String code, MessageResponse message) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    /**
     * Khởi tạo phản hồi lỗi validation (Nhiều lỗi cùng lúc).
     */
    public static EmployeeResponse validationError(String code, List<MessageResponse> messages) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(code);
        response.setMessages(messages);
        // Lấy lỗi đầu tiên gán vào 'message' để tương thích với frontend
        if (messages != null && !messages.isEmpty()) {
            response.setMessage(messages.get(0));
        }
        return response;
    }

    /**
     * Khởi tạo phản hồi chứa chi tiết nhân viên (GET /employee/{id}).
     */
    public static EmployeeResponse detail(String code, EmployeeDetailResponse detail) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(code);
        response.setDetail(detail);
        return response;
    }
}
