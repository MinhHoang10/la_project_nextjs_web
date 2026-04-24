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
}
