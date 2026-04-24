/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeRepository.java, 4/13/2026 NguyenHuyHoang
 */
package com.luvina.la.repository;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.Employee;
import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Kho dữ liệu (Repository) quản lý thực thể nhân viên.
 * Cung cấp các phương thức truy vấn tùy chỉnh để hỗ trợ màn hình danh sách
 * (ADM002).
 * 
 * @author Nguyen Huy Hoang
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

       /**
        * Tìm kiếm thông tin nhân viên thông qua mã đăng nhập (Login ID).
        * Phục vụ cho quá trình xác thực người dùng (Authentication).
        * 
        * @param employeeLoginId Mã đăng nhập của nhân viên
        * @return Đối tượng Optional chứa thông tin nhân viên nếu tìm thấy
        */
       Optional<Employee> findByEmployeeLoginId(String employeeLoginId);

       /**
        * Tìm kiếm nhân viên có login id trùng nhưng khác id hiện tại (dùng cho
        * validate edit).
        */
       Optional<Employee> findByEmployeeLoginIdAndEmployeeIdNot(String employeeLoginId, Long employeeId);

       /**
        * Kiểm tra sự tồn tại của nhân viên theo Login ID.
        * 
        * @param employeeLoginId ID đăng nhập cần kiểm tra
        * @return true nếu đã tồn tại, ngược lại false
        */
       boolean existsByEmployeeLoginId(String employeeLoginId);

       /**
        * Đếm số lượng nhân viên thỏa mãn điều kiện lọc (ADM002).
        * Chỉ tính những nhân viên có vai trò là người dùng bình thường (userRole = 0).
        * 
        * @param employeeName Tên nhân viên cần tìm (hỗ trợ tìm kiếm tương đối)
        * @param departmentId Mã phòng ban cần lọc
        * @return Tổng số lượng bản ghi thỏa mãn
        */
       @Query("SELECT COUNT(e) FROM Employee e " +
                     "LEFT JOIN e.department d " +
                     "WHERE e.employeeRole = 0 " +
                     "AND (:employeeName IS NULL OR :employeeName = '' OR LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :employeeName, '%')) ESCAPE '!') "
                     +
                     "AND (:departmentId IS NULL OR d.departmentId = :departmentId)")
       Long countEmployeesWithFilter(
                     @Param("employeeName") String employeeName,
                     @Param("departmentId") Long departmentId);

       /**
        * Truy vấn danh sách nhân viên kết hợp phân trang và sắp xếp động.
        * Sử dụng kỹ thuật "Constructor Projection" để ánh xạ trực tiếp kết quả vào
        * EmployeeDTO,
        * giúp tối ưu hiệu năng bằng cách chỉ lấy đúng các trường cần thiết.
        * 
        * @param employeeName Tên nhân viên cần tìm
        * @param departmentId Mã phòng ban cần lọc
        * @param pageable     Đối tượng điều khiển phân trang và sắp xếp từ Spring Data
        * @return Danh sách các DTO chứa thông tin nhân viên tổng hợp
        */
       @Query("SELECT new com.luvina.la.dto.EmployeeDTO(" +
                     "e.employeeId, e.employeeLoginId, e.employeeName, e.employeeNameKana, e.employeeBirthDate, e.employeeEmail, e.employeeTelephone, e.employeeLoginPassword, "
                     +
                     "d.departmentId, d.departmentName, " +
                     "ec.employeeCertificationId, c.certificationId, c.certificationName, ec.startDate, ec.endDate, ec.score) "
                     +
                     "FROM Employee e " +
                     "LEFT JOIN e.department d " +
                     "LEFT JOIN e.employeesCertifications ec " +
                     "LEFT JOIN ec.certification c " +
                     "WHERE e.employeeRole = 0 " +
                     "AND (:employeeName IS NULL OR :employeeName = '' OR LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :employeeName, '%')) ESCAPE '!') "
                     +
                     "AND (:departmentId IS NULL OR d.departmentId = :departmentId)")
       List<EmployeeDTO> findAllEmployeeDTO(
                     @Param("employeeName") String employeeName,
                     @Param("departmentId") Long departmentId,
                     Pageable pageable);

       /**
        * Truy vấn thông tin chi tiết của 1 nhân viên theo ID, đổ thẳng vào DTO
        * bằng kỹ thuật Constructor Projection.
        * 
        * @param id Mã định danh của nhân viên
        * @return DTO chứa thông tin chi tiết nhân viên
        */
       @Query("SELECT new com.luvina.la.dto.EmployeeDTO(" +
                     "e.employeeId, e.employeeLoginId, e.employeeName, e.employeeNameKana, e.employeeBirthDate, e.employeeEmail, e.employeeTelephone, e.employeeLoginPassword, "
                     +
                     "d.departmentId, d.departmentName, " +
                     "ec.employeeCertificationId, c.certificationId, c.certificationName, ec.startDate, ec.endDate, ec.score) "
                     +
                     "FROM Employee e " +
                     "LEFT JOIN e.department d " +
                     "LEFT JOIN e.employeesCertifications ec " +
                     "LEFT JOIN ec.certification c " +
                     "WHERE e.employeeId = :id")
       Optional<EmployeeDTO> findEmployeeDTOById(@Param("id") Long id);
}
