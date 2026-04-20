/**
 * Copyright(C) 2026 Luvina Software Company
 * DepartmentMapper.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.mapper;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import java.util.List;

/**
 * Bộ ánh xạ (Mapper) sử dụng MapStruct để chuyển đổi giữa Department Entity và DepartmentDTO.
 * 
 * @author Nguyen Huy Hoang
 */
@Mapper
public interface DepartmentMapper {
    /** Pattern Singleton gọi ra mapper phục vụ mapping */
    DepartmentMapper MAPPER = Mappers.getMapper(DepartmentMapper.class);

    /** Chuyển đổi từ Entity sang DTO */
    DepartmentDTO toDto(Department entity);
    
    /** Chuyển đổi Danh sách Entity sang Danh sách DTO */
    List<DepartmentDTO> toDtoList(List<Department> entities);
}
