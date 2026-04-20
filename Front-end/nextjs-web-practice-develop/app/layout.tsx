/**
 * Copyright(C) 2026 Luvina Software Company
 * layout.tsx, 4/13/2026 NguyenHuyHoang
 */
'use client'
import './globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { usePathname } from 'next/navigation';

/**
 * Bố cục (Layout) tổng quan của toàn bộ thẻ HTML sinh ra.
 * Quản lý việc hiển thị Header và Footer. Sẽ ẩn Header/Footer nếu đang ở màn hình Đăng nhập (Login).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Tự động chèn các Page route bên trong khối này
}) {
  const pathname = usePathname();
  const showHeaderFooter = !pathname.includes('/login');
  
  return (
    <html lang="ja">
      <body>
        {showHeaderFooter ? (
          <main>
            <div className="container">
              <Header />
              <div className="content">
                <div className="content-main">
        {children}
                </div>
              </div>
              <Footer />
            </div>
          </main>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
