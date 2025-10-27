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
DELIMITER $$

CREATE PROCEDURE UpdateHoaDonNhap(
    IN p_id_hoa_don_nhap INT,
    IN p_id_ncc INT,          
    IN p_ghi_chu TEXT,        
    IN p_chi_tiet_json TEXT   
)
BEGIN
    -- 1. Xóa toàn bộ chi tiết cũ của hóa đơn nhập
    DELETE FROM chi_tiet_hoa_don_nhap WHERE id_hoa_don_nhap = p_id_hoa_don_nhap;

    -- 2. Chèn lại toàn bộ chi tiết mới từ JSON
    INSERT INTO chi_tiet_hoa_don_nhap (id_hoa_don_nhap, id_nguyen_lieu, so_luong, don_gia, thanh_tien)
    SELECT
        p_id_hoa_don_nhap,
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_nguyen_lieu'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].so_luong'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].don_gia'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].thanh_tien')))
    -- Giả định tối đa 4 chi tiết như trong Create procedure
    FROM (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS t
    WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', i, '].id_nguyen_lieu')) IS NOT NULL;
    
    -- 3. Cập nhật lại thông tin chung (NCC, Ghi chú) và Tổng tiền của hóa đơn nhập
    UPDATE hoa_don_nhap
    SET 
        id_ncc = p_id_ncc,
        ghi_chu = p_ghi_chu,
        tong_tien = (
            SELECT SUM(thanh_tien) 
            FROM chi_tiet_hoa_don_nhap 
            WHERE id_hoa_don_nhap = p_id_hoa_don_nhap
        )
    WHERE id = p_id_hoa_don_nhap;

END$$

DELIMITER ;
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
call GetAllHoaDonNhap();
drop PROCEDURE GetAllHoaDonNhap;
DELIMITER $$

CREATE PROCEDURE GetAllHoaDonNhap()
BEGIN
	SELECT
        hdn.id AS id_hoa_don_nhap,
        hdn.ngay_nhap,
        hdn.ghi_chu,
        hdn.id_ncc,
        ncc.ten_ncc,
        cthdn.id as id_cthdn,
        cthdn.id_nguyen_lieu,
        nl.ten_nguyen_lieu,
        cthdn.so_luong,
        cthdn.don_gia,
        cthdn.thanh_tien,
		hdn.tong_tien
    FROM
        hoa_don_nhap AS hdn
    JOIN
        nha_cung_cap AS ncc ON hdn.id_ncc = ncc.id
    JOIN
        chi_tiet_hoa_don_nhap AS cthdn ON hdn.id = cthdn.id_hoa_don_nhap
    JOIN
        nguyen_lieu AS nl ON cthdn.id_nguyen_lieu = nl.id
	ORDER BY
		hdn.ngay_nhap DESC, 
		hdn.id DESC,
        hdn.id_ncc DESC,  
        cthdn.id DESC,
		ncc.ten_ncc DESC, 
		nl.ten_nguyen_lieu DESC;
END$$

DELIMITER ;


-- GET /api/hoadon-nhap/get-by-id/:id: Lấy hóa đơn nhập và chi tiết.
call GetHoaDonNhapByID(4);
DELIMITER $$

CREATE PROCEDURE GetHoaDonNhapByID(
    IN p_id_hoa_don INT
)
BEGIN
    SELECT
        hdn.id AS id_hoa_don_nhap,
        hdn.ngay_nhap,
        hdn.ghi_chu,
        hdn.id_ncc,
        ncc.ten_ncc,
        cthdn.id as id_cthdn,
        cthdn.id_nguyen_lieu,
        nl.ten_nguyen_lieu,
        cthdn.so_luong,
        cthdn.don_gia,
        cthdn.thanh_tien,
		hdn.tong_tien
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

-- GET /api/hoadonnhap/search: Tìm kiếm hóa đơn nhập.

DELIMITER $$

CREATE PROCEDURE SearchHoaDonNhap(
    IN p_keyword VARCHAR(255)
)
BEGIN
    SELECT
        hdn.id,
        hdn.id_ncc,
        ncc.ten_ncc,
        hdn.ngay_nhap,
        hdn.ghi_chu,
        ct.id AS id_cthdn,
        ct.id_nguyen_lieu,
        nl.ten_nguyen_lieu,
        ct.so_luong,
        ct.don_gia,
        ct.thanh_tien,
        hdn.tong_tien
    FROM hoa_don_nhap AS hdn
    JOIN chi_tiet_hoa_don_nhap AS ct ON hdn.id = ct.id_hoa_don_nhap
    JOIN nha_cung_cap AS ncc ON hdn.id_ncc = ncc.id
    JOIN nguyen_lieu AS nl ON ct.id_nguyen_lieu = nl.id
    WHERE
        hdn.id = p_keyword -- Allows searching by exact ID
        OR ncc.ten_ncc LIKE CONCAT('%', p_keyword, '%')
        OR hdn.ghi_chu LIKE CONCAT('%', p_keyword, '%')
        OR nl.ten_nguyen_lieu LIKE CONCAT('%', p_keyword, '%');
END$$

DELIMITER ;


