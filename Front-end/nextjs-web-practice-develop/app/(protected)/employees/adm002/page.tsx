/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx, 4/13/2026 NguyenHuyHoang
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useADM002 } from '@/hooks/useADM002';
import { EmployeeSearchForm } from '@/components/employees/EmployeeSearchForm';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { Pagination } from '@/components/common/Pagination';

/**
 * Trang danh sách nhân viên - Entry point chính của ứng dụng sau khi đăng nhập.
 * Nó là lớp ngoài cùng kết nối Hook dữ liệu (useADM002) tiêm vào các UI Components (SearchForm, Table, Pagination).
 */
export default function EmployeeListPage() {
  useAuth();

  const {
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
    handleSearch,
    handlePageChange,
    handleSort
  } = useADM002();

  if (loading && employees.length === 0) {
    return <div className="p-4">読み込み中...</div>;
  }

  return (
    <>
      <EmployeeSearchForm
        searchName={searchName}
        onSearchNameChange={setSearchName}
        selectedDeptId={selectedDeptId}
        onDeptChange={setSelectedDeptId}
        departments={departments}
        onSubmit={handleSearch}
      />
      <div className="row row-table">
        <div className="css-grid-table box-shadow">
          <EmployeeTable 
            employees={employees} 
            sortConfig={sortConfig} 
            onSort={handleSort} 
          />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
    </>
  );
}
