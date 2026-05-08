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
    employee_name    VARCHAR(250) NOT NULL,
    employee_name_kana VARCHAR(250) NOT NULL,
    employee_birth_date date       NOT NULL,
    employee_email   VARCHAR(250)  NOT NULL,
    employee_telephone VARCHAR(250) NOT NULL,
    employee_login_id VARCHAR(250) NOT NULL UNIQUE,
    employee_login_password VARCHAR(250) DEFAULT NULL,
    employee_role INT(11) DEFAULT 0 NOT NULL,
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


