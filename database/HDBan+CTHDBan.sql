use tiemtrachanh1997;
-- Hóa đơn nhập và CT Hóa đơn bán
-- Mục đích: hóa đơn bán hàng

-- API cần thiết:

-- POST /api/hoadon-ban/create: Thêm hóa đơn bán và các chi tiết.

DELIMITER $$
CREATE PROCEDURE CreateHoaDonBan(
    IN p_id_ban INT,
    IN p_chi_tiet_json TEXT
)
BEGIN
    DECLARE v_id_hoa_don INT;
    DECLARE v_tong_tien DECIMAL(15,2);

    -- Tính tổng tiền từ JSON
    SET v_tong_tien = (SELECT SUM(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien'))))
                       FROM (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
                       WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien')) IS NOT NULL);

    -- Thêm hóa đơn bán chính
    INSERT INTO hoa_don_ban (id_ban, tong_tien)
    VALUES (p_id_ban, v_tong_tien);

    -- Lấy ID của hóa đơn vừa tạo
    SET v_id_hoa_don = LAST_INSERT_ID();

    -- Thêm các chi tiết hóa đơn từ JSON
    INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien)
    SELECT
        v_id_hoa_don,
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_san_pham'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].so_luong'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].don_gia'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien')))
    FROM (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
    WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_san_pham')) IS NOT NULL;
    
    -- Cập nhật trạng thái bàn "Đang hoạt động"
    UPDATE ban SET trang_thai = 'Đang hoạt động' WHERE id = p_id_ban;
END$$

DELIMITER ;

-- PUT /api/hoadon-ban/update/:id: Cập nhật hóa đơn bán. (Lưu ý: Thường không cho phép update hóa đơn bán đã hoàn thành).

DELIMITER $$
CREATE PROCEDURE UpdateHoaDonBan(
    IN p_id_hoa_don INT,
    IN p_chi_tiet_json TEXT
)
BEGIN
    -- 1. Xóa toàn bộ chi tiết cũ của hóa đơn
    DELETE FROM chi_tiet_hoa_don_ban WHERE id_hoa_don_ban = p_id_hoa_don;
    
    -- 2. Chèn lại toàn bộ chi tiết mới từ JSON
    INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien)
    SELECT
        p_id_hoa_don,
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_san_pham'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].so_luong'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].don_gia'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien')))
    FROM (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
    WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_san_pham')) IS NOT NULL;
    
    -- 3. Cập nhật lại tổng tiền của hóa đơn
    UPDATE hoa_don_ban
    SET tong_tien = (SELECT SUM(thanh_tien) FROM chi_tiet_hoa_don_ban WHERE id_hoa_don_ban = p_id_hoa_don)
    WHERE id = p_id_hoa_don;
END$$
DELIMITER ;

-- DELETE /api/hoadon-ban/delete/:id: Xóa hóa đơn bán (cần xóa chi tiết trước).

DELIMITER $$

CREATE PROCEDURE DeleteHoaDonBan(
    IN p_id_hoa_don INT
)
BEGIN
    DELETE FROM chi_tiet_hoa_don_ban WHERE id_hoa_don_ban = p_id_hoa_don;
    DELETE FROM hoa_don_ban WHERE id = p_id_hoa_don;
END$$

DELIMITER ;

-- GET /api/hoadon-ban/get-all: Lấy danh sách hóa đơn bán.

DELIMITER $$

CREATE PROCEDURE GetAllHoaDonBan()
BEGIN
    SELECT 
        hdb.id,
        hdb.ngay_lap,
        hdb.tong_tien,
        b.ten_ban
    FROM
        hoa_don_ban AS hdb
    JOIN
        ban AS b ON hdb.id_ban = b.id
    ORDER BY hdb.ngay_lap DESC;
END$$

DELIMITER ;

-- GET /api/hoadon-ban/get-by-id/:id: Lấy hóa đơn bán và chi tiết.

DELIMITER $$

CREATE PROCEDURE GetHoaDonBanByID(
    IN p_id_hoa_don INT
)
BEGIN
    SELECT
        hdb.id AS id_hoa_don_ban,
        hdb.ngay_lap,
        hdb.tong_tien,
        b.ten_ban,
        cthdb.id_san_pham,
        sp.ten_san_pham,
        cthdb.so_luong,
        cthdb.don_gia,
        cthdb.thanh_tien
    FROM
        hoa_don_ban AS hdb
    JOIN
        ban AS b ON hdb.id_ban = b.id
    JOIN
        chi_tiet_hoa_don_ban AS cthdb ON hdb.id = cthdb.id_hoa_don_ban
    JOIN
        san_pham AS sp ON cthdb.id_san_pham = sp.id
    WHERE
        hdb.id = p_id_hoa_don;
END$$

DELIMITER ;

-- Thanh toán và chốt hóa đơn

DELIMITER $$
CREATE PROCEDURE ThanhToanHoaDon(
    IN p_id_hoa_don INT
)
BEGIN
    DECLARE v_id_ban INT;
    
    -- Lấy ID bàn từ hóa đơn
    SELECT id_ban INTO v_id_ban FROM hoa_don_ban WHERE id = p_id_hoa_don;
    
    -- Cập nhật trạng thái hóa đơn
    UPDATE hoa_don_ban SET trang_thai = 'Đã thanh toán' WHERE id = p_id_hoa_don;
    
    -- Cập nhật trạng thái bàn thành trống
    UPDATE ban SET trang_thai = 'Trống' WHERE id = v_id_ban;
END$$
DELIMITER ;


