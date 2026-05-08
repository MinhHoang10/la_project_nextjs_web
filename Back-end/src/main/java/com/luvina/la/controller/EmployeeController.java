/*
 * Copyright(C) 2010 Luvina Software Company
 * EmployeeController.java, 4/13/2026, NguyenHuyHoang
 */
package com.luvina.la.controller;

import com.luvina.la.constant.AppConstants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.exception.LogicException;
import com.luvina.la.payload.EmployeeDeleteResponse;
import com.luvina.la.payload.EmployeeDetailResponse;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.EmployeeResponse;
import com.luvina.la.payload.MessageResponse;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.util.ValidationUtils;
import com.luvina.la.validate.EmployeeValidate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Controller xử lý các yêu cầu HTTP liên quan đến nghiệp vụ Nhân viên.
 * Cung cấp các endpoint REST cho các màn hình ADM002, ADM003, ADM004, ADM005.
 *
 * @author Nguyen Huy Hoang
 */
@RestController
@RequestMapping("/api")
@Slf4j
public class EmployeeController {

    // ===== Dependencies =====
    private final EmployeeService employeeService;
    private final MessageSource messageSource;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;
    private final EmployeeRepository employeeRepository;

    /**
     * Khởi tạo Controller với các thành phần phụ thuộc cần thiết.
     *
     * @param employeeService         Dịch vụ xử lý nghiệp vụ nhân viên
     * @param messageSource           Nguồn thông báo đa ngôn ngữ
     * @param departmentRepository    Repository truy vấn phòng ban
     * @param certificationRepository Repository truy vấn chứng chỉ
     * @param employeeRepository      Repository truy vấn nhân viên
     */
    public EmployeeController(
            EmployeeService employeeService,
            MessageSource messageSource,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeRepository employeeRepository) {
        this.employeeService = employeeService;
        this.messageSource = messageSource;
        this.departmentRepository = departmentRepository;
        this.certificationRepository = certificationRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Lấy danh sách nhân viên có hỗ trợ tìm kiếm, lọc và sắp xếp (ADM002).
     *
     * @param employeeName          Tên nhân viên cần tìm kiếm (tìm kiếm tương đối)
     * @param departmentId          Mã phòng ban cần lọc
     * @param sortEmployeeName      Hướng sắp xếp theo tên nhân viên (asc/desc)
     * @param sortCertificationName Hướng sắp xếp theo tên chứng chỉ (asc/desc)
     * @param sortEndDate           Hướng sắp xếp theo ngày hết hạn (asc/desc)
     * @param limit                 Số lượng bản ghi tối đa trên một trang
     * @param offset                Vị trí bắt đầu lấy dữ liệu (phân trang)
     * @return {@link EmployeeListResponse} chứa danh sách nhân viên và tổng số bản
     *         ghi
     */
    @GetMapping("/employees")
    public ResponseEntity<EmployeeListResponse> getEmployeeList(
            @RequestParam(value = "employeeName", required = false, defaultValue = "") String employeeName,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "sortEmployeeName", required = false, defaultValue = AppConstants.SORT_ASC) String sortEmployeeName,
            @RequestParam(value = "sortCertificationName", required = false, defaultValue = AppConstants.SORT_DESC) String sortCertificationName,
            @RequestParam(value = "sortEndDate", required = false, defaultValue = AppConstants.SORT_ASC) String sortEndDate,
            @RequestParam(value = "limit", required = false, defaultValue = AppConstants.DEFAULT_LIMIT_STR) Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {

        // Validation sort
        if (!ValidationUtils.isValidSort(sortEmployeeName) ||
                !ValidationUtils.isValidSort(sortCertificationName) ||
                !ValidationUtils.isValidSort(sortEndDate)) {
            return ResponseEntity.ok(EmployeeListResponse.error(AppConstants.ER021,
                    messageSource.getMessage(AppConstants.ER021, null, LocaleContextHolder.getLocale())));
        }

        // Đếm số lượng bản ghi
        Long totalRecords = employeeService.countEmployeesWithFilter(
                employeeName.isEmpty() ? null : employeeName,
                departmentId);

        // Lấy danh sách nhân viên
        List<EmployeeDTO> employees = new ArrayList<>();
        // Kiểm tra nếu không có bản ghi nào được tìm thấy
        if (totalRecords > 0) {
            if (offset >= totalRecords) {
                return ResponseEntity.ok(EmployeeListResponse.error(AppConstants.ER022,
                        messageSource.getMessage(AppConstants.ER022, null, LocaleContextHolder.getLocale())));
            }
            // Lấy danh sách nhân viên
            employees = employeeService.getListEmployee(
                    employeeName.isEmpty() ? null : employeeName,
                    departmentId,
                    sortEmployeeName.toLowerCase(),
                    sortCertificationName.toLowerCase(),
                    sortEndDate.toLowerCase(),
                    limit,
                    offset);
        }

        // Tạo response
        EmployeeListResponse response = new EmployeeListResponse();
        response.setCode(AppConstants.SUCCESS_CODE);
        response.setTotalRecords(totalRecords);
        response.setEmployees(employees);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin chi tiết của một nhân viên theo ID (ADM003).
     *
     * @param id Mã định danh của nhân viên cần xem chi tiết
     * @return {@link EmployeeResponse} chứa dữ liệu chi tiết nhân viên,
     *         hoặc lỗi ER013 nếu không tìm thấy
     */
    @GetMapping({"/employee/{id}", "/employee"})
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable(required = false) Long id) {
        // 1.1 Validate parameter [employeeId] - Trường hợp thiếu tham số (Mã ER001)
        if (id == null) {
            MessageResponse messageResponse = new MessageResponse(AppConstants.ER001, java.util.Arrays.asList(" I D "));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        }

        EmployeeDetailResponse employee = employeeService.getEmployeeDetailById(id);

        // 1.1 Validate parameter [employeeId] - Trường hợp không tồn tại trong DB (Mã ER013)
        if (employee == null) {
            MessageResponse messageResponse = new MessageResponse(AppConstants.ER013, java.util.Arrays.asList(" I D "));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        }

        return ResponseEntity.ok(EmployeeResponse.detail(AppConstants.SUCCESS_CODE, employee));
    }

    /**
     * Thêm mới một nhân viên vào hệ thống (ADM004 - ADM005).
     *
     * @param request Dữ liệu nhân viên từ client
     * @return {@link EmployeeResponse} chứa ID nhân viên vừa tạo và thông báo
     *         MSG001,
     *         hoặc lỗi hệ thống ER015 nếu có exception xảy ra
     */
    @PostMapping("/employee")
    public ResponseEntity<EmployeeResponse> createEmployee(@RequestBody EmployeeRequest employeeRequest) {
        try {
            // Validation Request
            List<MessageResponse> errors = EmployeeValidate.validateEmployeeForm(
                    employeeRequest, true, departmentRepository, certificationRepository, employeeRepository);

            // Response lỗi nếu validation thất bại
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(EmployeeResponse.validationError(AppConstants.SYSTEM_ERROR_CODE, errors));
            }

            // Tạo nhân viên
            Long employeeId = employeeService.addEmployee(employeeRequest);

            // Response thành công
            MessageResponse messageResponse = new MessageResponse(AppConstants.MSG001, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(EmployeeResponse.success(AppConstants.SUCCESS_CODE, employeeId, messageResponse));
        } catch (LogicException e) {
            MessageResponse messageResponse = new MessageResponse(e.getErrorCode(), e.getParams());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        } catch (Exception e) {
            // Response lỗi hệ thống (ER015)
            MessageResponse messageResponse = new MessageResponse(AppConstants.ER015, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        }
    }

    /**
     * Cập nhật thông tin của một nhân viên hiện có (ADM004 Edit - ADM005).
     *
     * @param request Dữ liệu nhân viên cần cập nhật từ client,
     *                bắt buộc phải có {@code employeeId}
     * @return {@link EmployeeResponse} chứa ID nhân viên và thông báo MSG002 nếu
     *         thành công,
     *         lỗi nghiệp vụ nếu có {@link LogicException},
     *         hoặc lỗi hệ thống ER015 nếu có exception không xác định
     */
    @PutMapping("/employee")
    public ResponseEntity<EmployeeResponse> updateEmployee(@RequestBody EmployeeRequest employeeRequest) {
        try {
            // Validation Request
            List<MessageResponse> errors = EmployeeValidate.validateEmployeeForm(
                    employeeRequest, false, departmentRepository, certificationRepository, employeeRepository);

            // Response lỗi nếu validation thất bại
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(EmployeeResponse.validationError(AppConstants.SYSTEM_ERROR_CODE, errors));
            }

            // Gọi service update
            employeeService.editEmployee(employeeRequest);

            // Response thành công
            MessageResponse messageResponse = new MessageResponse(AppConstants.MSG002, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(EmployeeResponse.success(AppConstants.SUCCESS_CODE, employeeRequest.getEmployeeId(),
                            messageResponse));
        } catch (LogicException e) {
            MessageResponse messageResponse = new MessageResponse(e.getErrorCode(), e.getParams());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        } catch (Exception e) {
            // Response lỗi hệ thống (ER015)
            MessageResponse messageResponse = new MessageResponse(AppConstants.ER015, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        }
    }

    /**
     * Kiểm tra tính hợp lệ của dữ liệu nhân viên mà không lưu vào cơ sở dữ liệu
     * (ADM004 Xác nhận).
     * Dùng để validate trước khi hiển thị màn hình xác nhận (ADM005).
     *
     * @param request Dữ liệu nhân viên cần kiểm tra từ client
     * @return {@link EmployeeResponse} với code thành công nếu hợp lệ,
     *         danh sách lỗi validation nếu dữ liệu không hợp lệ,
     *         hoặc lỗi hệ thống ER015 nếu có exception xảy ra
     */
    @PostMapping("/employee/validate")
    public ResponseEntity<EmployeeResponse> validateEmployee(@RequestBody EmployeeRequest employeeRequest) {
        boolean isAddMode = employeeRequest.getEmployeeId() == null;
        try {
            // Gọi hàm validate riêng cho API xác nhận (không kiểm tra password và
            // employeeId tồn tại)
            List<MessageResponse> errors = EmployeeValidate.validateEmployeeFormForConfirm(
                    employeeRequest, isAddMode, departmentRepository, certificationRepository, employeeRepository);

            // Response lỗi nếu validation thất bại
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(EmployeeResponse.validationError(AppConstants.SYSTEM_ERROR_CODE, errors));
            }

            return ResponseEntity.ok(EmployeeResponse.success(AppConstants.SUCCESS_CODE, null, null));
        } catch (LogicException e) {
            MessageResponse messageResponse = new MessageResponse(e.getErrorCode(), e.getParams());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        } catch (Exception e) {
            MessageResponse messageResponse = new MessageResponse(AppConstants.ER015, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, messageResponse));
        }
    }

    /**
     * Xóa một nhân viên khỏi hệ thống theo ID (ADM003).
     * Thao tác xóa sẽ đồng thời xóa toàn bộ chứng chỉ liên quan.
     *
     * @param id Mã định danh của nhân viên cần xóa
     * @return {@link EmployeeDeleteResponse} chứa thông báo MSG003 nếu xóa thành
     *         công,
     *         lỗi nghiệp vụ nếu có {@link LogicException} (ví dụ: nhân viên không
     *         tồn tại),
     *         hoặc lỗi hệ thống ER015 nếu có exception không xác định
     */
    @DeleteMapping({"/employee/{id}", "/employee"})
    public ResponseEntity<EmployeeDeleteResponse> deleteEmployee(@PathVariable(required = false) Long id) {
        // 1.1 Validate parameter [employeeId] - Trường hợp thiếu tham số (Mã ER001)
        if (id == null) {
            MessageResponse messageResponse = new MessageResponse(AppConstants.ER001, java.util.Arrays.asList(" I D "));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeDeleteResponse.error(null, messageResponse));
        }

        try {
            // Gọi service delete
            employeeService.deleteEmployee(id);

            // Response thành công
            return ResponseEntity.ok(EmployeeDeleteResponse.success(id, AppConstants.MSG003));
        } catch (LogicException e) {
            MessageResponse messageResponse = new MessageResponse(e.getErrorCode(), e.getParams());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeDeleteResponse.error(id, messageResponse));
        } catch (Exception e) {
            MessageResponse messageResponse = new MessageResponse(AppConstants.ER015, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeDeleteResponse.error(id, messageResponse));
        }
    }
}
