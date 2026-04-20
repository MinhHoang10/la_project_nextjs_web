/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeTable.tsx, 4/13/2026 NguyenHuyHoang
 */
import React from 'react';
import Link from 'next/link';
import { EmployeeDTO } from '@/types/employee';

/**
 * Cấu hình tham số đánh dấu Cột nào đang được Sort (Tăng/Giảm dần).
 */
export interface SortConfig {
  employeeName: 'asc' | 'desc';
  certificationName: 'asc' | 'desc';
  certificationEndDate: 'asc' | 'desc';
}

/** Tham số (Props) truyền từ phần tử Cha xuống bảng. */
interface EmployeeTableProps {
  employees: EmployeeDTO[];
  sortConfig: SortConfig;
  onSort: (field: keyof SortConfig) => void; // Hàm callback kích hoạt API sort
}

/**
 * Component Hiển thị lưới List danh sách dưới dạng CSS Grid thay vì Table truyền thống.
 * Cột có icon Mũi tên (▲ ▼) là cột cho phép thao tác nhấp chuột để Sort.
 */
export function EmployeeTable({ employees, sortConfig, onSort }: EmployeeTableProps) {

  const getSortIcon = (field: keyof SortConfig) => {
    return sortConfig[field] === 'asc' ? '▲▼' : '▼▲';
  };

  return (
    <>
      <div className="css-grid-table-header">
        <div>ID</div>
        <div className="cursor-pointer" onClick={() => onSort('employeeName')}>
          氏名 {getSortIcon('employeeName')}
        </div>
        <div>生年月日</div>
        <div>グループ</div>
        <div>メールアドレス</div>
        <div>電話番号</div>
        <div className="cursor-pointer" onClick={() => onSort('certificationName')}>
          日本語能力 {getSortIcon('certificationName')}
        </div>
        <div className="cursor-pointer" onClick={() => onSort('certificationEndDate')}>
          失効日 {getSortIcon('certificationEndDate')}
        </div>
        <div>点数</div>
      </div>
      <div className="css-grid-table-body">
        {employees.length > 0 ? (
          employees.map((emp) => (
            <div key={emp.employeeId} className="employee-row-contents" style={{ display: 'contents' }}>
              <div className="bor-l-none text-center">
                <Link href={`/employees/adm003/${emp.employeeId}`}>{emp.employeeId}</Link>
              </div>
              <div>{emp.employeeName}</div>
              <div>{emp.employeeBirthDate?.replaceAll('-', '/')}</div>
              <div>{emp.departmentName}</div>
              <div>{emp.employeeEmail}</div>
              <div>{emp.employeeTelephone}</div>
              <div>{emp.certificationName || ''}</div>
              <div>{emp.certificationEndDate?.replaceAll('-', '/')}</div>
              <div>{emp.certificationScore}</div>
            </div>
          ))
        ) : (
          <div className="text-center p-3" style={{ gridColumn: 'span 9' }}>
            データが見つかりませんでした。
          </div>
        )}
      </div>
    </>
  );
}
