/**
 * Copyright(C) 2026 Luvina Software Company
 * Employee.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;

/**
 * Lớp Thực thể (Entity) đại diện cho bảng nhân viên 'employees' trong cơ sở dữ liệu.
 * 
 * @author Nguyen Huy Hoang
 */
@Entity
@Table(name = "employees")
@Data
public class Employee implements Serializable {

    private static final long serialVersionUID = 5771173953267484096L;

    /** Khóa chính của nhân viên (Tăng tự động) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id", unique = true)
    private Long employeeId;

    /** Đối tượng Map chứa thông tin bảng phòng ban liên kết khóa ngoại n-1 */
    @ManyToOne
    @JoinColumn(name = "department_id", insertable = false, updatable = false)
    private Department department;

    /** Mã phòng ban trực thuộc */
    @Column(name = "department_id")
    private Long departmentId;

    /** Danh sách các chứng chỉ liên kết khóa ngoại 1-n của người nhân viên này */
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<EmployeesCertifications> employeesCertifications;

    /** Tên nhân viên */
    @Column(name = "employee_name")
    private String employeeName;

    /** Tên nhân viên phiên âm theo Katakana */
    @Column(name = "employee_name_kana")
    private String employeeNameKana;

    /** Ngày tháng năm sinh của nhân viên */
    @Column(name = "employee_birth_date")
    private LocalDate employeeBirthDate;

    /** Địa chỉ hòm thư email */
    @Column(name = "employee_email")
    private String employeeEmail;

    /** Số điện thoại liên lạc */
    @Column(name = "employee_telephone")
    private String employeeTelephone;

    /** Tên đăng nhập vào hệ thống */
    @Column(name = "employee_login_id")
    private String employeeLoginId;

    /** Mật khẩu đã được mã hóa BCrypt */
    @Column(name = "employee_login_password")
    private String employeeLoginPassword;

    /** Phân quyền tài khoản (0: Nhân viên, 1: Quản trị viên) */
    @Column(name = "employee_role")
    private Integer employeeRole;

}
