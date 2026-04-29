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

/**
 * Hook quản lý logic cho màn hình chi tiết nhân viên (ADM003).
 * Lấy thông tin và xử lý các sự kiện nút bấm.
 */
export const useADM003 = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id); // Lấy ID nhân viên từ URL params

  const [employee, setEmployee] = useState<EmployeeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Hiển thị dữ liệu chi tiết nhân viên.
   */
  useEffect(() => {
    if (id) {
      setLoading(true);
      employeeApi.getEmployeeById(id)
        .then(data => {
          setEmployee(data);
        })
        .catch(err => {
          // Điều hướng sang trang lỗi hệ thống nếu API thất bại
          router.push('/employees/system_error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, router]);

  /**
   * Xử lý khi nhấn nút Chỉnh sửa.
   * Chuyển sang màn hình ADM004 với chế độ EDIT.
   */
  const handleEdit = () => {
    router.push(`/employees/adm004?${QUERY_PARAMS.MODE}=${APP_MODES.EDIT}&${QUERY_PARAMS.ID}=${id}`);
  };

  /**
   * Xử lý khi nhấn nút Quay lại.
   * Quay trở về danh sách nhân viên (ADM002).
   */
  const handleBack = () => {
    router.push('/employees/adm002');
  };

  /**
   * Xử lý khi nhấn nút Xóa nhân viên.
   * Hiển thị xác nhận và gọi API xóa.
   */
  const handleDelete = async () => {
    if (!employee) return;

    const isConfirm = window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?');
    if (!isConfirm) return;

    try {
      setLoading(true);
      await employeeApi.deleteEmployee(employee.employeeId!);
      window.alert('Xóa thành công');
      router.push('/employees/adm002');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg && msg.code) {
        window.alert(`Xóa thất bại: ${msg.code}`);
      } else {
        window.alert('Xóa thất bại do lỗi hệ thống.');
      }
    } finally {
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
