/*
 * Copyright(C) 2010 Luvina Software Company
 * LogicException.java, 4/24/2026, NguyenHuyHoang
 */
package com.luvina.la.exception;

import lombok.Getter;

import java.util.List;

/**
 * Lớp xử lý lỗi nghiệp vụ (Logic).
 */
@Getter
public class LogicException extends RuntimeException {
    private final String errorCode;
    private final List<Object> params;

    public LogicException(String errorCode, List<Object> params) {
        super(errorCode);
        this.errorCode = errorCode;
        this.params = params;
    }
}
