/**
 * Copyright(C) 2026 Luvina Software Company
 * CertificationService.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service;

import com.luvina.la.dto.CertificationDTO;
import java.util.List;

/**
 * Giao diện định nghĩa các dịch vụ (Service) cho chứng chỉ.
 * 
 * @author Nguyen Huy Hoang
 */
public interface CertificationService {
    
    /**
     * Dịch vụ lấy toàn bộ danh sách chứng chỉ tĩnh.
     * @return Danh sách DTO chứng chỉ
     */
    List<CertificationDTO> getAllCertifications();
}
