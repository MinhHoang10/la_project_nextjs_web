/**
 * Copyright(C) 2026 Luvina Software Company
 * ErrorUtils.java, 4/24/2026 NguyenHuyHoang
 */
package com.luvina.la.util;

import org.springframework.validation.BindingResult;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Lớp tiện ích hỗ trợ xây dựng cấu trúc lỗi trả về cho Frontend.
 * 
 * @author Nguyen Huy Hoang
 */
public class ErrorUtils {

    /**
     * Xây dựng một Map chứa lỗi với danh sách tham số biến thiên.
     * 
     * @param code   Mã lỗi (ERxxx)
     * @param params Các tham số bổ sung
     */
    public static Map<String, Object> buildError(String code, String... params) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("code", code);
        List<String> paramList = new ArrayList<>();
        if (params != null) {
            for (String p : params) {
                if (p != null)
                    paramList.add(p);
            }
        }
        error.put("params", paramList);
        return error;
    }
}
