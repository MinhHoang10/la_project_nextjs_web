/**
 * Copyright(C) 2026 Luvina Software Company
 * CertificationService.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service;

import com.luvina.la.dto.CertificationDTO;
import java.util.List;

/**
 * Giao diện định nghĩa các service cho chứng chỉ.
 * 
 * @author Nguyen Huy Hoang
 */
public interface CertificationService {

    /**
     * Lấy toàn bộ danh sách chứng chỉ.
     * 
     * @return Danh sách DTO chứng chỉ
     */
    List<CertificationDTO> getAllCertifications();
}
