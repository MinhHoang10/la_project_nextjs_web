/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeListForm.tsx, 4/28/2026 NguyenHuyHoang
 */
'use client';

import { useADM002 } from '@/hooks/useADM002';
import { EmployeeSearchForm } from '@/components/employees/EmployeeSearchForm';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { Pagination } from '@/components/common/Pagination';

/**
 * Component quản lý toàn bộ giao diện và dữ liệu của màn hình Danh sách nhân viên (ADM002).
 */
export default function EmployeeListForm() {
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
