/*
 * Copyright(C) 2010 Luvina Software Company
 * ValidationExceptionHandler.java, 4/24/2026, NguyenHuyHoang
 */
package com.luvina.la.exception;

import com.luvina.la.constant.AppConstants;
import com.luvina.la.payload.EmployeeResponse;
import com.luvina.la.payload.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;

/**
 * Lớp xử lý ngoại lệ toàn cục.
 * Đảm nhận xử lý các lỗi không mong muốn.
 */
@RestControllerAdvice
public class ValidationExceptionHandler {

    /**
     * Trình xử lý lỗi hệ thống toàn cục.
     * Bắt mọi Exception chưa được xử lý và trả về HTTP 500 với mã ER015.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<EmployeeResponse> handleAllExceptions(Exception ex) {
        MessageResponse msg = new MessageResponse(AppConstants.SYSTEM_ERROR_CODE, new ArrayList<>());

        // Trả về HTTP 500 với mã ER015
        return new ResponseEntity<>(
                EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, msg),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
