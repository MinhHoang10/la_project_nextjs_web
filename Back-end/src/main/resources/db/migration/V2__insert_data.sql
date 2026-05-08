-- =============================================
-- Data: departments
-- =============================================
INSERT IGNORE INTO departments (department_id, department_name) VALUES
    (1, 'Hành chính'),
    (2, 'Kỹ thuật'),
    (3, 'Kinh doanh'),
    (4, 'Nhân sự'),
    (5, 'Kế toán');

-- =============================================
-- Data: certifications (Trình độ tiếng Nhật N1~N5)
-- =============================================
INSERT IGNORE INTO certifications (certification_id, certification_name, certification_level) VALUES
    (1, 'Trình độ tiếng nhật cấp 1', 1),
    (2, 'Trình độ tiếng nhật cấp 2', 2),
    (3, 'Trình độ tiếng nhật cấp 3', 3),
    (4, 'Trình độ tiếng nhật cấp 4', 4),
    (5, 'Trình độ tiếng nhật cấp 5', 5);

-- =============================================
-- Data: employees
-- =============================================
INSERT IGNORE INTO employees (employee_id, department_id, employee_name, employee_name_kana, employee_birth_date, employee_email, employee_telephone, employee_login_id, employee_login_password, employee_role)
VALUES
    (1, 1, 'Administrator',        'アドミニストレーター', '1990-01-01', 'la@luvina.net',          '0123456789', 'admin',    '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW', 1),
    (2, 2, 'Nguyễn Thị Mai Hương', '名カナ',               '2003-07-08', 'ntmhuong@luvina.net',    '0914326386', 'ntmhuong', '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW', 0),
    (3, 2, 'Nguyễn Huy Hoàng',          'トラン バン アン',      '2003-05-15', 'hoangnh@luvina.net',         '0912345678', 'tvan',     '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW', 0),
    (4, 3, 'Nguyễn Anh Thứ',          'レ ティ ビック',        '2003-11-20', 'thuna@luvina.net',       '0987654321', 'ltbich',   '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW', 0),
    (5, 3, 'Nguyễn Xuân Phi Long',        'ファム ミン ドゥク',     '2003-03-10', 'longnxp@luvina.net',        '0909090909', 'pmduc',    '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW', 0);

-- =============================================
-- Data: employees_certifications
-- =============================================
INSERT IGNORE INTO employees_certifications (employee_certification_id, employee_id, certification_id, start_date, end_date, score)
VALUES
    (1, 2, 1, '2010-07-08', '2010-07-08', 290),
    (2, 3, 2, '2015-03-01', '2025-03-01', 350),
    (3, 4, 3, '2018-09-10', '2023-09-10', 260),
    (4, 5, 2, '2019-06-15', '2024-06-15', 400);
