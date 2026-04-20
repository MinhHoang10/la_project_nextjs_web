/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM002.ts, 4/13/2026 NguyenHuyHoang
 */
import { useState, useEffect } from 'react';
import { departmentService } from '@/lib/api/departmentService';
import { employeeService } from '@/lib/api/employeeService';
import { EmployeeDTO } from '@/types/employee';
import { DepartmentDTO } from '@/types/department';
import { SortConfig } from '@/components/employees/EmployeeTable';

/**
 * Hook tùy chỉnh (Custom Hook) xử lý toàn bộ State và Logic cho trang Danh sách nhân viên (ADM002).
 * Trừu tượng hóa Logic phức tạp ra khỏi UI Component.
 */
export function useADM002() {
  // Kho chứa dữ liệu hiển thị (Employees list, Dropdown Departments)
  const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);

  // Bộ lọc tìm kiếm
  const [searchName, setSearchName] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(20);

  // Cấu hình thứ tự sắp xếp mặc định (Ưu tiên: Tên NV > Tên Chứng chỉ > Ngày hết hạn)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    employeeName: 'asc',
    certificationName: 'asc',
    certificationEndDate: 'asc'
  });

  // Trạng thái Phân trang (Pagination)
  const [currentPage, setCurrentPage] = useState(0); // Chỉ số 0 dành cho Spring Data JPA Backend
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Hook tự động kéo dữ liệu (Initial Fetch) khi Component render lấn đầu
  useEffect(() => {
    const initData = async () => {
      try {
        const deptData = await departmentService.getAllDepartments();
        setDepartments(deptData);
        await fetchEmployees(0); // Gọi API đổ dữ liệu list nhân sự trang 0
      } catch (error) {
        console.error('Lỗi trong quá trình khởi tạo dữ liệu ban đầu:', error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [pageSize, sortConfig]);

  /**
   * Phương thức tải lại list nhân viên lên Grid với các params filter mở rộng.
   * Bản đồ hóa cấu trúc Sort của Client thành định dạng Sort String của Spring Data.
   */
  const fetchEmployees = async (page: number, name?: string, deptId?: number, size?: number) => {
    setLoading(true);
    try {
      // Map multi-sort keys sang JPA Model Paths
      const sort = [
        `employeeName,${sortConfig.employeeName}`,
        `employeesCertifications.certification.certificationName,${sortConfig.certificationName}`,
        `employeesCertifications.endDate,${sortConfig.certificationEndDate}`
      ];

      const data = await employeeService.getAllEmployees({
        name: name !== undefined ? name : searchName,
        departmentId: deptId !== undefined ? deptId : selectedDeptId,
        page: page,
        size: size || pageSize,
        sort: sort
      });

      if (data.code === '200') {
        setEmployees(data.employees || []);
        setTotalPages(Math.ceil((data.totalRecords || 0) / (size || pageSize)));
        setTotalElements(data.totalRecords || 0);
        setCurrentPage(page);
      } else {
        console.error('Lỗi API backend trả về:', data.message);
        setEmployees([]);
        setTotalPages(0);
        setTotalElements(0);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi fetch list nhân viên:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Phương thức click nút Tìm Kiếm.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployees(0, searchName.trim(), selectedDeptId);
  };

  /**
   * Phương thức nhảy trang, load trang tiếp theo hoặc lùi trang trước đó.
   */
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchEmployees(page);
    }
  };

  /**
   * Phương thức đảo sort (asc/desc) trên một cột sắp xếp xác định khi người dùng click vào Name Cột.
   */
  const handleSort = (field: keyof SortConfig) => {
    setSortConfig(prev => ({
      ...prev,
      [field]: prev[field] === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    // Trả ra kho biến đổi (States)
    employees,
    departments,
    loading,
    searchName,
    setSearchName,
    selectedDeptId,
    setSelectedDeptId,
    sortConfig,
    currentPage,
    totalPages,
    totalElements,
    // Trả ra kho hành động (Actions)
    handleSearch,
    handlePageChange,
    handleSort
  };
}
