/**
 * Copyright(C) 2026 Luvina Software Company
 * page.tsx, 4/23/2026 NguyenHuyHoang
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Màn hình thông báo lỗi hệ thống (System Error).
 * Hiển thị khi xảy ra các lỗi không mong muốn hoặc Exception từ phía Server.
 */
export default function SystemErrorPage() {
  const router = useRouter();

  /**
   * Quay về màn hình danh sách (Top page - ADM002)
   */
  const handleOk = () => {
    router.push('/employees/adm002');
  };

  return (
    <div className="notification-box">
      <h1 className="title note-err">システムエラーが発生しました。</h1>
      <button 
        type="button" 
        className="btn btn-primary btn-sm" 
        onClick={handleOk}
      >
        OK
      </button>
    </div>
  );
}
