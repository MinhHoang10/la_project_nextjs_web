/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeDeleteResponse.java, 4/28/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;

import com.luvina.la.constant.AppConstants;

/**
 * Payload chứa dữ liệu trả về cho API Delete Employee.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDeleteResponse {
    private String code;
    private Long employeeId;
    private MessageResponse message;

    /**
     * Helper tạo response thành công
     */
    public static EmployeeDeleteResponse success(Long employeeId, String messageCode) {
        return new EmployeeDeleteResponse(
                AppConstants.SUCCESS_CODE,
                employeeId,
                new MessageResponse(messageCode, Collections.emptyList()));
    }

    /**
     * Helper tạo response thất bại
     */
    public static EmployeeDeleteResponse error(Long employeeId, MessageResponse message) {
        return new EmployeeDeleteResponse(
                AppConstants.SYSTEM_ERROR_CODE,
                employeeId,
                message);
    }
}
