/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM004.ts, 4/20/2026 NguyenHuyHoang
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { departmentApi } from '@/lib/api/department.api';
import { certificationApi } from '@/lib/api/certification.api';
import { DepartmentDTO } from '@/types/department';
import { CertificationDTO } from '@/types/certification';

export function useADM004() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'add';
  const id = searchParams.get('id');

  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [certifications, setCertifications] = useState<CertificationDTO[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // 1. Khởi tạo dữ liệu khi vào trang
  useEffect(() => {
    const initData = async () => {
      try {
        // Tải dữ liệu cho 2 dropdown (Phòng ban và Chứng chỉ) cùng lúc để tối ưu thời gian
        const [deptData, certData] = await Promise.all([
          departmentApi.getAllDepartments(),
          certificationApi.getAllCertifications()
        ]);
        setDepartments(deptData);
        setCertifications(certData);

        if (mode === 'add') {
          handleInitAdd();
        } else if (mode === 'edit' && id) {
          await handleInitEdit(Number(id));
        } else if (mode === 'back') {
          handleInitBackFromConfirm();
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khởi tạo:", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const handleInitAdd = () => {
    // Tạm thời để rỗng, sau khi cài Form (react-hook-form) mình sẽ gọi clear form ở đây
    sessionStorage.removeItem('adm004_draft');
  };

  const handleInitEdit = async (employeeId: number) => {
    // Tạm thời chờ cài Hook form
    // Lấy API thông tin Employee theo ID về tại đây sau
    console.log("Đang lấy data edit id:", employeeId);
  };

  const handleInitBackFromConfirm = () => {
    // Lấy thông tin từ session để hiển thị lại lên form khi ấn nút trở lại từ màn hình xác nhận
    const draft = sessionStorage.getItem('adm004_draft');
    if (draft) {
      console.log("Tìm thấy dữ liệu người dùng đang nhập dở:", JSON.parse(draft));
    }
  };

  return {
    departments,
    certifications,
    loadingInitial,
    mode
  };
}
