use tiemtrachanh1997;
-- Hóa đơn nhập và CT Hóa đơn nhập
-- Mục đích: hóa đơn nhập hàng

-- API cần thiết:

-- POST /api/hoadon-nhap/create: Thêm hóa đơn nhập và các chi tiết

DELIMITER $$

CREATE PROCEDURE CreateHoaDonNhap(
    IN p_id_ncc INT,
    IN p_ghi_chu TEXT,
    IN p_chi_tiet_json TEXT
)
BEGIN
    DECLARE v_id_hoa_don INT;
    DECLARE v_tong_tien DECIMAL(15,2);

    -- Tính tổng tiền từ JSON
    SET v_tong_tien = (SELECT SUM(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien'))))
                       FROM (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
                       WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien')) IS NOT NULL);

    -- Thêm hóa đơn nhập chính
    INSERT INTO hoa_don_nhap (id_ncc, ghi_chu, tong_tien)
    VALUES (p_id_ncc, p_ghi_chu, v_tong_tien);

    -- Lấy ID của hóa đơn vừa tạo
    SET v_id_hoa_don = LAST_INSERT_ID();

    -- Thêm các chi tiết hóa đơn từ JSON
    INSERT INTO chi_tiet_hoa_don_nhap (id_hoa_don_nhap, id_nguyen_lieu, so_luong, don_gia, thanh_tien)
    SELECT
        v_id_hoa_don,
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_nguyen_lieu'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].so_luong'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].don_gia'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien')))
    FROM (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
    WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_nguyen_lieu')) IS NOT NULL;
END$$

DELIMITER ;

-- PUT /api/hoadon-nhap/update/:id: Cập nhật hóa đơn nhập. (Lưu ý: Thường không cho phép update hóa đơn nhập đã hoàn thành).

-- DELETE /api/hoadon-nhap/delete/:id: Xóa hóa đơn nhập (cần xóa chi tiết trước).

DELIMITER $$

CREATE PROCEDURE DeleteHoaDonNhap(
    IN p_id_hoa_don INT
)
BEGIN
    DELETE FROM hoa_don_nhap WHERE id = p_id_hoa_don;
END$$

DELIMITER ;

-- GET /api/hoadon-nhap/get-all: Lấy danh sách hóa đơn nhập.

DELIMITER $$

CREATE PROCEDURE GetAllHoaDonNhap()
BEGIN
    SELECT 
        hdn.id,
        hdn.ngay_nhap,
        hdn.tong_tien,
        hdn.ghi_chu,
        ncc.ten_ncc
    FROM
        hoa_don_nhap AS hdn
    JOIN
        nha_cung_cap AS ncc ON hdn.id_ncc = ncc.id
    ORDER BY hdn.ngay_nhap DESC;
END$$

DELIMITER ;

-- GET /api/hoadon-nhap/get-by-id/:id: Lấy hóa đơn nhập và chi tiết.

DELIMITER $$

CREATE PROCEDURE GetHoaDonNhapByID(
    IN p_id_hoa_don INT
)
BEGIN
    SELECT
        hdn.id AS id_hoa_don_nhap,
        hdn.ngay_nhap,
        hdn.tong_tien,
        hdn.ghi_chu,
        ncc.ten_ncc,
        cthdn.id_nguyen_lieu,
        nl.ten_nguyen_lieu,
        cthdn.so_luong,
        cthdn.don_gia,
        cthdn.thanh_tien
    FROM
        hoa_don_nhap AS hdn
    JOIN
        nha_cung_cap AS ncc ON hdn.id_ncc = ncc.id
    JOIN
        chi_tiet_hoa_don_nhap AS cthdn ON hdn.id = cthdn.id_hoa_don_nhap
    JOIN
        nguyen_lieu AS nl ON cthdn.id_nguyen_lieu = nl.id
    WHERE
        hdn.id = p_id_hoa_don;
END$$

DELIMITER ;


