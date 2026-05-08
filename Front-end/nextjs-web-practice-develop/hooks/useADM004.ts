/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM004.ts, 4/22/2026 NguyenHuyHoang
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { departmentApi } from '@/lib/api/department.api';
import { certificationApi } from '@/lib/api/certification.api';
import { employeeApi } from '@/lib/api/employee.api';
import { storage } from '@/lib/utils/storage';
import { DepartmentDTO } from '@/types/department';
import { CertificationDTO } from '@/types/certification';
import {
  getEmployeeFromSession,
  clearEmployeeSession,
  setEmployeeToSession
} from '@/lib/utils/employeeSession';
import {
  EmployeeFormDTO,
  FieldErrors,
} from '@/types/employee';
import { employeeSchema, resolveErrorMessage, getEmployeeLabel } from '@/lib/validation/employee';
import { QUERY_PARAMS, APP_MODES } from '@/lib/constants/common';
import { mapLabelToField } from '@/lib/constants/labels';

/** 
 * Hook quản lý logic cho màn hình Đăng ký/Chỉnh sửa nhân viên (ADM004).
 * 
 * Các chức năng chính:
 * - Khởi tạo dữ liệu ban đầu cho form dựa trên chế độ (Add/Edit/Back).
 * - Quản lý trạng thái form (FormData) và trạng thái lỗi (Errors).
 * - Xử lý Validation thời gian thực (Real-time) và khi Submit.
 * - Tương tác với Session Storage để duy trì dữ liệu giữa các bước.
 * 
 * @returns Các trạng thái và hàm xử lý sự kiện cho màn hình ADM004.
 */
export function useADM004() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Xác định chế độ làm việc: 'add' (mặc định), 'edit', hoặc 'back'
  const mode = searchParams.get(QUERY_PARAMS.MODE) || APP_MODES.ADD;
  // ID nhân viên (chỉ có ở chế độ 'edit')
  const id = searchParams.get(QUERY_PARAMS.ID);
  // Mã lỗi truyền về từ màn hình xác nhận (Ví dụ: ER003 - Trùng Login ID)
  const errorParam = searchParams.get(QUERY_PARAMS.ERROR);

  // Master Data cho các Dropdown
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [certifications, setCertifications] = useState<CertificationDTO[]>([]);
  // Trạng thái chờ khi tải dữ liệu khởi tạo (Master Data + Employee Info)
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Quản lý lỗi hiển thị dưới mỗi trường input (key: fieldName, value: messageCode)
  const [errors, setErrors] = useState<FieldErrors>({});

  // Dữ liệu chính của Form
  const [formData, setFormData] = useState<EmployeeFormDTO>({
    employeeLoginId: '',
    departmentId: undefined,
    employeeName: '',
    employeeNameKana: '',
    employeeBirthDate: '',
    employeeEmail: '',
    employeeTelephone: '',
    employeeLoginPassword: '',
    employeeLoginPasswordConfirm: '',
    certificationId: undefined,
    certificationStartDate: '',
    certificationEndDate: '',
    certificationScore: '',
  });

  /**
   * Effect: Khởi tạo dữ liệu khi lần đầu vào trang hoặc khi mode/id thay đổi.
   */
  useEffect(() => {
    const initData = async () => {
      try {
        // Tải đồng thời danh sách phòng ban và chứng chỉ
        const [deptData, certData] = await Promise.all([
          departmentApi.getAllDepartments(),
          certificationApi.getAllCertifications()
        ]);
        setDepartments(deptData);
        setCertifications(certData);

        // Xử lý logic khởi tạo theo từng chế độ
        if (mode === APP_MODES.ADD) {
          // Chế độ thêm mới: Xóa sạch dữ liệu cũ trong session
          handleInitAdd();
        } else if (mode === APP_MODES.EDIT && id) {
          // Chế độ chỉnh sửa: Tải dữ liệu nhân viên từ Backend
          await handleInitEdit(Number(id));
        } else if (mode === APP_MODES.BACK) {
          // Quay lại từ ADM005: Khôi phục dữ liệu đã nhập từ session
          const sessionEmployee = getEmployeeFromSession();
          if (sessionEmployee) {
            setFormData(sessionEmployee);
          }
          // Xóa session ngay sau khi khôi phục để đảm bảo an toàn dữ liệu
          clearEmployeeSession();
          
          // Nếu quay lại do lỗi trùng Login ID (ER003), hiển thị lỗi ngay lập tức
          if (errorParam === 'ER003') {
            setErrors({ employeeLoginId: 'ER003' });
          }
        } else {
          // Tham số không hợp lệ
          throw new Error('Invalid parameters');
        }
      } catch (error) {
        // Chuyển hướng sang trang lỗi hệ thống nếu xảy ra lỗi nghiêm trọng
        router.push('/employees/system_error');
      } finally {
        setLoadingInitial(false);
      }
    };
    initData();
  }, [mode, id]);

  /**
   * Khởi tạo cho chế độ Thêm mới: Dọn dẹp session.
   */
  const handleInitAdd = () => {
    clearEmployeeSession();
  };

  /**
   * Khởi tạo cho chế độ Chỉnh sửa: Lấy dữ liệu từ API.
   * Chuyển đổi định dạng dữ liệu từ DB (YYYY-MM-DD) sang định dạng Form (YYYY/MM/DD).
   */
  const handleInitEdit = async (employeeId: number) => {
    try {
      const data = await employeeApi.getEmployeeById(employeeId);

      const newFormData: EmployeeFormDTO = {
        employeeId: data.employeeId,
        employeeLoginId: data.employeeLoginId || '',
        departmentId: data.departmentId,
        employeeName: data.employeeName || '',
        employeeNameKana: data.employeeNameKana || '',
        employeeBirthDate: data.employeeBirthDate?.replaceAll('-', '/') || '',
        employeeEmail: data.employeeEmail || '',
        employeeTelephone: data.employeeTelephone || '',
      };

      // Xử lý lấy thông tin chứng chỉ (nếu có)
      if (data.certifications && data.certifications.length > 0) {
        const certification = data.certifications[0];
        newFormData.certificationId = certification.certificationId;
        newFormData.certificationStartDate = certification.startDate?.replaceAll('-', '/') || '';
        newFormData.certificationEndDate = certification.endDate?.replaceAll('-', '/') || '';
        newFormData.certificationScore = certification.score?.toString() || '';
      }

      setFormData(newFormData);
    } catch (error) {
      router.push('/employees/system_error');
    }
  };

  /**
   * Cập nhật giá trị và thực hiện validate ngay lập tức (Real-time).
   * Thường dùng cho các trường nhập liệu văn bản (Input).
   */
  const updateAndValidateField = (field: keyof EmployeeFormDTO, value: any) => {
    // 1. Tạo bản sao dữ liệu mới
    const nextData: EmployeeFormDTO = { ...formData, [field]: value };
    setFormData(nextData);

    // 2. Sử dụng Zod để kiểm tra lỗi cho dữ liệu mới
    const result = employeeSchema.safeParse(nextData);
    const nextErrors: FieldErrors = { ...errors };

    if (!result.success) {
      // Chỉ lấy lỗi của trường hiện tại đang thao tác
      const fieldIssues = result.error.issues.filter(issue => issue.path.includes(field));
      nextErrors[field] = fieldIssues.length > 0 ? fieldIssues[0].message : undefined;

      // Xử lý các trường có quan hệ phụ thuộc (Ví dụ: Password Confirm phụ thuộc Password)
      if (field === 'employeeLoginPassword' || field === 'employeeLoginPasswordConfirm') {
        const confirmIssues = result.error.issues.filter(issue => issue.path.includes('employeeLoginPasswordConfirm'));
        nextErrors.employeeLoginPasswordConfirm = confirmIssues.length > 0 ? confirmIssues[0].message : undefined;
      }
      // Xử lý logic ngày hết hạn phải sau ngày cấp
      if (field === 'certificationStartDate' || field === 'certificationEndDate') {
        const endIssues = result.error.issues.filter(issue => issue.path.includes('certificationEndDate'));
        nextErrors.certificationEndDate = endIssues.length > 0 ? endIssues[0].message : undefined;
      }
    } else {
      // Nếu validate thành công, xóa bỏ thông báo lỗi cũ
      nextErrors[field] = undefined;
      if (field === 'employeeLoginPassword') nextErrors.employeeLoginPasswordConfirm = undefined;
      if (field === 'certificationStartDate') nextErrors.certificationEndDate = undefined;
    }

    /**
     * Logic đặc biệt: Bắt buộc nhập Password khi Thêm mới (Add).
     * Khi Edit, Password là tùy chọn (chỉ nhập khi muốn đổi).
     */
    if (field === 'employeeLoginPassword' && (mode === APP_MODES.ADD || mode === APP_MODES.BACK)) {
      const isActuallyAdd = nextData.employeeId === undefined || nextData.employeeId === null;
      if (isActuallyAdd && !nextData.employeeLoginPassword) {
        nextErrors.employeeLoginPassword = resolveErrorMessage('ER001', 'employeeLoginPassword');
      }
    }

    setErrors(nextErrors);
  };

  /**
   * Kiểm tra lỗi khi người dùng rời khỏi ô nhập liệu (onBlur).
   * Không cập nhật dữ liệu, chỉ cập nhật thông báo lỗi.
   */
  const validateFieldOnBlur = (field: keyof EmployeeFormDTO) => {
    const result = employeeSchema.safeParse(formData);
    const nextErrors: FieldErrors = { ...errors };

    if (!result.success) {
      const fieldIssues = result.error.issues.filter(issue => issue.path.includes(field));
      nextErrors[field] = fieldIssues.length > 0 ? fieldIssues[0].message : undefined;

      // Xử lý các trường phụ thuộc
      if (field === 'employeeLoginPassword' || field === 'employeeLoginPasswordConfirm') {
        const confirmIssues = result.error.issues.filter(issue => issue.path.includes('employeeLoginPasswordConfirm'));
        nextErrors.employeeLoginPasswordConfirm = confirmIssues.length > 0 ? confirmIssues[0].message : undefined;
      }
      if (field === 'certificationStartDate' || field === 'certificationEndDate') {
        const endIssues = result.error.issues.filter(issue => issue.path.includes('certificationEndDate'));
        nextErrors.certificationEndDate = endIssues.length > 0 ? endIssues[0].message : undefined;
      }
    } else {
      nextErrors[field] = undefined;
      if (field === 'employeeLoginPassword') nextErrors.employeeLoginPasswordConfirm = undefined;
      if (field === 'certificationStartDate') nextErrors.certificationEndDate = undefined;
    }

    // Logic bắt buộc Password khi thêm mới
    if (field === 'employeeLoginPassword' && (mode === APP_MODES.ADD || mode === APP_MODES.BACK)) {
      const isActuallyAdd = formData.employeeId === undefined || formData.employeeId === null;
      if (isActuallyAdd && !formData.employeeLoginPassword) {
        nextErrors.employeeLoginPassword = resolveErrorMessage('ER001', 'employeeLoginPassword');
      }
    }

    /**
     * Validate bổ sung: Khi đã chọn chứng chỉ, các trường liên quan trở thành bắt buộc (ER001).
     */
    const hasCert = formData.certificationId && Number(formData.certificationId) > 0;
    if (hasCert) {
      if (field === 'certificationStartDate' && !formData.certificationStartDate) {
        nextErrors.certificationStartDate = resolveErrorMessage('ER001', 'certificationStartDate');
      }
      if (field === 'certificationEndDate' && !formData.certificationEndDate) {
        nextErrors.certificationEndDate = resolveErrorMessage('ER001', 'certificationEndDate');
      }
      if (field === 'certificationScore' && !formData.certificationScore) {
        nextErrors.certificationScore = resolveErrorMessage('ER001', 'certificationScore');
      }
    }

    /**
     * Validate logic khớp mật khẩu (ER017).
     */
    if (field === 'employeeLoginPasswordConfirm' || field === 'employeeLoginPassword') {
      const isActuallyAdd = formData.employeeId === undefined || formData.employeeId === null;
      if (isActuallyAdd && (mode === APP_MODES.ADD || mode === APP_MODES.BACK)) {
        if (!formData.employeeLoginPasswordConfirm) {
          nextErrors.employeeLoginPasswordConfirm = resolveErrorMessage('ER001', 'employeeLoginPasswordConfirm');
        } else if (formData.employeeLoginPassword && formData.employeeLoginPassword !== formData.employeeLoginPasswordConfirm) {
          nextErrors.employeeLoginPasswordConfirm = resolveErrorMessage('ER017', 'employeeLoginPasswordConfirm');
        } else {
          nextErrors.employeeLoginPasswordConfirm = undefined;
        }
      } else {
        // Chế độ Edit: Chỉ kiểm tra khớp nếu có nhập confirm
        if (formData.employeeLoginPassword && formData.employeeLoginPassword !== formData.employeeLoginPasswordConfirm) {
          nextErrors.employeeLoginPasswordConfirm = resolveErrorMessage('ER017', 'employeeLoginPasswordConfirm');
        } else {
          nextErrors.employeeLoginPasswordConfirm = undefined;
        }
      }
    }

    setErrors(nextErrors);
  };

  /**
   * Xử lý khi thay đổi chứng chỉ trong Dropdown.
   * Reset toàn bộ các trường ngày cấp, ngày hết hạn và điểm về trống.
   */
  const handleCertificationChange = (certId: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      certificationId: certId,
      certificationStartDate: '',
      certificationEndDate: '',
      certificationScore: '',
    }));
    // Đồng thời dọn dẹp các thông báo lỗi liên quan đến chứng chỉ
    setErrors((prev) => ({
      ...prev,
      certificationId: undefined,
      certificationStartDate: undefined,
      certificationEndDate: undefined,
      certificationScore: undefined,
    }));
  };

  /**
   * Xử lý khi người dùng nhấn nút Xác nhận (確認).
   * 
   * Quy trình:
   * 1. Validate Client-side (Zod).
   * 2. Nếu qua, gọi API Validate Backend (Business logic).
   * 3. Lưu vào Session và chuyển hướng sang màn hình ADM005.
   */
  const handleConfirm = async () => {
    // 1. Validate tổng thể bằng Zod
    const result = employeeSchema.safeParse(formData);
    const newErrors: FieldErrors = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FieldErrors;
        if (path && !newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
    }

    // Kiểm tra thủ công các logic bắt buộc phức tạp (Add mode / Cert selected)
    if (mode === APP_MODES.ADD || mode === APP_MODES.BACK) {
      const isActuallyAdd = formData.employeeId === undefined || formData.employeeId === null;
      if (isActuallyAdd && !formData.employeeLoginPassword) {
        newErrors.employeeLoginPassword = resolveErrorMessage('ER001', 'employeeLoginPassword');
      }
    }

    const hasCertOnSubmit = formData.certificationId && Number(formData.certificationId) > 0;
    if (hasCertOnSubmit) {
      if (!formData.certificationStartDate) newErrors.certificationStartDate = resolveErrorMessage('ER001', 'certificationStartDate');
      if (!formData.certificationEndDate) newErrors.certificationEndDate = resolveErrorMessage('ER001', 'certificationEndDate');
      if (!formData.certificationScore) newErrors.certificationScore = resolveErrorMessage('ER001', 'certificationScore');
    }

    // Validate mật khẩu xác nhận
    const isAddMode = (mode === APP_MODES.ADD || mode === APP_MODES.BACK)
      && (formData.employeeId === undefined || formData.employeeId === null);
    if (isAddMode && !formData.employeeLoginPasswordConfirm) {
      newErrors.employeeLoginPasswordConfirm = resolveErrorMessage('ER001', 'employeeLoginPasswordConfirm');
    } else if (formData.employeeLoginPassword && formData.employeeLoginPassword !== formData.employeeLoginPasswordConfirm) {
      newErrors.employeeLoginPasswordConfirm = resolveErrorMessage('ER017', 'employeeLoginPasswordConfirm');
    }

    // Nếu có lỗi Client-side -> Dừng lại và hiển thị lỗi, cuộn lên đầu trang
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validate Backend (Dry-run) để kiểm tra trùng LoginID hoặc logic nghiệp vụ sâu
    try {
      await employeeApi.validateEmployee(formData);

      // Lưu dữ liệu vào Session Storage để màn hình ADM005 lấy ra hiển thị
      setEmployeeToSession(formData);

      // Điều hướng sang ADM005
      if (formData.employeeId) {
        router.push(`/employees/adm005?id=${formData.employeeId}`);
      } else {
        router.push('/employees/adm005');
      }
    } catch (error: any) {
      const backendData = error?.response?.data;
      const backendErrors: any[] = backendData?.messages || [];

      // Nếu Backend trả về lỗi nghiệp vụ (mảng messages)
      if (backendErrors.length > 0) {
        const newErrors: FieldErrors = { ...errors };

        backendErrors.forEach((err: any) => {
          let field: keyof FieldErrors | null = null;

          // Ánh xạ lỗi ER012 đặc biệt
          if (err.code === 'ER012') {
            field = 'certificationEndDate';
          } else {
            const label = err.params?.[0]; // VD: "氏名"
            if (label) {
              field = mapLabelToField(label); // Chuyển đổi nhãn tiếng Nhật sang tên field
            }
          }

          if (field) newErrors[field] = err.code;
        });

        setErrors(newErrors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Lỗi không xác định hoặc 500 từ Server -> Sang trang System Error
        router.push('/employees/system_error');
      }
    }
  };

  /**
   * Xử lý sự kiện khi nhấn nút Quay lại (戻る).
   * - Nếu Edit: Quay về trang Chi tiết (ADM003).
   * - Nếu Add: Quay về trang Danh sách (ADM002).
   */
  const handleBack = () => {
    if (formData.employeeId) {
      router.push(`/employees/adm003/${formData.employeeId}`);
    } else {
      router.push('/employees/adm002');
    }
  };

  return {
    departments,
    certifications,
    loadingInitial,
    mode,
    formData,
    errors,
    updateAndValidateField,
    validateFieldOnBlur,
    handleConfirm,
    handleBack,
    handleCertificationChange,
  };
}
