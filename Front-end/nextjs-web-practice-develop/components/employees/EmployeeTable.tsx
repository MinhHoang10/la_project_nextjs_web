/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeTable.tsx, 4/13/2026 NguyenHuyHoang
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { EmployeeDTO } from '@/types/employee';
import { getEmployeeLabel } from '@/lib/validation/employee';

/**
 * Cấu hình tham số đánh dấu Cột nào đang được Sort (Tăng/Giảm dần).
 */
export interface SortConfig {
  employeeName: 'asc' | 'desc';
  certificationName: 'asc' | 'desc';
  certificationEndDate: 'asc' | 'desc';
}

/** Tham số truyền từ phần tử Cha xuống bảng. */
interface EmployeeTableProps {
  employees: EmployeeDTO[];
  sortConfig: SortConfig;
  onSort: (field: keyof SortConfig) => void;
}

/**
 * Component Hiển thị lưới List danh sách dưới dạng CSS Grid.
 * Cột có icon Mũi tên (▲ ▼) là cột cho phép thao tác nhấp chuột để Sort.
 */
export function EmployeeTable({ employees, sortConfig, onSort }: EmployeeTableProps) {

  const getSortIcon = (field: keyof SortConfig) => {
    return sortConfig[field] === 'asc' ? '▲▼' : '▼▲';
  };

  return (
    <>
      <div className="css-grid-table-header">
        <div>{getEmployeeLabel('employeeId')}</div>
        <div className="cursor-pointer" onClick={() => onSort('employeeName')}>
          {getEmployeeLabel('employeeName')} {getSortIcon('employeeName')}
        </div>
        <div>{getEmployeeLabel('employeeBirthDate')}</div>
        <div>{getEmployeeLabel('departmentId')}</div>
        <div>{getEmployeeLabel('employeeEmail')}</div>
        <div>{getEmployeeLabel('employeeTelephone')}</div>
        <div className="cursor-pointer" onClick={() => onSort('certificationName')}>
          {getEmployeeLabel('certificationName')} {getSortIcon('certificationName')}
        </div>
        <div className="cursor-pointer" onClick={() => onSort('certificationEndDate')}>
          {getEmployeeLabel('certificationEndDate')} {getSortIcon('certificationEndDate')}
        </div>
        <div>{getEmployeeLabel('certificationScore')}</div>
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
