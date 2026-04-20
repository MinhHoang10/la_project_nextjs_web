/**
 * Copyright(C) 2026 Luvina Software Company
 * Department.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * Lớp Thực thể (Entity) đại diện cho bảng phòng ban 'departments' trong cơ sở dữ liệu.
 * 
 * @author Nguyen Huy Hoang
 */
@Entity
@Table(name = "departments")
@Data
public class Department implements Serializable {

    private static final long serialVersionUID = -2428678513524623108L;

    /** Khóa chính của phòng ban (Tăng tự động) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Long departmentId;

    /** Tên phòng ban */
    @Column(name = "department_name", length = 50, nullable = false)
    private String departmentName;

}
