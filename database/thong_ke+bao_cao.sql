use tiemtrachanh1997;
-- Thống Kê - Báo Cáo
-- Mục đích: Tổng hợp dữ liệu để đưa ra các báo cáo kinh doanh.

-- API cần thiết:

-- GET /api/thong-ke/doanh-thu: Tính toán doanh thu theo ngày, tháng, năm.

DELIMITER $$

CREATE PROCEDURE GetDoanhThuByDateRange(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        DATE(ngay_lap) AS ngay,
        SUM(tong_tien) AS tong_doanh_thu
    FROM 
        hoa_don_ban
    WHERE 
        ngay_lap BETWEEN p_start_date AND DATE_ADD(p_end_date, INTERVAL 1 DAY) -- Đảm bảo bao gồm cả ngày kết thúc
        AND hdb.trang_thai = 'da_thanh_toan'
    GROUP BY 
        DATE(ngay_lap)
    ORDER BY 
        ngay;
END$$

DELIMITER ;
CALL GetDoanhThuByDateRange('2025-09-01', '2025-09-30');

-- GET /api/thong-ke/loi-nhuan-so-bo: Tính lợi nhuận theo ngày, tháng, năm.

DELIMITER $$

CREATE PROCEDURE GetLoiNhuanSoBo(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    -- 1. Tính Tổng Chi Phí Nguyên Liệu (COGS)
    WITH COGS AS (
        SELECT
            DATE(hdb.ngay_lap) AS ngay,
            SUM(cthdb.so_luong * ct.so_luong * cthdn.don_gia) AS tong_chi_phi_nguyen_lieu
        FROM
            hoa_don_ban AS hdb
        JOIN
            chi_tiet_hoa_don_ban AS cthdb ON hdb.id = cthdb.id_hoa_don_ban
        JOIN
            cong_thuc AS ct ON cthdb.id_san_pham = ct.id_san_pham
        JOIN 
             -- Giả định lấy đơn giá từ hóa đơn nhập gần nhất cho mỗi nguyên liệu (đơn giản hóa)
            (SELECT id_nguyen_lieu, don_gia, ngay_nhap,
                    ROW_NUMBER() OVER (PARTITION BY id_nguyen_lieu ORDER BY ngay_nhap DESC) as rn
             FROM chi_tiet_hoa_don_nhap cthdn
             JOIN hoa_don_nhap hdn ON cthdn.id_hoa_don_nhap = hdn.id) AS cthdn ON ct.id_nguyen_lieu = cthdn.id_nguyen_lieu AND cthdn.rn = 1
        WHERE
            hdb.ngay_lap BETWEEN p_start_date AND DATE_ADD(p_end_date, INTERVAL 1 DAY)
            AND hdb.trang_thai = 'da_thanh_toan'
        GROUP BY
            DATE(hdb.ngay_lap)
    ),
    -- 2. Tính Doanh Thu
    Revenue AS (
        SELECT
            DATE(ngay_lap) AS ngay,
            SUM(tong_tien) AS tong_doanh_thu
        FROM
            hoa_don_ban
        WHERE
            ngay_lap BETWEEN p_start_date AND DATE_ADD(p_end_date, INTERVAL 1 DAY)
        GROUP BY
            DATE(ngay_lap)
    )

    -- 3. Tổng hợp và tính Lợi Nhuận Sơ Bộ
    SELECT
        r.ngay,
        r.tong_doanh_thu,
        COALESCE(c.tong_chi_phi_nguyen_lieu, 0) AS tong_chi_phi_nguyen_lieu,
        (r.tong_doanh_thu - COALESCE(c.tong_chi_phi_nguyen_lieu, 0)) AS loi_nhuan_so_bo
    FROM
        Revenue r
    LEFT JOIN
        COGS c ON r.ngay = c.ngay
    ORDER BY
        r.ngay;

END$$

DELIMITER ;
CALL GetLoiNhuanSoBo('2025-09-01', '2025-09-30');

-- GET /api/thong-ke/hieu-suat-san-pham: Thống kê sản phẩm bán chạy nhất (theo số lượng hoặc doanh thu).

DELIMITER $$

CREATE PROCEDURE GetHieuSuatSanPham(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_top_n INT
)
BEGIN
    SELECT
        sp.ten_san_pham,
        lsp.ten_loai,
        SUM(cthdb.so_luong) AS tong_so_luong_ban,
        SUM(cthdb.thanh_tien) AS tong_doanh_thu_san_pham
    FROM
        hoa_don_ban AS hdb
    JOIN
        chi_tiet_hoa_don_ban AS cthdb ON hdb.id = cthdb.id_hoa_don_ban
    JOIN
        san_pham AS sp ON cthdb.id_san_pham = sp.id
    JOIN
        loai_san_pham AS lsp ON sp.id_loai = lsp.id
    WHERE
        hdb.ngay_lap BETWEEN p_start_date AND DATE_ADD(p_end_date, INTERVAL 1 DAY)
        AND hdb.trang_thai = 'da_thanh_toan'
    GROUP BY
        sp.id, sp.ten_san_pham, lsp.ten_loai
    ORDER BY
        tong_so_luong_ban DESC, tong_doanh_thu_san_pham DESC -- Ưu tiên xếp theo số lượng rồi đến doanh thu
    LIMIT p_top_n; -- Giới hạn số lượng sản phẩm trả về (ví dụ: Top 10)
END$$

DELIMITER ;
CALL GetHieuSuatSanPham('2025-09-01', '2025-09-30', 5);

DELIMITER $$

CREATE PROCEDURE GetSoDonHangByDateRange(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        COUNT(id) AS tong_so_don_hang
    FROM 
        hoa_don_ban
    WHERE 
        ngay_lap BETWEEN p_start_date AND DATE_ADD(p_end_date, INTERVAL 1 DAY)
        AND trang_thai = 'da_thanh_toan'; -- Chỉ đếm đơn hàng đã thanh toán
END$$

DELIMITER ;

-- Ví dụ gọi:
-- CALL GetSoDonHangByDateRange(CURRENT_DATE(), CURRENT_DATE());

DELIMITER $$

CREATE PROCEDURE GetTonKhoNguyenLieu(
    IN p_ten_nguyen_lieu VARCHAR(255)
)
BEGIN
    SELECT 
        nl.ten_nguyen_lieu,
        tk.so_luong_ton,
        nl.don_vi_tinh -- Ví dụ: kg, lít, gói
    FROM 
        ton_kho AS tk
    JOIN 
        nguyen_lieu AS nl ON tk.id_nguyen_lieu = nl.id
    WHERE 
        nl.ten_nguyen_lieu = p_ten_nguyen_lieu
    LIMIT 1;
END$$

DELIMITER ;

-- Ví dụ gọi:
-- CALL GetTonKhoNguyenLieu('Trà Sữa'); -- Giả định 'Trà Sữa' là tên nguyên liệu
-- Procedure: GetDoanhThuByDateRange, GetLoiNhuanSoBo, GetHieuSuatSanPham.