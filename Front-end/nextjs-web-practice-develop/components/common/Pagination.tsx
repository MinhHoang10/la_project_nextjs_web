/**
 * Copyright(C) 2026 Luvina Software Company
 * Pagination.tsx, 4/13/2026 NguyenHuyHoang
 */
import React from 'react';

/** Props đón thông số phân trang từ Component Danh Sách. */
interface PaginationProps {
  currentPage: number; // Chỉ số 0 là Trang đầu.
  totalPages: number;
  onPageChange: (page: number) => void; // Callback bắn sự kiện fetch lên lại API
}

/**
 * Thanh công cụ điều hướng phân trang chung (dùng cho nhiều màn nếu cần).
 * Tự động tạo khối các nút bằng hàm tính toán lùi/tiến. 
 * Kèm trạng thái dấu ba chấm `...` nếu khoáng cách số trang > 1.
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return <div className="pagin" style={{ display: 'none' }}></div>;
  }

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const delta = 1;
    const left = currentPage + 1 - delta;
    const right = currentPage + 1 + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= left && i <= right)
      ) {
        range.push(i);
      }
    }

    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i of range) {
      if (typeof i === 'number') {
        if (l) {
          if (i - l > 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
    }

    return rangeWithDots;
  };

  return (
    <div className="pagin" style={{ display: 'flex' }}>
      <button
        className={`btn btn-sm btn-pre btn-falcon-default ${currentPage === 0 ? 'btn-disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <svg className="svg-inline--fa fa-chevron-left fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>
      </button>

      {getPaginationRange().map((p, idx) => (
        p === '...' ? (
          <span key={`dots-${idx}`} className="btn btn-sm btn-falcon-default" style={{ cursor: 'default' }}>...</span>
        ) : (
          <button
            key={`page-${p}`}
            className={`btn btn-sm btn-falcon-default ${currentPage === Number(p) - 1 ? 'text-primary active' : 'text-primary'}`}
            onClick={() => onPageChange(Number(p) - 1)}
          >
            {p}
          </button>
        )
      ))}

      <button
        className={`btn btn-sm btn-next btn-falcon-default ${currentPage === totalPages - 1 ? 'btn-disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <svg className="svg-inline--fa fa-chevron-right fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>
      </button>
    </div>
  );
}
