/**
 * Copyright(C) 2026 Luvina Software Company
 * CertificationDTO.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.dto;

import java.io.Serializable;
import lombok.Data;

/**
 * Lớp Truyền tải Dữ liệu (DTO) dùng cho danh sách chứng chỉ tiếng Nhật (資格).
 * Trực tiếp ánh xạ dữ liệu trả về từ API GET /api/certifications.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
public class CertificationDTO implements Serializable {

    private static final long serialVersionUID = -9182736401923456789L;

    /** Khóa chính chứng chỉ */
    private Long certificationId;

    /** Tên chứng chỉ (vd: Trình độ tiếng nhật cấp 1) */
    private String certificationName;

    /**
     * Cấp độ chứng chỉ
     * 1 = N1 (cao nhất), 2 = N2, 3 = N3, 4 = N4, 5 = N5 (thấp nhất)
     */
    private Integer certificationLevel;

}
