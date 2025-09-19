CREATE DATABASE IF NOT EXISTS TiemTraChanh1997 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE TiemTraChanh1997;

-- Bảng nhà cung cấp
CREATE TABLE nha_cung_cap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_ncc VARCHAR(100) NOT NULL,
    dia_chi VARCHAR(200),
    so_dien_thoai VARCHAR(20)
);

-- Bảng nguyên liệu
CREATE TABLE nguyen_lieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_nguyen_lieu VARCHAR(100) NOT NULL,
    don_vi VARCHAR(20)
);

-- Bảng loại sản phẩm
CREATE TABLE loai_san_pham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_loai VARCHAR(100) NOT NULL
);

-- Bảng sản phẩm
CREATE TABLE san_pham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_san_pham VARCHAR(100) NOT NULL,
    gia_ban DECIMAL(15,2) NOT NULL,
    mo_ta TEXT,
    id_loai INT,
    FOREIGN KEY (id_loai) REFERENCES loai_san_pham(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Bảng bàn
CREATE TABLE ban (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_ban VARCHAR(50) NOT NULL,
    trang_thai VARCHAR(20) DEFAULT 'Trong'
);

-- Bảng hóa đơn nhập
CREATE TABLE hoa_don_nhap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ncc INT,
    ngay_nhap DATETIME DEFAULT CURRENT_TIMESTAMP,
    tong_tien DECIMAL(15,2) DEFAULT 0,
    ghi_chu TEXT,
    FOREIGN KEY (id_ncc) REFERENCES nha_cung_cap(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Bảng chi tiết hóa đơn nhập
CREATE TABLE chi_tiet_hoa_don_nhap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_hoa_don_nhap INT,
    id_nguyen_lieu INT,
    so_luong DECIMAL(10,2),
    don_gia DECIMAL(15,2),
    thanh_tien DECIMAL(15,2),
    FOREIGN KEY (id_hoa_don_nhap) REFERENCES hoa_don_nhap(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_nguyen_lieu) REFERENCES nguyen_lieu(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Bảng hóa đơn bán
CREATE TABLE hoa_don_ban (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ban INT,
    ngay_lap DATETIME DEFAULT CURRENT_TIMESTAMP,
    tong_tien DECIMAL(15,2) DEFAULT 0,
    FOREIGN KEY (id_ban) REFERENCES ban(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Bảng chi tiết hóa đơn bán
CREATE TABLE chi_tiet_hoa_don_ban (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_hoa_don_ban INT,
    id_san_pham INT,
    so_luong INT,
    don_gia DECIMAL(15,2),
    thanh_tien DECIMAL(15,2),
    FOREIGN KEY (id_hoa_don_ban) REFERENCES hoa_don_ban(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_san_pham) REFERENCES san_pham(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Bảng công thức
CREATE TABLE cong_thuc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_san_pham INT NOT NULL,
    id_nguyen_lieu INT NOT NULL,
    so_luong DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_san_pham) REFERENCES san_pham(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_nguyen_lieu) REFERENCES nguyen_lieu(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Bảng vai trò
CREATE TABLE vai_tro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_vai_tro VARCHAR(50) NOT NULL UNIQUE
);

-- Bảng người dùng
CREATE TABLE nguoi_dung (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    so_dien_thoai VARCHAR(20) UNIQUE,
    id_vai_tro INT,
    FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id) ON UPDATE CASCADE ON DELETE CASCADE
);