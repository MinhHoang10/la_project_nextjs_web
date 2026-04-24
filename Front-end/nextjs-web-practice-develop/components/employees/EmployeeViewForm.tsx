/**
 * Copyright(C) 2026 Luvina Software Company
 * EmployeeViewForm.tsx, 4/24/2026 Nguyen Huy Hoang
 */
'use client';

import { EmployeeDTO } from '@/types/employee';

/**
 * Định nghĩa các thuộc tính đầu vào cho Component EmployeeViewForm.
 */
interface EmployeeViewFormProps {
  employee: EmployeeDTO;   // Đối tượng chứa thông tin nhân viên
  onEdit: () => void;      // Hàm xử lý sự kiện nút Chỉnh sửa
  onBack: () => void;      // Hàm xử lý sự kiện nút Quay lại
  onDelete: () => void;    // Hàm xử lý sự kiện nút Xóa
}

/**
 * Component hiển thị thông tin chi tiết của nhân viên dưới dạng Form.
 * Chỉ chịu trách nhiệm hiển thị dữ liệu (Presentational Component).
 */
export default function EmployeeViewForm({ employee, onEdit, onBack, onDelete }: EmployeeViewFormProps) {
  return (
    <form className="c-form box-shadow">
      <ul className="show-data">
        <li className="title">情報確認</li>
        
        {/* Thông tin cơ bản */}
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">アカウント名</label>
          <div className="col-sm col-sm-10">{employee.employeeLoginId}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">グループ</label>
          <div className="col-sm col-sm-10">{employee.departmentName}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">氏名</label>
          <div className="col-sm col-sm-10">{employee.employeeName}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">カタカナ氏名</label>
          <div className="col-sm col-sm-10">{employee.employeeNameKana}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">生年月日</label>
          <div className="col-sm col-sm-10">{employee.employeeBirthDate?.replaceAll('-', '/')}</div>
        </li>
        <li className="form-group row d-flex">
          <label className="col-form-label col-sm-2">メールアドレス</label>
          <div className="col-sm col-sm-10">{employee.employeeEmail}</div>
        </li>
        <li className="form-group row d-flex bor-none">
          <label className="col-form-label col-sm-2">電話番号</label>
          <div className="col-sm col-sm-10">{employee.employeeTelephone}</div>
        </li>

        {/* Thông tin chứng chỉ (Chỉ hiển thị nếu nhân viên có chứng chỉ) */}
        {employee.certificationName && (
          <>
            <li className="title mt-12"><a href="#!">日本語能力</a></li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">資格</label>
              <div className="col-sm col-sm-10">{employee.certificationName}</div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">資格交付日</label>
              <div className="col-sm col-sm-10">{employee.certificationStartDate?.replaceAll('-', '/')}</div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">失効日</label>
              <div className="col-sm col-sm-10">{employee.certificationEndDate?.replaceAll('-', '/')}</div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">点数</label>
              <div className="col-sm col-sm-10">{employee.certificationScore}</div>
            </li>
          </>
        )}

        {/* Nhóm nút bấm hành động */}
        <li className="form-group row d-flex">
          <div className="btn-group col-sm col-sm-10 ml">
            <button 
              type="button" 
              onClick={onEdit} 
              className="btn btn-primary btn-sm"
            >
              編集
            </button>
            <button 
              type="button" 
              onClick={onDelete}
              className="btn btn-secondary btn-sm"
            >
              削除
            </button>
            <button 
              type="button" 
              onClick={onBack} 
              className="btn btn-secondary btn-sm"
            >
              戻る
            </button>
          </div>
        </li>
      </ul>
    </form>
  );
}
