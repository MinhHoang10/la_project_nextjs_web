/**
 * Copyright(C) 2026 Luvina Software Company
 * CertificationServiceImpl.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.service.impl;

import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.mapper.CertificationMapper;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.service.CertificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Lớp cài đặt chi tiết (Implementation) của dịch vụ Certification.
 * Ủy quyền bằng annotation @Service để Spring Boot khởi tạo tự động.
 * 
 * @author Nguyen Huy Hoang
 */
@Service
@Transactional(readOnly = true)
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationServiceImpl(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    /**
     * Quét và mang về danh mục các chứng chỉ đang hiện hành.
     */
    @Override
    public List<CertificationDTO> getAllCertifications() {
        return CertificationMapper.MAPPER.toDtoList(certificationRepository.findAllOrderByLevel());
    }
}
