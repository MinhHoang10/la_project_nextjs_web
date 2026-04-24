/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeResponse.java, 4/23/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import lombok.Data;
import java.util.List;

/**
 * DTO phản hồi cho các thao tác trên nhân viên (Thêm, Sửa, Validate).
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class EmployeeResponse {

    /** Mã trạng thái phản hồi (200, 400, 500) */
    private String code;

    /** ID nhân viên (chỉ có khi thêm mới thành công) */
    private Long employeeId;

    /** Thông tin thông báo */
    private MessageResponse message;

    /**
     * Danh sách các thông báo lỗi (Dùng cho trường hợp validation có nhiều lỗi).
     */
    private List<MessageResponse> messages;

    /**
     * Khởi tạo phản hồi thành công.
     */
    public static EmployeeResponse success(String code, Long employeeId, MessageResponse message) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(code);
        response.setEmployeeId(employeeId);
        response.setMessage(message);
        return response;
    }

    /**
     * Khởi tạo phản hồi lỗi (Trường hợp 1 lỗi - System Error).
     */
    public static EmployeeResponse error(String code, MessageResponse message) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    /**
     * Khởi tạo phản hồi lỗi validation (Nhiều lỗi).
     */
    public static EmployeeResponse validationError(String code, List<MessageResponse> messages) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(code);
        response.setMessages(messages);
        // Lấy lỗi đầu tiên gán vào 'message'
        if (messages != null && !messages.isEmpty()) {
            response.setMessage(messages.get(0));
        }
        return response;
    }
}
