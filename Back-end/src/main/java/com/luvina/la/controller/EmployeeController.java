/*
 * Copyright(C) 2010 Luvina Software Company
 * EmployeeController.java, 4/13/2026, NguyenHuyHoang
 */
package com.luvina.la.controller;

import com.luvina.la.constant.AppConstants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.EmployeeResponse;
import com.luvina.la.payload.MessageResponse;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
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
 * 
 * @author Nguyen Huy Hoang
 */
@RestController
@RequestMapping("/api")
@Slf4j
public class EmployeeController {

    private final EmployeeService employeeService;
    private final MessageSource messageSource;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;
    private final EmployeeRepository employeeRepository;

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
     * API lấy danh sách nhân viên (ADM002).
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
        if (!EmployeeValidate.isValidSort(sortEmployeeName) ||
                !EmployeeValidate.isValidSort(sortCertificationName) ||
                !EmployeeValidate.isValidSort(sortEndDate)) {
            return ResponseEntity.ok(EmployeeListResponse.error(AppConstants.ER021,
                    messageSource.getMessage(AppConstants.ER021, null, LocaleContextHolder.getLocale())));
        }

        // Đếm số lượng bản ghi
        Long totalRecords = employeeService.countEmployeesWithFilter(
                employeeName.isEmpty() ? null : employeeName,
                departmentId);

        // Lấy danh sách nhân viên
        List<EmployeeDTO> employees = new ArrayList<>();
        if (totalRecords > 0) {
            if (offset >= totalRecords) {
                return ResponseEntity.ok(EmployeeListResponse.error(AppConstants.ER022,
                        messageSource.getMessage(AppConstants.ER022, null, LocaleContextHolder.getLocale())));
            }
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
     * API lấy chi tiết nhân viên.
     */
    @GetMapping("/employee/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        EmployeeDTO employee = employeeService.getEmployeeById(id);

        // Response lỗi nếu không tìm thấy
        if (employee == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(employee);
    }

    /**
     * API thêm mới nhân viên (ADM005 OK).
     */
    @PostMapping("/employee") // Chuyển về số ít theo Spec
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeRequest request) {
        try {
            // Validation Request
            List<MessageResponse> errors = EmployeeValidate.validateEmployeeForm(
                    request, true, departmentRepository, certificationRepository, employeeRepository);

            // Response lỗi nếu validation thất bại
            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(EmployeeResponse.validationError(AppConstants.BAD_REQUEST_CODE, errors));
            }

            // Tạo nhân viên
            Long employeeId = employeeService.addEmployee(request);

            // Response thành công
            MessageResponse msg = new MessageResponse(AppConstants.MSG001, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(EmployeeResponse.success(AppConstants.SUCCESS_CODE, employeeId, msg));
        } catch (Exception e) {
            log.error("Error creating employee", e);
            // Response lỗi hệ thống (ER015)
            MessageResponse msg = new MessageResponse(AppConstants.ER015, new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, msg));
        }
    }

    /**
     * API kiểm tra tính hợp lệ (ADM004 Xác nhận).
     */
    @PostMapping("/employee/validate")
    public ResponseEntity<?> validateEmployee(@RequestBody EmployeeRequest request) {
        boolean isAddMode = request.getEmployeeId() == null;
        // Validation Request
        List<MessageResponse> errors = EmployeeValidate.validateEmployeeForm(
                request, isAddMode, departmentRepository, certificationRepository, employeeRepository);

        // Response lỗi nếu validation thất bại
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(EmployeeResponse.validationError(AppConstants.BAD_REQUEST_CODE, errors));
        }

        return ResponseEntity.ok(EmployeeResponse.success(AppConstants.SUCCESS_CODE, null, null));
    }

    /*
     * @PutMapping("/employee/{id}")
     * public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody
     * EmployeeRequest request) {
     * try {
     * // Kiểm tra nhân viên có tồn tại không
     * if (employeeService.getEmployeeById(id) == null) {
     * MessageResponse msg = new MessageResponse(AppConstants.ER004,
     * List.of("Nhân viên"));
     * return ResponseEntity.status(HttpStatus.NOT_FOUND)
     * .body(EmployeeResponse.error(AppConstants.BAD_REQUEST_CODE, msg));
     * }
     * 
     * // Validation Request
     * List<MessageResponse> errors = EmployeeValidate.validateEmployeeForm(
     * request, false, departmentRepository, certificationRepository,
     * employeeRepository);
     * 
     * // Response lỗi nếu validation thất bại
     * if (!errors.isEmpty()) {
     * return ResponseEntity.badRequest()
     * .body(EmployeeResponse.validationError(AppConstants.BAD_REQUEST_CODE,
     * errors));
     * }
     * 
     * // Cập nhật nhân viên
     * employeeService.updateEmployee(id, request);
     * 
     * // Response thành công
     * MessageResponse msg = new MessageResponse(AppConstants.MSG001, new
     * ArrayList<>());
     * return ResponseEntity.ok(EmployeeResponse.success(AppConstants.SUCCESS_CODE,
     * id, msg));
     * } catch (Exception e) {
     * log.error("Error updating employee", e);
     * MessageResponse msg = new MessageResponse(AppConstants.ER015, new
     * ArrayList<>());
     * return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
     * .body(EmployeeResponse.error(AppConstants.SYSTEM_ERROR_CODE, msg));
     * }
     * }
     */
}
