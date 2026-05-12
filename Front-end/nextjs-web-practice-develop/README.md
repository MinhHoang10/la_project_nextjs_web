# Employee Management Frontend (Next.js)

This project is a Next.js implementation of the Employee Management Frontend.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8085`

## Environment Variables

Tạo file `.env.local` ở thư mục gốc của dự án và thêm nội dung sau:

```env
NEXT_PUBLIC_API_URL=http://localhost:8085
```

## Chi tiết triển khai

- **Framework**: Next.js 16.0.8 (App Router)
- **API Client**: Axios 1.13.2
- **Xử lý Form**: React Hook Form + Zod

### Các tính năng đã thực hiện

- **Xác thực người dùng**: Triển khai đầy đủ chức năng đăng nhập và đăng xuất.
- **Quản lý nhân viên**: Các thao tác CRUD bao gồm danh sách (ADM002), thêm mới (ADM004/005), và thông báo hoàn tất (ADM006).

## Cấu trúc thư mục & Chức năng

### `app/`
- `(protected)/employees/`: Chứa các trang quản lý nhân viên (ADM002 đến ADM006).
- `(auth)/login/`: Các trang liên quan đến đăng nhập.

### `components/employees/`
- `EmployeeListForm.tsx`: Giao diện trang danh sách nhân viên (ADM002).
- `EmployeeInputForm.tsx`: Giao diện trang nhập liệu nhân viên (ADM004).
- `EmployeeConfirmForm.tsx`: Giao diện trang xác nhận thông tin nhân viên (ADM005).
- `EmployeeCompleteContent.tsx`: Giao diện trang thông báo hoàn tất xử lý (ADM006).

### `hooks/`
- `useADM002.ts`: Xử lý logic tìm kiếm, phân trang và sắp xếp.
- `useADM004.ts`: Xử lý logic nhập và xác nhận thông tin nhân viên.
- `useADM005.ts`: Xử lý logic gửi dữ liệu lên Backend.

### `lib/`
- `api/`: Các dịch vụ gọi API và cấu hình Axios.
- `constants/`: Các hằng số dùng chung trong ứng dụng.
- `validations/`: Các schema dùng để validate form bằng Zod.
