/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM003.ts, 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { EmployeeDetailResponse } from '@/types/employee';
import { QUERY_PARAMS, APP_MODES } from '@/lib/constants/common';
import { INFO_MESSAGES } from '@/lib/constants/messages';

/**
 * Hook quản lý logic và trạng thái cho màn hình Chi tiết nhân viên (ADM003).
 * 
 * - Tự động tải thông tin nhân viên từ ID trên URL.
 * - Cung cấp các hàm xử lý sự kiện: Chỉnh sửa, Quay lại, Xóa.
 * 
 * @returns Các trạng thái và hàm xử lý sự kiện cho màn hình ADM003.
 */
export const useADM003 = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id); // Trích xuất ID nhân viên từ URL parameters

  // Lưu trữ dữ liệu chi tiết nhân viên (bao gồm thông tin cơ bản và danh sách chứng chỉ)
  const [employee, setEmployee] = useState<EmployeeDetailResponse | null>(null);
  // Trạng thái chờ khi đang gọi API (Initial load hoặc khi Xóa)
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Tải dữ liệu chi tiết nhân viên ngay khi ID thay đổi.
   */
  useEffect(() => {
    if (id) {
      setLoading(true);
      employeeApi.getEmployeeById(id)
        .then(data => {
          // Cập nhật dữ liệu vào state sau khi API trả về thành công
          setEmployee(data);
        })
        .catch(err => {
          // Nếu có lỗi (Ví dụ: ID không tồn tại - ER013), chuyển hướng sang trang lỗi hệ thống
          router.push('/employees/system_error');
        })
        .finally(() => {
          // Luôn tắt trạng thái tải sau khi hoàn tất request
          setLoading(false);
        });
    }
  }, [id, router]);

  /**
   * Xử lý sự kiện khi người dùng nhấn nút Chỉnh sửa.
   * Điều hướng sang màn hình ADM004 kèm theo chế độ 'edit' và ID nhân viên.
   */
  const handleEdit = () => {
    router.push(`/employees/adm004?${QUERY_PARAMS.MODE}=${APP_MODES.EDIT}&${QUERY_PARAMS.ID}=${id}`);
  };

  /**
   * Xử lý sự kiện khi người dùng nhấn nút Quay lại.
   * Quay trở về màn hình Danh sách nhân viên chính (ADM002).
   */
  const handleBack = () => {
    router.push('/employees/adm002');
  };

  /**
   * Xử lý sự kiện khi người dùng nhấn nút Xóa nhân viên.
   * 
   * 1. Hiển thị hộp thoại xác nhận.
   * 2. Gọi API xóa dữ liệu.
   * 3. Chuyển sang màn hình thông báo hoàn tất (ADM006).
   */
  const handleDelete = async () => {
    if (!employee) return;

    // Hiển thị hộp thoại xác nhận của trình duyệt trước khi thực hiện hành động nguy hiểm
    const isConfirm = window.confirm(INFO_MESSAGES.MSG004);
    if (!isConfirm) return;

    try {
      setLoading(true);
      // Thực hiện xóa nhân viên thông qua API
      await employeeApi.deleteEmployee(employee.employeeId!);
      // Chuyển sang màn hình hoàn tất (ADM006) với chế độ xóa (delete)
      router.push('/employees/adm006?mode=delete');
    } catch (err: any) {
      // Xử lý thông báo lỗi từ backend nếu có (Ví dụ: ER015)
      const msg = err.response?.data?.message;
      if (msg && msg.code) {
        window.alert(`${msg.code}: ${msg.messages.join(', ')}`);
      } else {
        window.alert('Xóa thất bại do lỗi hệ thống.');
      }
    } finally {
      // Đảm bảo loading được tắt dù thành công hay thất bại
      setLoading(false);
    }
  };

  return {
    id,
    employee,
    loading,
    handleEdit,
    handleBack,
    handleDelete
  };
};
