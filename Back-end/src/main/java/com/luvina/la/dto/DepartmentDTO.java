/**
 * Copyright(C) 2026 Luvina Software Company
 * DepartmentDTO.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.dto;

import java.io.Serializable;
import lombok.Data;

/**
 * Lớp Truyền tải Dữ liệu (DTO) dùng cho danh sách phòng ban (グループ).
 * Trực tiếp ánh xạ dữ liệu trả về từ API GET /api/departments.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class DepartmentDTO implements Serializable {

    private static final long serialVersionUID = 3746291836401923745L;

    /** Khóa chính phòng ban */
    private Long departmentId;

    /** Tên phòng ban */
    private String departmentName;

}
