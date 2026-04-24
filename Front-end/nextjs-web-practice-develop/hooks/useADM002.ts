/**
 * Copyright(C) 2026 Luvina Software Company
 * useADM002.ts, 4/13/2026 NguyenHuyHoang
 */
import { useState, useEffect } from 'react';
import { departmentApi } from '@/lib/api/department.api';
import { employeeApi } from '@/lib/api/employee.api';
import { EmployeeDTO } from '@/types/employee';
import { DepartmentDTO } from '@/types/department';
import { SortConfig } from '@/components/employees/EmployeeTable';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/utils/storage';

/**
 * Hook xử lý State và Logic cho trang Danh sách nhân viên (ADM002).
 * Giúp tách biệt logic gọi API và quản lý state ra khỏi giao diện (UI).
 */
export function useADM002() {
  const router = useRouter();
  // Dữ liệu hiển thị trên giao diện
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

  // Lấy dữ liệu lần đầu khi vào trang
  useEffect(() => {
    const initData = async () => {
      try {
        // Lấy lại dữ liệu tìm kiếm từ Session Storage (ví dụ khi từ trang khác quay lại)
        const storedName = storage.session.get<string>('adm002_searchName') || '';
        const storedDeptId = storage.session.get<string>('adm002_selectedDeptId');
        const parsedDeptId = storedDeptId ? Number(storedDeptId) : undefined;

        // Cập nhật lại giao diện
        setSearchName(storedName);
        if (parsedDeptId) setSelectedDeptId(parsedDeptId);

        const deptData = await departmentApi.getAllDepartments();
        setDepartments(deptData);

        // Gọi API ngay lập tức bằng các tham số cũ vừa lấy ở trên
        await fetchEmployees(0, storedName, parsedDeptId); 
      } catch (error) {
        console.error('Lỗi trong quá trình khởi tạo dữ liệu ban đầu:', error);
        router.push('/employees/system_error');
      } finally {
        setLoading(false);
      }
    };
    initData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortConfig]);

  /**
   * Hàm gọi API để lấy danh sách nhân viên.
   * Chuyển đổi định dạng sắp xếp từ Client sang định dạng mà backend hỗ trợ.
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

      const actualName = name !== undefined ? name : searchName;
      const actualDeptId = deptId !== undefined ? deptId : selectedDeptId;

      // Lưu điều kiện tìm kiếm vào bộ nhớ tạm để giữ lại khi sang trang khác
      storage.session.set('adm002_searchName', actualName);
      if (actualDeptId !== undefined) {
        storage.session.set('adm002_selectedDeptId', String(actualDeptId));
      } else {
        storage.session.remove('adm002_selectedDeptId');
      }

      const data = await employeeApi.getAllEmployees({
        name: actualName,
        departmentId: actualDeptId,
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
      router.push('/employees/system_error');
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
   * Hàm đổi chiều sắp xếp (từ Tăng dần sang Giảm dần và ngược lại) khi click vào tiêu đề cột.
   */
  const handleSort = (field: keyof SortConfig) => {
    setSortConfig(prev => ({
      ...prev,
      [field]: prev[field] === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    // Các biến dùng cho giao diện (States)
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
    // Các hàm xử lý sự kiện (Actions)
    handleSearch,
    handlePageChange,
    handleSort
  };
}
