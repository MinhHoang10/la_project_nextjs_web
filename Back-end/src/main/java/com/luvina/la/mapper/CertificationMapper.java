/**
 * Copyright(C) 2026 Luvina Software Company
 * CertificationMapper.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.mapper;

import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.entity.Certification;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import java.util.List;

/**
 * Bộ ánh xạ (Mapper) sử dụng MapStruct để chuyển đổi giữa Certification Entity và CertificationDTO.
 * 
 * @author Nguyen Huy Hoang
 */
@Mapper
public interface CertificationMapper {
    /** Pattern Singleton gọi ra mapper phục vụ mapping */
    CertificationMapper MAPPER = Mappers.getMapper(CertificationMapper.class);

    /** Chuyển đổi từ Entity sang DTO */
    CertificationDTO toDto(Certification entity);
    
    /** Chuyển đổi Danh sách Entity sang Danh sách DTO */
    List<CertificationDTO> toDtoList(List<Certification> entities);
}
