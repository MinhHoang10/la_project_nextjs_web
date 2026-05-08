/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM005.ts, 4/21/2026 NguyenHuyHoang
 */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { departmentApi } from '@/lib/api/department.api';
import { certificationApi } from '@/lib/api/certification.api';
import { getEmployeeFromSession, clearEmployeeSession } from '@/lib/utils/employeeSession';
import { QUERY_PARAMS, APP_MODES } from '@/lib/constants/common';
import { EmployeeFormDTO } from '@/types/employee';
import { DepartmentDTO } from '@/types/department';
import { CertificationDTO } from '@/types/certification';

/**
 * Hook quản lý logic cho màn hình Xác nhận thông tin nhân viên (ADM005).
 * 
 * Chức năng chính:
 * - Hiển thị dữ liệu nhân viên đã nhập từ màn hình ADM004 (Lấy qua Session).
 * - Kiểm tra tính toàn vẹn của dữ liệu giữa URL và Session.
 * - Thực hiện lưu dữ liệu chính thức xuống DB (gọi API Create/Update).
 * - Xử lý điều hướng quay lại hoặc chuyển sang màn hình Hoàn tất.
 * 
 * @returns Các trạng thái và hàm xử lý cho màn hình ADM005.
 */
export function useADM005() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ID nhân viên từ URL (Dùng để kiểm tra tính nhất quán với dữ liệu trong Session)
  const urlId = searchParams.get('id');

  // Trạng thái chờ khi khởi tạo Master Data và Session Data
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Lưu trữ dữ liệu nhân viên được trích xuất từ Session Storage
  const [employeeData, setEmployeeData] = useState<EmployeeFormDTO | null>(null);

  // Danh sách phòng ban và chứng chỉ để tra cứu tên (Label) từ ID
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [certifications, setCertifications] = useState<CertificationDTO[]>([]);

  /**
   * Effect: Khởi tạo dữ liệu khi lần đầu vào màn hình xác nhận.
   * 
   * Logic kiểm tra an toàn:
   * 1. Nếu không có dữ liệu trong session -> Chuyển sang System Error.
   * 2. Nếu ID trên URL không khớp với ID trong session -> Chuyển sang System Error.
   */
  useEffect(() => {
    const initData = async () => {
      try {
        // Lấy dữ liệu tạm thời từ session (được lưu bởi ADM004)
        const sessionData = getEmployeeFromSession();

        // Kiểm tra 1: Dữ liệu session phải tồn tại
        if (!sessionData) {
          clearEmployeeSession();
          router.push('/employees/system_error');
          return;
        }

        // Kiểm tra 2: ID trên URL và ID trong session phải khớp nhau (nếu có)
        const sessionEmployeeId = sessionData.employeeId?.toString() || null;
        if (urlId !== sessionEmployeeId) {
          clearEmployeeSession();
          router.push('/employees/system_error');
          return;
        }

        setEmployeeData(sessionData);

        // Tải Master Data để hiển thị tên phòng ban/chứng chỉ thay vì chỉ hiển thị ID
        const [deptData, certData] = await Promise.all([
          departmentApi.getAllDepartments(),
          certificationApi.getAllCertifications()
        ]);
        setDepartments(deptData);
        setCertifications(certData);
      } catch (error) {
        // Nếu có lỗi khi tải dữ liệu, dọn dẹp session và báo lỗi hệ thống
        clearEmployeeSession();
        router.push('/employees/system_error');
      } finally {
        // Kết thúc trạng thái tải
        setLoadingInitial(false);
      }
    };

    initData();
  }, []);

  /**
   * Xử lý sự kiện khi nhấn nút Quay lại (戻る).
   * Điều hướng về ADM004 với chế độ 'back' để khôi phục dữ liệu từ session vào form.
   */
  const handleBack = () => {
    router.push(`/employees/adm004?${QUERY_PARAMS.MODE}=${APP_MODES.BACK}`);
  };

  /**
   * Xử lý sự kiện khi người dùng nhấn nút OK (Xác nhận lưu).
   * 
   * Quy trình:
   * 1. Kiểm tra session lần cuối.
   * 2. Phân loại request (Create nếu không có ID, Update nếu đã có ID).
   * 3. Gọi API tương ứng.
   * 4. Xóa session và chuyển hướng sang trang hoàn tất (ADM006).
   */
  const handleOK = async () => {
    const employeeFromSession = getEmployeeFromSession();
    if (!employeeFromSession) return;

    try {
      if (employeeFromSession['employeeId']) {
        // Thực hiện cập nhật nhân viên hiện có (Edit mode)
        await employeeApi.updateEmployee(employeeFromSession as any);
        clearEmployeeSession();
        router.push('/employees/adm006?mode=edit');
      } else {
        // Thực hiện thêm mới nhân viên (Add mode)
        await employeeApi.createEmployee(employeeFromSession as any);
        clearEmployeeSession();
        router.push('/employees/adm006?mode=add');
      }
    } catch (error: any) {
      // Xử lý các trường hợp lỗi từ Backend
      const backendData = error?.response?.data;
      let errors: any[] = [];
      
      if (backendData && typeof backendData === 'object') {
        errors = backendData.messages || (Array.isArray(backendData) ? backendData : []);
      }

      /**
       * Đặc biệt: Lỗi ER003 (Trùng Login ID) có thể xảy ra ở bước cuối cùng
       * nếu có người khác vừa đăng ký cùng một ID. Trong trường hợp này, 
       * quay lại ADM004 kèm theo thông báo lỗi.
       */
      if (errors.length > 0) {
        const hasER003 = errors.some((err: any) => err.code === 'ER003');
        if (hasER003) {
          router.push(`/employees/adm004?${QUERY_PARAMS.MODE}=${APP_MODES.BACK}&${QUERY_PARAMS.ERROR}=ER003`);
        } else {
          clearEmployeeSession();
          router.push('/employees/system_error');
        }
      } else {
        // Các lỗi 500 hoặc lỗi mạng khác
        clearEmployeeSession();
        router.push('/employees/system_error');
      }
    }
  };

  return {
    loadingInitial,
    employeeData,
    departments,
    certifications,
    handleBack,
    handleOK,
  };
}
