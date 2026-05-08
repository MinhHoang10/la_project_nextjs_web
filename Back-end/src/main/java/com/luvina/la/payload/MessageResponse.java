/**
 * Copyright(C) 2026 Luvina Software Company
 * MessageResponse.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Đối tượng chứa thông tin thông báo
 * Cấu trúc: { code: String, params: List }
 * 
 * @author Nguyen Huy Hoang
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String code;
    private List<Object> params;

    /**
     * Tạo MessageResponse từ mã lỗi và danh sách tham số.
     * 
     * @param code   Mã lỗi
     * @param params Các tham số bổ sung cho thông điệp
     * @return Đối tượng MessageResponse
     */
    public static MessageResponse buildMessage(String code, Object... params) {
        return new MessageResponse(code, java.util.List.of(params));
    }
}
