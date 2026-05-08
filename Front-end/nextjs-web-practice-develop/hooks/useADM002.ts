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
import { API_STATUS_CODES } from '@/lib/constants/common';

/**
 * Hook xử lý State và Logic cho màn hình Danh sách nhân viên (ADM002).
 * 
 * Các chức năng chính:
 * - Tìm kiếm theo tên và phòng ban.
 * - Sắp xếp đa cột (Multi-sort).
 * - Phân trang (Pagination).
 * - Duy trì trạng thái tìm kiếm qua Session Storage.
 * 
 * @returns Các biến trạng thái và hàm xử lý cho màn hình ADM002.
 */
export function useADM002() {
  const router = useRouter();
  
  // Danh sách nhân viên và phòng ban lấy từ API
  const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);

  // State quản lý tiêu chí tìm kiếm người dùng nhập vào
  const [searchName, setSearchName] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined);
  
  // Trạng thái hiển thị vòng xoay chờ khi gọi API
  const [loading, setLoading] = useState(true);
  
  // Số lượng bản ghi hiển thị trên mỗi trang
  const [pageSize, setPageSize] = useState(20);

  /**
   * Cấu hình thứ tự sắp xếp mặc định theo yêu cầu thiết kế.
   * Ưu tiên: Tên nhân viên (ASC) > Tên Chứng chỉ (ASC) > Ngày hết hạn (ASC).
   */
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    employeeName: 'asc',
    certificationName: 'asc',
    certificationEndDate: 'asc'
  });

  // Trạng thái quản lý phân trang
  const [currentPage, setCurrentPage] = useState(0); // Bắt đầu từ 0 theo chuẩn Spring Data JPA
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /** 
   * Effect: Khởi tạo dữ liệu khi lần đầu truy cập trang.
   * 
   * 1. Khôi phục điều kiện tìm kiếm từ Session Storage (nếu có).
   * 2. Tải danh sách phòng ban cho Dropdown.
   * 3. Thực hiện lần tìm kiếm đầu tiên.
   */
  useEffect(() => {
    const initData = async () => {
      try {
        // Đọc dữ liệu từ Session Storage để người dùng quay lại vẫn thấy kết quả cũ
        const storedName = storage.session.get<string>('adm002_searchName') || '';
        const storedDeptId = storage.session.get<string>('adm002_selectedDeptId');
        const parsedDeptId = storedDeptId ? Number(storedDeptId) : undefined;

        // Đồng bộ hóa State với dữ liệu vừa khôi phục
        setSearchName(storedName);
        if (parsedDeptId) setSelectedDeptId(parsedDeptId);

        // Tải danh sách phòng ban để hiển thị trong ô lọc
        const deptData = await departmentApi.getAllDepartments();
        setDepartments(deptData);

        // Kích hoạt tìm kiếm nhân viên lần đầu (Trang 0)
        await fetchEmployees(0, storedName, parsedDeptId);
      } catch (error) {
        // Chuyển hướng sang trang lỗi nếu API Master Data thất bại
        router.push('/employees/system_error');
      } finally {
        setLoading(false);
      }
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, sortConfig]); // Tải lại khi thay đổi kích thước trang hoặc cấu hình sort

  /**
   * Hàm cốt lõi để gọi API lấy danh sách nhân viên.
   * 
   * @param page Chỉ số trang cần lấy.
   * @param name Tên nhân viên (tùy chọn).
   * @param deptId ID phòng ban (tùy chọn).
   * @param size Kích thước trang (tùy chọn).
   */
  const fetchEmployees = async (page: number, name?: string, deptId?: number, size?: number) => {
    setLoading(true);
    try {
      /**
       * Ánh xạ (Map) các cột Sort trên giao diện sang các thuộc tính 
       * (Property path) tương ứng trong Model ở Backend.
       */
      const sort = [
        `employeeName,${sortConfig.employeeName}`,
        `employeesCertifications.certification.certificationName,${sortConfig.certificationName}`,
        `employeesCertifications.endDate,${sortConfig.certificationEndDate}`
      ];

      // Xác định giá trị tìm kiếm cuối cùng (Ưu tiên tham số truyền vào hơn state hiện tại)
      const actualName = name !== undefined ? name : searchName;
      const actualDeptId = deptId !== undefined ? deptId : selectedDeptId;

      /**
       * Lưu trữ điều kiện tìm kiếm hiện tại vào Session Storage.
       * Điều này cho phép "nhớ" trạng thái tìm kiếm khi người dùng điều hướng.
       */
      storage.session.set('adm002_searchName', actualName);
      if (actualDeptId !== undefined) {
        storage.session.set('adm002_selectedDeptId', String(actualDeptId));
      } else {
        storage.session.remove('adm002_selectedDeptId');
      }

      // Thực hiện gọi API lấy danh sách nhân viên có phân trang và sắp xếp
      const data = await employeeApi.getAllEmployees({
        name: actualName,
        departmentId: actualDeptId,
        page: page,
        size: size || pageSize,
        sort: sort
      });

      // Xử lý kết quả trả về từ Backend dựa trên mã thành công
      if (data.code === API_STATUS_CODES.SUCCESS) {
        setEmployees(data.employees || []);
        // Tính toán tổng số trang dựa trên tổng số bản ghi và kích thước trang
        setTotalPages(Math.ceil((data.totalRecords || 0) / (size || pageSize)));
        setTotalElements(data.totalRecords || 0);
        setCurrentPage(page);
      } else {
        // Reset dữ liệu nếu API trả về mã không thành công
        setEmployees([]);
        setTotalPages(0);
        setTotalElements(0);
        setCurrentPage(0);
      }
    } catch (error) {
      // Điều hướng sang trang lỗi hệ thống nếu xảy ra lỗi mạng hoặc lỗi server (500)
      router.push('/employees/system_error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý khi người dùng nhấn nút Tìm Kiếm hoặc nhấn Enter trong form.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Luôn quay lại trang đầu tiên (index 0) khi thực hiện tìm kiếm mới
    fetchEmployees(0, searchName.trim(), selectedDeptId);
  };

  /**
   * Xử lý khi người dùng nhấn chuyển số trang trên thanh phân trang.
   * 
   * @param page Chỉ số trang mới.
   */
  const handlePageChange = (page: number) => {
    // Đảm bảo chỉ số trang nằm trong phạm vi hợp lệ
    if (page >= 0 && page < totalPages) {
      fetchEmployees(page);
    }
  };

  /**
   * Xử lý đảo chiều sắp xếp (asc <-> desc) cho một cột cụ thể.
   * 
   * @param field Tên cột cần sắp xếp.
   */
  const handleSort = (field: keyof SortConfig) => {
    setSortConfig(prev => ({
      ...prev,
      [field]: prev[field] === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    // Trạng thái dữ liệu (States)
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
    // Các hàm hành động (Actions)
    handleSearch,
    handlePageChange,
    handleSort
  };
}
