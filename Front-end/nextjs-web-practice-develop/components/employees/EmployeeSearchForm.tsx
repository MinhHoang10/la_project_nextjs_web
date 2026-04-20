/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeSearchForm.tsx, 4/13/2026 NguyenHuyHoang
 */
import React from 'react';
import { DepartmentDTO } from '@/types/department';
import { useRouter } from 'next/navigation';

/**
 * Các tham số (Props) truyền từ trang List xuống cho Component Tìm kiếm.
 */
interface EmployeeSearchFormProps {
  searchName: string;
  onSearchNameChange: (val: string) => void;
  selectedDeptId?: number;
  onDeptChange: (val?: number) => void;
  departments: DepartmentDTO[]; // Nguồn List phòng ban sinh Dropdown
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Component Khối ô nhập liệu tìm kiếm ở nửa trên màn hình danh sách.
 * Bao gồm Nút Tìm kiếm và Nút Chuyển trang Thêm Mới.
 */
export function EmployeeSearchForm({
  searchName,
  onSearchNameChange,
  selectedDeptId,
  onDeptChange,
  departments,
  onSubmit
}: EmployeeSearchFormProps) {
  const router = useRouter();

  return (
    <div className="search-memb">
      <h1 className="title">会員名称で会員を検索します。検索条件無しの場合は全て表示されます。</h1>
      <form className="c-form" onSubmit={onSubmit}>
        <ul className="d-flex">
          <li className="form-group row">
            <label className="col-form-label">氏名:</label>
            <div className="col-sm">
              <input
                type="text"
                value={searchName}
                onChange={(e) => onSearchNameChange(e.target.value)}
                maxLength={125}
              />
            </div>
          </li>
          <li className="form-group row">
            <label className="col-form-label">グループ:</label>
            <div className="col-sm">
              <select
                value={selectedDeptId || ''}
                onChange={(e) => onDeptChange(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">全て</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </li>
          <li className="form-group row">
            <div className="btn-group">
              <button type="submit" className="btn btn-primary btn-sm">検索</button>
              <button
                type="button"
                onClick={() => router.push('/employees/adm004?mode=add')}
                className="btn btn-secondary btn-sm"
              >
                新規追加
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
