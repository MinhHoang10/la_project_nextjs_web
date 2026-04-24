/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeServiceImpl.java, 4/24/2026 NguyenHuyHoang
 */
package com.luvina.la.service.impl;

import com.luvina.la.constant.AppConstants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.Certification;
import com.luvina.la.entity.Employee;
import com.luvina.la.entity.EmployeesCertifications;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.EmployeeRequest.CertificationRequest;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.EmployeesCertificationsRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Lớp triển khai các dịch vụ nghiệp vụ liên quan đến quản lý Nhân viên.
 * Thực hiện các thao tác:
 * - Tìm kiếm nhân viên (ADM002)
 * - Đếm số lượng nhân viên (ADM002)
 * - Lấy thông tin chi tiết nhân viên (ADM003)
 * - Thêm mới nhân viên (ADM004)
 * - Cập nhật thông tin nhân viên (ADM005) (Bổ sung sau)
 * 
 * @author Nguyen Huy Hoang
 */
@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    // ===== Các thành phần phụ thuộc (Dependencies) =====
    private final EmployeeRepository employeeRepository;
    private final EmployeesCertificationsRepository employeesCertificationsRepository;
    private final CertificationRepository certificationRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Khởi tạo Service với các Repository và công cụ mã hóa mật khẩu.
     */
    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            EmployeesCertificationsRepository employeesCertificationsRepository,
            CertificationRepository certificationRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.employeesCertificationsRepository = employeesCertificationsRepository;
        this.certificationRepository = certificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Lấy danh sách nhân viên có phân trang và sắp xếp đa cột (ADM002).
     * 
     * @param employeeName          Tên nhân viên cần tìm kiếm
     * @param departmentId          Mã phòng ban cần lọc
     * @param sortEmployeeName      Hướng sắp xếp theo tên nhân viên
     * @param sortCertificationName Hướng sắp xếp theo tên chứng chỉ
     * @param sortEndDate           Hướng sắp xếp theo ngày hết hạn
     * @param limit                 Số lượng bản ghi tối đa
     * @param offset                Vị trí bắt đầu lấy
     * @return Danh sách EmployeeDTO thỏa mãn điều kiện
     */
    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getListEmployee(
            String employeeName,
            Long departmentId,
            String sortEmployeeName,
            String sortCertificationName,
            String sortEndDate,
            Integer limit,
            Integer offset) {

        String nameFilter = escapeWildcards(employeeName);

        // Khởi tạo Sort đa cột bằng JpaSort để hỗ trợ alias trong SQL
        JpaSort sort = JpaSort.unsafe(
                AppConstants.SORT_DESC.equalsIgnoreCase(sortEmployeeName) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "employeeName");

        // Sắp xếp theo tên chứng chỉ (CertificationLevel)
        sort = sort.andUnsafe(
                AppConstants.SORT_DESC.equalsIgnoreCase(sortCertificationName) ? Sort.Direction.DESC
                        : Sort.Direction.ASC,
                "c.certificationLevel");

        // Sắp xếp theo ngày hết hạn (EndDate)
        sort = sort.andUnsafe(
                AppConstants.SORT_DESC.equalsIgnoreCase(sortEndDate) ? Sort.Direction.DESC : Sort.Direction.ASC,
                "ec.endDate");

        // Tạo Pageable để pagination
        Pageable pageable = PageRequest.of(offset / limit, limit, sort);

        // Gọi Repository để lấy dữ liệu
        return employeeRepository.findAllEmployeeDTO(nameFilter, departmentId, pageable);
    }

    /**
     * Đếm tổng số lượng nhân viên thỏa mãn bộ lọc tìm kiếm.
     * 
     * @param employeeName Tên nhân viên
     * @param departmentId Mã phòng ban
     * @return Tổng số lượng bản ghi
     */
    @Override
    @Transactional(readOnly = true)
    public Long countEmployeesWithFilter(String employeeName, Long departmentId) {
        String nameFilter = escapeWildcards(employeeName);
        return employeeRepository.countEmployeesWithFilter(nameFilter, departmentId);
    }

    /**
     * Lấy thông tin chi tiết nhân viên theo ID phục vụ màn hình chi tiết hoặc edit.
     * 
     * @param id Mã định danh nhân viên
     * @return EmployeeDTO chứa thông tin chi tiết
     */
    @Override
    @Transactional(readOnly = true)
    public EmployeeDTO getEmployeeById(Long id) {
        return employeeRepository.findEmployeeDTOById(id).orElse(null);
    }

    /**
     * Thực hiện thêm mới một nhân viên vào hệ thống.
     * 
     * @param request Dữ liệu từ form ADM004
     * @return ID của nhân viên vừa được tạo
     */
    @Override
    public Long addEmployee(EmployeeRequest request) {
        Employee employee = new Employee();
        mapRequestToEmployee(request, employee);

        // Mã hóa mật khẩu trước khi lưu trữ
        employee.setEmployeeLoginPassword(passwordEncoder.encode(request.getEmployeeLoginPassword()));
        employee.setEmployeeRole(0); // Vai trò mặc định cho nhân viên mới

        Employee savedEmployee = employeeRepository.save(employee);

        // Lưu danh sách chứng chỉ liên quan (nếu có)
        saveCertifications(savedEmployee, request.getCertifications());

        return savedEmployee.getEmployeeId();
    }

    /*
     * /**
     * Cập nhật thông tin nhân viên đã tồn tại (ADM005).
     *
     * @param id Mã định danh của nhân viên
     * 
     * @param request Dữ liệu form từ client
     */
    // @Override
    // public void updateEmployee(Long id, EmployeeRequest request) {
    // Employee employee = employeeRepository.findById(id)
    // .orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại,
    // id=" + id));

    // mapRequestToEmployee(request, employee);

    // if (request.getEmployeeLoginPassword() != null &&
    // !request.getEmployeeLoginPassword().isBlank()) {
    // employee.setEmployeeLoginPassword(passwordEncoder.encode(request.getEmployeeLoginPassword()));
    // }

    // Employee savedEmployee = employeeRepository.save(employee);

    // // Xóa các chứng chỉ cũ để cập nhật lại danh sách mới
    // employeesCertificationsRepository.deleteByEmployee(savedEmployee);
    // saveCertifications(savedEmployee, request.getCertifications());
    // }

    // ===== Các phương thức hỗ trợ nội bộ (Helper Methods) =====

    /**
     * Xử lý ký tự đặc biệt trong từ khóa tìm kiếm để tránh SQL Injection/Logic
     * Error.
     */
    private String escapeWildcards(String value) {
        if (value == null)
            return null;
        return value.replace("!", "!!").replace("%", "!%").replace("_", "!_");
    }

    /**
     * Mapping dữ liệu từ Request DTO sang Entity.
     */
    private void mapRequestToEmployee(EmployeeRequest request, Employee employee) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT);

        // Mapping thông tin nhân viên
        employee.setDepartmentId(request.getDepartmentId());
        employee.setEmployeeLoginId(request.getEmployeeLoginId());
        employee.setEmployeeName(request.getEmployeeName());
        employee.setEmployeeNameKana(request.getEmployeeNameKana());

        // Xử lý ngày sinh
        if (request.getEmployeeBirthDate() != null && !request.getEmployeeBirthDate().isEmpty()) {
            employee.setEmployeeBirthDate(LocalDate.parse(request.getEmployeeBirthDate(), dateFormatter));
        }

        // Mapping thông tin liên hệ
        employee.setEmployeeEmail(request.getEmployeeEmail());
        employee.setEmployeeTelephone(request.getEmployeeTelephone());
    }

    /**
     * Lưu trữ danh sách chứng chỉ ngoại ngữ của nhân viên.
     */
    private void saveCertifications(Employee employee, List<EmployeeRequest.CertificationRequest> certRequests) {

        // Nếu không có chứng chỉ thì return
        if (certRequests == null || certRequests.isEmpty())
            return;

        // Format ngày tháng
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT);

        // Duyệt qua từng chứng chỉ và lưu vào DB
        for (EmployeeRequest.CertificationRequest req : certRequests) {
            // Nếu không có certificationId thì continue
            if (req.getCertificationId() == null)
                continue;

            // Lấy thông tin chứng chỉ từ DB
            Certification certification = certificationRepository.findById(Long.parseLong(req.getCertificationId()))
                    .orElseThrow(() -> new IllegalArgumentException("Chứng chỉ không tồn tại"));

            // Tạo entity EmployeesCertifications
            EmployeesCertifications employeesCertification = new EmployeesCertifications();
            employeesCertification.setEmployee(employee);
            employeesCertification.setCertification(certification);

            // Xử lý ngày bắt đầu
            if (req.getCertificationStartDate() != null && !req.getCertificationStartDate().isEmpty()) {
                employeesCertification
                        .setStartDate(LocalDate.parse(req.getCertificationStartDate(), dateTimeFormatter));
            }
            // Xử lý ngày kết thúc
            if (req.getCertificationEndDate() != null && !req.getCertificationEndDate().isEmpty()) {
                employeesCertification.setEndDate(LocalDate.parse(req.getCertificationEndDate(), dateTimeFormatter));
            }
            // Xử lý điểm số
            if (req.getEmployeeCertificationScore() != null && !req.getEmployeeCertificationScore().isEmpty()) {
                employeesCertification.setScore(new BigDecimal(req.getEmployeeCertificationScore()));
            }

            employeesCertificationsRepository.save(employeesCertification);
        }
    }
}
