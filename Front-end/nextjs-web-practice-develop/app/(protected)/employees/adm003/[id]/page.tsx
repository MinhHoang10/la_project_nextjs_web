'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { employeeApi } from '@/lib/api/employee.api';
import { EmployeeDTO } from '@/types/employee';

export default function EmployeeDetailPage() {
  useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [employee, setEmployee] = useState<EmployeeDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      employeeApi.getEmployeeById(id).then(data => {
        setEmployee(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (!employee) return <div className="p-4 text-center">Không tìm thấy thông tin nhân viên.</div>;
  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">情報確認</li>
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
          <li className="form-group row d-flex  bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">{employee.employeeTelephone}</div>
          </li>
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
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={() => router.push(`/employees/adm004?mode=edit&id=${id}`)} className="btn btn-primary btn-sm">編集</button>
              <button type="button" className="btn btn-secondary btn-sm">削除</button>
              <button type="button" onClick={() => router.push('/employees/adm002')} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}

