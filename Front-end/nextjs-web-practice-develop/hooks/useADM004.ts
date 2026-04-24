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
import { EmployeeFormDTO } from '@/types/employee';
import { useADM005 } from './useADM005';
import {
  FieldErrors,
} from '@/lib/validation/adm004.validation';
import { employeeSchema } from '@/lib/validation/employee';
import { QUERY_PARAMS, APP_MODES } from '@/lib/constants/common';

export function useADM004() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get(QUERY_PARAMS.MODE) || APP_MODES.ADD;
  const id = searchParams.get(QUERY_PARAMS.ID);
  const errorParam = searchParams.get(QUERY_PARAMS.ERROR); // Tham số lỗi từ ADM005 (VD: ER003)
  const { getEmployeeFromSession, clearStorageSession } = useADM005();

  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [certifications, setCertifications] = useState<CertificationDTO[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // trạng thái lỗi — 1 mã lỗi cho mỗi trường
  const [errors, setErrors] = useState<FieldErrors>({});

  // Form State
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

  // 1. Khởi tạo dữ liệu khi vào trang
  useEffect(() => {
    const initData = async () => {
      try {
        const [deptData, certData] = await Promise.all([
          departmentApi.getAllDepartments(),
          certificationApi.getAllCertifications()
        ]);
        setDepartments(deptData);
        setCertifications(certData);

        if (mode === 'add') {
          // Đi từ ADM002 đến ADM004
          handleInitAdd();
        } else if (mode === 'edit' && id) {
          // Đi từ ADM003 đến ADM004
          await handleInitEdit(Number(id));
        } else if (mode === 'back') {
          // Đi từ ADM005 → lấy dữ liệu từ session
          const sessionEmployee = getEmployeeFromSession();
          if (sessionEmployee) {
            setFormData(sessionEmployee);
          }
          // Nếu ER003 được trả về từ backend → hiển thị lỗi trên trường loginId
          if (errorParam === 'ER003') {
            setErrors({ employeeLoginId: 'ER003' });
          }
        }
      } catch (error) {
        console.error('Error loading initialization data:', error);
        router.push('/employees/system_error');
      } finally {
        setLoadingInitial(false);
      }
    };
    initData();
  }, [mode, id]);

  const handleInitAdd = () => {
    // clearStorageSession();
  };

  const handleInitEdit = async (employeeId: number) => {
    console.log('Loading employee data for edit, id:', employeeId);
    // TODO: Lấy dữ liệu nhân viên từ API và cập nhật formData
  };

  // const handleInitBackFromConfirm = () => {
  //   const sessionEmployee = getEmployeeFromSession();
  //   if (sessionEmployee) {
  //     setFormData(sessionEmployee);
  //   }
  // };

  /**
   * Cập nhật dữ liệu và kiểm tra lỗi
   */
  const updateAndValidateField = (field: keyof EmployeeFormDTO, value: any) => {
    // Cập nhật dữ liệu
    const nextData: EmployeeFormDTO = { ...formData, [field]: value };
    setFormData(nextData);

    // Kiểm tra lỗi của trường vừa thay đổi bằng Zod
    // Lưu ý: Đối với field validation, ta dùng schema.shape[field].safeParse
    // Nhưng vì có superRefine liên trường (password, cert), nên tốt nhất là parse toàn bộ schema
    // hoặc ít nhất là các schema liên quan.
    const result = employeeSchema.safeParse(nextData);
    const nextErrors: FieldErrors = { ...errors };

    if (!result.success) {
      const fieldIssues = result.error.issues.filter(issue => issue.path.includes(field));
      if (fieldIssues.length > 0) {
        nextErrors[field] = fieldIssues[0].message; // Lưu message lỗi thay vì code
      } else {
        nextErrors[field] = undefined;
      }

      // Xử lý các field phụ thuộc
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

    setErrors(nextErrors);
  };

  /**
   * Xử lý khi click nút 確認
   */
  const handleConfirm = async () => {
    // Bước 1: Validate client-side với Zod
    const result = employeeSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FieldErrors;
        if (path && !newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Bước 2: Validate business rules trên Backend (Trùng ID, tồn tại phòng ban...)
    try {
      await employeeApi.validateEmployee(formData);

      storage.session.set('adm004_employee_data', formData);
      router.push('/employees/adm005');
    } catch (error: any) {
      const backendData = error?.response?.data;
      const backendErrors: any[] = backendData?.errors || [];

      if (error?.response?.status === 400 && backendErrors.length > 0) {
        const newErrors: FieldErrors = { ...errors };
        backendErrors.forEach((err: any) => {
          const field = err.params?.[0] as keyof FieldErrors;
          if (field) {
            newErrors[field] = err.code;
          }
        });
        setErrors(newErrors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Các lỗi khác (500, Network Error, etc.) -> Chuyển sang màn hình System Error
        console.error('Unexpected error during validation:', error);
        router.push('/employees/system_error');
      }
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
    handleConfirm,
  };
}
