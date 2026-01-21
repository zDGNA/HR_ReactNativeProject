-- ==================== HRD DATABASE SETUP ====================
-- Database: hrd
-- Created: 2025

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS hrd;
USE hrd;

-- ==================== TABLE: users ====================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, password, email, role) VALUES
('admin', 'admin123', 'admin@perusahaan.com', 'Administrator');

-- ==================== TABLE: divisions ====================
CREATE TABLE IF NOT EXISTS divisions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  color VARCHAR(7) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample divisions
INSERT INTO divisions (name, description, color, icon) VALUES
('IT', 'Information Technology', '#3b82f6', 'desktop'),
('HR', 'Human Resources', '#ec4899', 'people'),
('Finance', 'Finance Department', '#10b981', 'wallet'),
('Marketing', 'Marketing Division', '#f59e0b', 'megaphone');

-- ==================== TABLE: employees ====================
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  contract_end_date DATE NOT NULL,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  division_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);

-- Insert sample employees untuk IT Division (id=1)
INSERT INTO employees (name, position, age, email, phone, address, contract_end_date, status, division_id) VALUES
('Budi Santoso', 'Senior Developer', 28, 'budi.santoso@perusahaan.com', '081234567890', 'Jl. Sudirman No. 123, Jakarta', '2025-12-31', 'Active', 1),
('Ahmad Wijaya', 'Junior Developer', 24, 'ahmad.wijaya@perusahaan.com', '081234567891', 'Jl. Gatot Subroto No. 45, Jakarta', '2026-06-30', 'Active', 1),
('Rizky Pratama', 'DevOps Engineer', 30, 'rizky.pratama@perusahaan.com', '081234567892', 'Jl. Thamrin No. 67, Jakarta', '2025-09-15', 'Active', 1),
('Dedi Kurniawan', 'UI/UX Designer', 26, 'dedi.kurniawan@perusahaan.com', '081234567893', 'Jl. Rasuna Said No. 89, Jakarta', '2026-03-20', 'Active', 1),
('Fajar Ramadhan', 'QA Tester', 25, 'fajar.ramadhan@perusahaan.com', '081234567894', 'Jl. HR Rasuna Said No. 12, Jakarta', '2025-11-10', 'Inactive', 1);

-- Insert sample employees untuk HR Division (id=2)
INSERT INTO employees (name, position, age, email, phone, address, contract_end_date, status, division_id) VALUES
('Siti Nurhaliza', 'HR Manager', 32, 'siti.nurhaliza@perusahaan.com', '081234567895', 'Jl. Kuningan No. 34, Jakarta', '2026-08-15', 'Active', 2),
('Dewi Lestari', 'Recruitment Specialist', 27, 'dewi.lestari@perusahaan.com', '081234567896', 'Jl. Casablanca No. 56, Jakarta', '2025-10-20', 'Active', 2),
('Rina Wijayanti', 'Training Coordinator', 29, 'rina.wijayanti@perusahaan.com', '081234567897', 'Jl. MT Haryono No. 78, Jakarta', '2026-02-28', 'Active', 2),
('Maya Sari', 'Payroll Officer', 31, 'maya.sari@perusahaan.com', '081234567898', 'Jl. Senopati No. 90, Jakarta', '2025-07-15', 'Inactive', 2);

-- Insert sample employees untuk Finance Division (id=3)
INSERT INTO employees (name, position, age, email, phone, address, contract_end_date, status, division_id) VALUES
('Eko Prasetyo', 'Finance Manager', 35, 'eko.prasetyo@perusahaan.com', '081234567899', 'Jl. Scbd No. 11, Jakarta', '2026-12-31', 'Active', 3),
('Linda Setiawati', 'Accountant', 28, 'linda.setiawati@perusahaan.com', '081234567900', 'Jl. Pancoran No. 22, Jakarta', '2025-09-30', 'Active', 3),
('Agus Setiawan', 'Tax Specialist', 33, 'agus.setiawan@perusahaan.com', '081234567901', 'Jl. Tebet No. 33, Jakarta', '2026-05-15', 'Active', 3),
('Wati Rahayu', 'Budget Analyst', 30, 'wati.rahayu@perusahaan.com', '081234567902', 'Jl. Menteng No. 44, Jakarta', '2025-12-20', 'Active', 3),
('Hendra Gunawan', 'Finance Assistant', 26, 'hendra.gunawan@perusahaan.com', '081234567903', 'Jl. Kemang No. 55, Jakarta', '2026-01-10', 'Inactive', 3);

-- Insert sample employees untuk Marketing Division (id=4)
INSERT INTO employees (name, position, age, email, phone, address, contract_end_date, status, division_id) VALUES
('Andi Saputra', 'Marketing Manager', 34, 'andi.saputra@perusahaan.com', '081234567904', 'Jl. Senayan No. 66, Jakarta', '2026-11-30', 'Active', 4),
('Putri Maharani', 'Digital Marketing', 27, 'putri.maharani@perusahaan.com', '081234567905', 'Jl. Blok M No. 77, Jakarta', '2025-08-25', 'Active', 4),
('Reza Firmansyah', 'Content Creator', 25, 'reza.firmansyah@perusahaan.com', '081234567906', 'Jl. Fatmawati No. 88, Jakarta', '2026-04-15', 'Active', 4),
('Dina Amelia', 'Social Media Manager', 29, 'dina.amelia@perusahaan.com', '081234567907', 'Jl. Cilandak No. 99, Jakarta', '2025-06-30', 'Active', 4),
('Bambang Sutrisno', 'Brand Strategist', 32, 'bambang.sutrisno@perusahaan.com', '081234567908', 'Jl. Pondok Indah No. 100, Jakarta', '2026-07-20', 'Inactive', 4);

-- ==================== INDEXES untuk performa ====================
CREATE INDEX idx_employees_division ON employees(division_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_contract_end ON employees(contract_end_date);

-- ==================== VIEWS untuk reporting ====================
-- View untuk melihat karyawan dengan info divisi lengkap
CREATE OR REPLACE VIEW vw_employees_full AS
SELECT 
    e.id,
    e.name,
    e.position,
    e.age,
    e.email,
    e.phone,
    e.address,
    e.contract_end_date,
    e.status,
    e.division_id,
    d.name as division_name,
    d.description as division_description,
    d.color as division_color,
    d.icon as division_icon,
    DATEDIFF(e.contract_end_date, CURDATE()) as days_until_contract_end
FROM employees e
LEFT JOIN divisions d ON e.division_id = d.id;

-- View untuk statistik per divisi
CREATE OR REPLACE VIEW vw_division_stats AS
SELECT 
    d.id,
    d.name,
    d.description,
    d.color,
    d.icon,
    COUNT(e.id) as total_employees,
    SUM(CASE WHEN e.status = 'Active' THEN 1 ELSE 0 END) as active_employees,
    SUM(CASE WHEN e.status = 'Inactive' THEN 1 ELSE 0 END) as inactive_employees,
    SUM(CASE WHEN DATEDIFF(e.contract_end_date, CURDATE()) <= 30 AND e.status = 'Active' THEN 1 ELSE 0 END) as contracts_expiring_soon
FROM divisions d
LEFT JOIN employees e ON d.id = e.division_id
GROUP BY d.id, d.name, d.description, d.color, d.icon;

-- ==================== SUCCESS MESSAGE ====================
SELECT 'Database HRD berhasil dibuat!' as message;
SELECT 'Total Users:' as info, COUNT(*) as count FROM users;
SELECT 'Total Divisions:' as info, COUNT(*) as count FROM divisions;
SELECT 'Total Employees:' as info, COUNT(*) as count FROM employees;
SELECT 'Database siap digunakan!' as status;