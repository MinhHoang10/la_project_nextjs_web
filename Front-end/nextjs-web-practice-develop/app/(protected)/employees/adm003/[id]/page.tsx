/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx (ADM003), 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import EmployeeViewForm from '@/components/employees/EmployeeViewForm';
import { useADM003 } from '@/hooks/useADM003';

/**
 * Trang chi tiết nhân viên (ADM003).
 * Đóng vai trò là Container Component: Kết nối dữ liệu từ Hook và hiển thị UI qua Component.
 */
export default function EmployeeDetailPage() {
  // Kiểm tra quyền truy cập (Authentication)
  useAuth();

  // Khởi tạo logic từ Custom Hook
  const { 
    employee, 
    loading, 
    handleEdit, 
    handleBack, 
    handleDelete 
  } = useADM003();

  // Hiển thị trạng thái đang tải
  if (loading) {
    return <div className="p-4 text-center font-weight-bold">Đang tải dữ liệu nhân viên...</div>;
  }

  // Hiển thị nếu không tìm thấy dữ liệu
  if (!employee) {
    return <div className="p-4 text-center text-danger">Không tìm thấy thông tin nhân viên hoặc đã bị xóa.</div>;
  }

  return (
    <div className="row">
      {/* Gọi Component hiển thị và truyền dữ liệu cùng các hàm xử lý */}
      <EmployeeViewForm 
        employee={employee} 
        onEdit={handleEdit} 
        onBack={handleBack} 
        onDelete={handleDelete}
      />
    </div>
  );
}
