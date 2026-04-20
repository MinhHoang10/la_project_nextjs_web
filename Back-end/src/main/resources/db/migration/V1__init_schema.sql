-- =============================================
-- Table: departments (グループ)
-- =============================================
CREATE TABLE IF NOT EXISTS `departments` (
    department_id bigint(20) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =============================================
-- Table: certifications (資格 - Chứng chỉ tiếng Nhật)
-- =============================================
CREATE TABLE IF NOT EXISTS `certifications` (
    certification_id bigint(20) NOT NULL AUTO_INCREMENT,
    certification_name VARCHAR(50) NOT NULL,
    certification_level int(11) NOT NULL,
    PRIMARY KEY (`certification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =============================================
-- Table: employees (社員)
-- =============================================
CREATE TABLE IF NOT EXISTS `employees` (
    employee_id      bigint(20)   NOT NULL AUTO_INCREMENT,
    department_id    bigint(20)   NOT NULL,
    employee_name    VARCHAR(100) NOT NULL,
    employee_name_kana VARCHAR(100) NOT NULL,
    employee_birth_date date       NOT NULL,
    employee_email   VARCHAR(50)  NOT NULL,
    employee_telephone VARCHAR(50) NOT NULL,
    employee_login_id VARCHAR(50) NOT NULL UNIQUE,
    employee_login_password VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (`employee_id`),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments(department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =============================================
-- Table: employees_certifications (社員資格)
-- =============================================
CREATE TABLE IF NOT EXISTS `employees_certifications` (
    employee_certification_id bigint(20)    NOT NULL AUTO_INCREMENT,
    employee_id               bigint(20)    NOT NULL,
    certification_id          bigint(20)    NOT NULL,
    start_date                date          NOT NULL,
    end_date                  date          NOT NULL,
    score                     decimal(10,2) NOT NULL,
    PRIMARY KEY (`employee_certification_id`),
    CONSTRAINT fk_emp_cert_employee      FOREIGN KEY (employee_id)      REFERENCES employees(employee_id),
    CONSTRAINT fk_emp_cert_certification FOREIGN KEY (certification_id) REFERENCES certifications(certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- =============================================
-- Data: departments
-- =============================================
INSERT INTO departments (department_name) VALUES
    ('Hành chính'),
    ('Kỹ thuật'),
    ('Kinh doanh'),
    ('Nhân sự'),
    ('Kế toán');

-- =============================================
-- Data: certifications (Trình độ tiếng Nhật N1~N5)
-- certification_level: 1=N1 (cao nhất) -> 5=N5 (thấp nhất)
-- =============================================
INSERT INTO certifications (certification_name, certification_level) VALUES
    ('Trình độ tiếng nhật cấp 1', 1),
    ('Trình độ tiếng nhật cấp 2', 2),
    ('Trình độ tiếng nhật cấp 3', 3),
    ('Trình độ tiếng nhật cấp 4', 4),
    ('Trình độ tiếng nhật cấp 5', 5);

-- =============================================
-- Data: employees
-- Password "admin" => BCrypt hash
-- =============================================
INSERT INTO employees (department_id, employee_name, employee_name_kana, employee_birth_date, employee_email, employee_telephone, employee_login_id, employee_login_password)
VALUES
    (1, 'Administrator',        'アドミニストレーター', '1990-01-01', 'la@luvina.net',          '0123456789', 'admin',    '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW'),
    (2, 'Nguyễn Thị Mai Hương', '名カナ',               '2003-07-08', 'ntmhuong@luvina.net',    '0914326386', 'ntmhuong', '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW'),
    (2, 'Nguyễn Huy Hoàng',          'トラン バン アン',      '2003-05-15', 'hoangnh@luvina.net',         '0912345678', 'tvan',     '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW'),
    (3, 'Nguyễn Anh Thứ',          'レ ティ ビック',        '2003-11-20', 'thuna@luvina.net',       '0987654321', 'ltbich',   '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW'),
    (3, 'Nguyễn Xuân Phi Long',        'ファム ミン ドゥク',     '2003-03-10', 'longnxp@luvina.net',        '0909090909', 'pmduc',    '$2a$10$w5Zu25V9Nt5zGW/P2W.8Eev/EMGmrCeqoHUN3the0lBjMCMSodCxW');

-- =============================================
-- Data: employees_certifications
-- =============================================
INSERT INTO employees_certifications (employee_id, certification_id, start_date, end_date, score)
VALUES
    (2, 1, '2010-07-08', '2010-07-08', 290),
    (3, 2, '2015-03-01', '2025-03-01', 350),
    (4, 3, '2018-09-10', '2023-09-10', 260),
    (5, 2, '2019-06-15', '2024-06-15', 400);

