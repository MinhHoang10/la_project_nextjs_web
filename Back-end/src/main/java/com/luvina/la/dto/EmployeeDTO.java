/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeDTO.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Đối tượng Truyền tải Dữ liệu (DTO) tổng hợp toàn bộ thông tin về Nhân viên.
 * Dùng để luân chuyển dữ liệu giữa các lớp (Controller, Service, Repository) 
 * và trả về kết quả cuối cùng cho phía Frontend.
 * 
 * @author Nguyen Huy Hoang
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO implements Serializable {

    private static final long serialVersionUID = 6868189362900231672L;

    // ===== Thông tin cơ bản của nhân viên =====

    /** Mã số định danh nhân viên (Khóa chính) */
    private Long employeeId;

    /** Tên tài khoản đăng nhập (Dùng để xác thực hệ thống) */
    private String employeeLoginId;

    /** Họ và tên hiển thị */
    private String employeeName;

    /** Họ tên phiên âm (Katakana) */
    private String employeeNameKana;

    /** Ngày tháng năm sinh */
    private LocalDate employeeBirthDate;

    /** Địa chỉ hòm thư điện tử */
    private String employeeEmail;

    /** Số điện thoại liên lạc */
    private String employeeTelephone;

    /** Mật khẩu truy cập (Thường chỉ dùng cho nghiệp vụ thêm/sửa, trả về rỗng khi lấy danh sách) */
    private String employeeLoginPassword;

    // ===== Thông tin về đơn vị công tác (Lấy từ bảng Departments) =====

    /** Mã số định danh phòng ban */
    private Long departmentId;

    /** Tên gọi của phòng ban/bộ phận */
    private String departmentName;

    // ===== Thông tin về chứng chỉ ngoại ngữ (Lấy từ bảng Certifications) =====

    /** Mã số chứng chỉ mà nhân viên đang sở hữu (Bảng trung gian) */
    private Long employeeCertificationId;

    /** Mã số định danh loại chứng chỉ */
    private Long certificationId;

    /** Tên loại chứng chỉ năng lực */
    private String certificationName;

    /** Ngày nhân viên bắt đầu được cấp chứng chỉ */
    private LocalDate certificationStartDate;

    /** Ngày chứng chỉ hết giá trị hiệu lực */
    private LocalDate certificationEndDate;

    /** Điểm số đạt được trong kỳ thi chứng chỉ */
    private BigDecimal certificationScore;

}
