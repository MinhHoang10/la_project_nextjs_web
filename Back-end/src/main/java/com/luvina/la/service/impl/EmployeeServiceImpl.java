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
import com.luvina.la.exception.LogicException;
import com.luvina.la.payload.EmployeeDetailResponse;
import com.luvina.la.payload.EmployeeRequest;
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
 * - Cập nhật thông tin nhân viên (ADM005)
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
     * Lấy danh sách nhân viên có phân trang và sắp xếp cột (ADM002).
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
     * Lấy thông tin chi tiết nhân viên (ADM003).
     * 
     * @param id Mã định danh nhân viên
     * @return EmployeeDetailResponse chứa thông tin chi tiết
     */
    @Override
    @Transactional(readOnly = true)
    public EmployeeDetailResponse getEmployeeDetailById(Long id) {
        if (id == null)
            return null;
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee == null || employee.getEmployeeRole() != 0) {
            return null;
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT);

        // Tạo response
        EmployeeDetailResponse response = new EmployeeDetailResponse();
        response.setCode(Integer.parseInt(AppConstants.SUCCESS_CODE));
        response.setEmployeeId(employee.getEmployeeId());
        response.setEmployeeName(employee.getEmployeeName());
        response.setEmployeeBirthDate(
                employee.getEmployeeBirthDate() != null ? employee.getEmployeeBirthDate().format(dateFormatter) : null);
        response.setDepartmentId(employee.getDepartmentId());
        response.setDepartmentName(
                employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : null);
        response.setEmployeeEmail(employee.getEmployeeEmail());
        response.setEmployeeTelephone(employee.getEmployeeTelephone());
        response.setEmployeeNameKana(employee.getEmployeeNameKana());
        response.setEmployeeLoginId(employee.getEmployeeLoginId());

        // Lấy danh sách chứng chỉ và sắp xếp theo certificationLevel ASC
        List<EmployeeDetailResponse.CertificationDetail> certificationDetails = new java.util.ArrayList<>();
        if (employee.getEmployeesCertifications() != null && !employee.getEmployeesCertifications().isEmpty()) {
            List<EmployeesCertifications> certifications = new java.util.ArrayList<>(
                    employee.getEmployeesCertifications());
            certifications.sort((a, b) -> Integer.compare(
                    a.getCertification().getCertificationLevel(),
                    b.getCertification().getCertificationLevel()));

            // Tạo danh sách chi tiết chứng chỉ và sắp xếp theo certificationLevel ASC
            for (EmployeesCertifications employeeCertification : certifications) {
                EmployeeDetailResponse.CertificationDetail certificationDetail = new EmployeeDetailResponse.CertificationDetail();
                certificationDetail.setCertificationId(employeeCertification.getCertification().getCertificationId());
                certificationDetail
                        .setCertificationName(employeeCertification.getCertification().getCertificationName());
                certificationDetail.setStartDate(employeeCertification.getStartDate() != null
                        ? employeeCertification.getStartDate().format(dateFormatter)
                        : null);
                certificationDetail.setEndDate(employeeCertification.getEndDate() != null
                        ? employeeCertification.getEndDate().format(dateFormatter)
                        : null);
                certificationDetail.setScore(employeeCertification.getScore());
                certificationDetails.add(certificationDetail);
            }
        }
        response.setCertifications(certificationDetails);

        return response;
    }

    /**
     * Thực hiện thêm mới một nhân viên vào hệ thống.
     * 
     * @param request Dữ liệu từ form ADM004
     * @return ID của nhân viên vừa được tạo
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addEmployee(EmployeeRequest request) {
        Employee employee = new Employee();
        mapRequestToEmployee(request, employee);

        // Mã hóa mật khẩu trước khi lưu trữ
        employee.setEmployeeLoginPassword(passwordEncoder.encode(request.getEmployeeLoginPassword()));
        employee.setEmployeeRole(0); // Vai trò mặc định cho nhân viên mới

        Employee inputEmployee = employeeRepository.save(employee);

        // Lưu danh sách chứng chỉ liên quan (nếu có)
        List<EmployeeRequest.CertificationRequest> certificationRequests = request.getCertifications();
        if (certificationRequests != null && !certificationRequests.isEmpty()) {
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT);
            for (EmployeeRequest.CertificationRequest certificationRequest : certificationRequests) {
                // Nếu không có certificationId thì bỏ qua
                if (certificationRequest.getCertificationId() == null)
                    continue;

                // Lấy thông tin chứng chỉ từ DB
                Certification certification = certificationRepository
                        .findById(Long.parseLong(certificationRequest.getCertificationId()))
                        .orElseThrow(() -> new IllegalArgumentException("Chứng chỉ không tồn tại"));

                // Tạo entity EmployeesCertifications
                EmployeesCertifications employeesCertification = new EmployeesCertifications();
                employeesCertification.setEmployee(inputEmployee);
                employeesCertification.setCertification(certification);

                // Xử lý ngày bắt đầu
                if (certificationRequest.getCertificationStartDate() != null
                        && !certificationRequest.getCertificationStartDate().isEmpty()) {
                    employeesCertification
                            .setStartDate(LocalDate.parse(certificationRequest.getCertificationStartDate(),
                                    dateTimeFormatter));
                }
                // Xử lý ngày kết thúc
                if (certificationRequest.getCertificationEndDate() != null
                        && !certificationRequest.getCertificationEndDate().isEmpty()) {
                    employeesCertification.setEndDate(LocalDate.parse(certificationRequest.getCertificationEndDate(),
                            dateTimeFormatter));
                }
                // Xử lý điểm số
                if (certificationRequest.getEmployeeCertificationScore() != null
                        && !certificationRequest.getEmployeeCertificationScore().isEmpty()) {
                    employeesCertification
                            .setScore(new BigDecimal(certificationRequest.getEmployeeCertificationScore()));
                }

                employeesCertificationsRepository.save(employeesCertification);
            }
        }

        return inputEmployee.getEmployeeId();
    }

    /**
     * Cập nhật thông tin nhân viên trong hệ thống (ADM004).
     *
     * @param request Dữ liệu form từ client (đã qua bước validate)
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void editEmployee(EmployeeRequest request) {
        Long empId = request.getEmployeeId();
        if (empId == null) {
            throw new LogicException(AppConstants.ER013, java.util.Arrays.asList(" I D "));
        }

        // Tìm nhân viên hiện tại
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new LogicException(AppConstants.ER013, java.util.Arrays.asList(" I D ")));

        // Cập nhật thông tin cơ bản
        mapRequestToEmployee(request, employee);

        // Lưu thông tin nhân viên
        @SuppressWarnings("null")
        Employee inputEmployee = employeeRepository.save(employee);

        // Xóa thông tin chứng chỉ hiện có
        employeesCertificationsRepository.deleteByEmployee(inputEmployee);

        // Thêm mới lại chứng chỉ (nếu có)
        List<EmployeeRequest.CertificationRequest> certificationRequests = request.getCertifications();
        if (certificationRequests != null && !certificationRequests.isEmpty()) {
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(AppConstants.DATE_FORMAT);
            for (EmployeeRequest.CertificationRequest certificationRequest : certificationRequests) {
                // Nếu không có certificationId thì bỏ qua
                if (certificationRequest.getCertificationId() == null)
                    continue;

                // Lấy thông tin chứng chỉ từ DB
                Certification certification = certificationRepository
                        .findById(Long.parseLong(certificationRequest.getCertificationId()))
                        .orElseThrow(() -> new IllegalArgumentException("Chứng chỉ không tồn tại"));

                // Tạo entity EmployeesCertifications
                EmployeesCertifications employeesCertification = new EmployeesCertifications();
                employeesCertification.setEmployee(inputEmployee);
                employeesCertification.setCertification(certification);

                // Xử lý ngày bắt đầu
                if (certificationRequest.getCertificationStartDate() != null
                        && !certificationRequest.getCertificationStartDate().isEmpty()) {
                    employeesCertification
                            .setStartDate(LocalDate.parse(certificationRequest.getCertificationStartDate(),
                                    dateTimeFormatter));
                }
                // Xử lý ngày kết thúc
                if (certificationRequest.getCertificationEndDate() != null
                        && !certificationRequest.getCertificationEndDate().isEmpty()) {
                    employeesCertification.setEndDate(LocalDate.parse(certificationRequest.getCertificationEndDate(),
                            dateTimeFormatter));
                }
                // Xử lý điểm số
                if (certificationRequest.getEmployeeCertificationScore() != null
                        && !certificationRequest.getEmployeeCertificationScore().isEmpty()) {
                    employeesCertification
                            .setScore(new BigDecimal(certificationRequest.getEmployeeCertificationScore()));
                }

                employeesCertificationsRepository.save(employeesCertification);
            }
        }
    }

    // ===== Các phương thức hỗ trợ nội bộ =====

    /**
     * Xử lý ký tự đặc biệt trong từ khóa tìm kiếm để tránh SQL Injection/Logic
     * Error.
     * 
     * @param value Giá trị cần xử lý
     * @return Giá trị đã xử lý
     */
    private String escapeWildcards(String value) {
        if (value == null)
            return null;
        return value.replace("!", "!!").replace("%", "!%").replace("_", "!_");
    }

    /**
     * Mapping thông tin nhân viên từ Request DTO sang Entity.
     *
     * @param request  Dữ liệu form từ client (đã qua bước validate)
     * @param employee Entity nhân viên cần cập nhật thông tin
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
     * Xóa bỏ thông tin nhân viên khỏi hệ thống (ADM003).
     *
     * @param id ID của nhân viên cần xóa
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteEmployee(Long id) {
        // Validate parameter [employeeId]
        if (id == null) {
            throw new LogicException(AppConstants.ER001, java.util.Arrays.asList(" I D "));
        }

        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee == null) {
            throw new LogicException(AppConstants.ER014, java.util.Arrays.asList(" I D "));
        }

        try {
            // Xóa thông tin trình độ tiếng Nhật của nhân viên
            employeesCertificationsRepository.deleteByEmployee(employee);

            // Xóa thông tin nhân viên
            employeeRepository.deleteById(id);
        } catch (Exception e) {
            // Nếu có lỗi khi xóa thì trả về lỗi với mã lỗi ER015
            throw new LogicException(AppConstants.ER015, java.util.Collections.emptyList());
        }
    }
}
