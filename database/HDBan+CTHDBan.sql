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
    DECLARE v_tong_tien DECIMAL(15,2) DEFAULT 0;
    DECLARE v_nguyen_lieu_thieu VARCHAR(255) DEFAULT '';

    -- Xử lý lỗi: rollback nếu có exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    --  1: Tính tổng tiền từ JSON (hỗ trợ tối đa 10 dòng) ===
    SELECT COALESCE(SUM(
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].thanh_tien'))) AS DECIMAL(15,2))
    ), 0)
    INTO v_tong_tien
    FROM (
        SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
        SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
        SELECT 8 UNION ALL SELECT 9
    ) AS numbers
    WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, ']')) IS NOT NULL;

    --  2: Tạo hóa đơn bán ===
    INSERT INTO hoa_don_ban (id_ban, tong_tien, trang_thai)
    VALUES (p_id_ban, v_tong_tien, 'cho_xac_nhan');

    SET v_id_hoa_don = LAST_INSERT_ID();

    -- 3: Chèn chi tiết hóa đơn bán ===
    INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien)
    SELECT
        v_id_hoa_don,
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].id_san_pham'))) AS UNSIGNED),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].so_luong'))) AS DECIMAL(10,2)),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].don_gia'))) AS DECIMAL(15,2)),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].thanh_tien'))) AS DECIMAL(15,2))
    FROM (
        SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
        SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
        SELECT 8 UNION ALL SELECT 9
    ) AS numbers
    WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, ']')) IS NOT NULL;

    --  4: KIỂM TRA TỒN KHO NGUYÊN LIỆU ===
    -- Tạo bảng logic: nhu cầu nguyên liệu cho đơn này
    IF EXISTS (
        SELECT 1
        FROM (
            SELECT
                ct.id_nguyen_lieu,
                SUM(ct.so_luong * cthb.so_luong) AS can_dung
            FROM chi_tiet_hoa_don_ban cthb
            INNER JOIN cong_thuc ct ON cthb.id_san_pham = ct.id_san_pham
            WHERE cthb.id_hoa_don_ban = v_id_hoa_don
            GROUP BY ct.id_nguyen_lieu
        ) AS ke_hoach
        INNER JOIN nguyen_lieu nl ON ke_hoach.id_nguyen_lieu = nl.id
        WHERE nl.so_luong_ton < ke_hoach.can_dung
    ) THEN
        -- Không đủ nguyên liệu → báo lỗi và hủy giao dịch
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Không đủ nguyên liệu để thực hiện đơn hàng!';
    END IF;

    --  5: CẬP NHẬT TỒN KHO (trừ nguyên liệu) ===
    UPDATE nguyen_lieu nl
    INNER JOIN (
        SELECT
            ct.id_nguyen_lieu,
            SUM(ct.so_luong * cthb.so_luong) AS tong_tru
        FROM chi_tiet_hoa_don_ban cthb
        INNER JOIN cong_thuc ct ON cthb.id_san_pham = ct.id_san_pham
        WHERE cthb.id_hoa_don_ban = v_id_hoa_don
        GROUP BY ct.id_nguyen_lieu
    ) AS ke_hoach_tru ON nl.id = ke_hoach_tru.id_nguyen_lieu
    SET nl.so_luong_ton = nl.so_luong_ton - ke_hoach_tru.tong_tru;

    --  6: Cập nhật trạng thái bàn ===
    UPDATE ban SET trang_thai = 'Đang hoạt động' WHERE id = p_id_ban;

    COMMIT;
END$$

DELIMITER ;

-- PUT /api/hoadon-ban/update/:id: Cập nhật hóa đơn bán. (Lưu ý: Thường không cho phép update hóa đơn bán đã hoàn thành).

DELIMITER $$

CREATE PROCEDURE UpdateHoaDonBan(
    IN p_id_hoa_don INT,
    IN p_chi_tiet_json TEXT
)
BEGIN
    DECLARE v_tong_tien DECIMAL(15,2) DEFAULT 0;

    -- Xử lý lỗi: rollback nếu có exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1: HOÀN TÁC nguyên liệu của chi tiết cũ (cộng lại vào kho)
    UPDATE nguyen_lieu nl
    INNER JOIN (
        SELECT
            ct.id_nguyen_lieu,
            SUM(ct.so_luong * cthb_old.so_luong) AS tong_nguyen_lieu_da_dung
        FROM chi_tiet_hoa_don_ban cthb_old
        INNER JOIN cong_thuc ct ON cthb_old.id_san_pham = ct.id_san_pham
        WHERE cthb_old.id_hoa_don_ban = p_id_hoa_don
        GROUP BY ct.id_nguyen_lieu
    ) AS cu ON nl.id = cu.id_nguyen_lieu
    SET nl.so_luong_ton = nl.so_luong_ton + cu.tong_nguyen_lieu_da_dung;

    -- 2: Xóa chi tiết cũ
    DELETE FROM chi_tiet_hoa_don_ban 
    WHERE id_hoa_don_ban = p_id_hoa_don;

    -- 3: Chèn chi tiết mới từ JSON
    INSERT INTO chi_tiet_hoa_don_ban (id_hoa_don_ban, id_san_pham, so_luong, don_gia, thanh_tien)
    SELECT
        p_id_hoa_don,
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].id_san_pham'))) AS UNSIGNED),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].so_luong'))) AS DECIMAL(10,2)),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].don_gia'))) AS DECIMAL(15,2)),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, '].thanh_tien'))) AS DECIMAL(15,2))
    FROM (
        SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
        SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
        SELECT 8 UNION ALL SELECT 9
    ) AS numbers
    WHERE JSON_EXTRACT(p_chi_tiet_json, CONCAT('$[', numbers.i, ']')) IS NOT NULL;

    -- 4: KIỂM TRA TỒN KHO CHO PHIÊN BẢN MỚI ===
    IF EXISTS (
        SELECT 1
        FROM (
            SELECT
                ct.id_nguyen_lieu,
                SUM(ct.so_luong * cthb_new.so_luong) AS can_dung
            FROM chi_tiet_hoa_don_ban cthb_new
            INNER JOIN cong_thuc ct ON cthb_new.id_san_pham = ct.id_san_pham
            WHERE cthb_new.id_hoa_don_ban = p_id_hoa_don
            GROUP BY ct.id_nguyen_lieu
        ) AS ke_hoach
        INNER JOIN nguyen_lieu nl ON ke_hoach.id_nguyen_lieu = nl.id
        WHERE nl.so_luong_ton < ke_hoach.can_dung
    ) THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Không đủ nguyên liệu cho hóa đơn sau khi cập nhật!';
    END IF;

    -- 5: TRỪ nguyên liệu cho chi tiết MỚI
    UPDATE nguyen_lieu nl
    INNER JOIN (
        SELECT
            ct.id_nguyen_lieu,
            SUM(ct.so_luong * cthb_new.so_luong) AS tong_tru
        FROM chi_tiet_hoa_don_ban cthb_new
        INNER JOIN cong_thuc ct ON cthb_new.id_san_pham = ct.id_san_pham
        WHERE cthb_new.id_hoa_don_ban = p_id_hoa_don
        GROUP BY ct.id_nguyen_lieu
    ) AS moi ON nl.id = moi.id_nguyen_lieu
    SET nl.so_luong_ton = nl.so_luong_ton - moi.tong_tru;

    -- 6: Cập nhật lại tổng tiền
    SELECT COALESCE(SUM(thanh_tien), 0)
    INTO v_tong_tien
    FROM chi_tiet_hoa_don_ban
    WHERE id_hoa_don_ban = p_id_hoa_don;

    UPDATE hoa_don_ban
    SET tong_tien = v_tong_tien
    WHERE id = p_id_hoa_don;

    COMMIT;
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
call GetAllHoaDonBan();
DELIMITER $$

CREATE PROCEDURE GetAllHoaDonBan()
BEGIN
    SELECT
        hdb.id AS id, 
        hdb.id_ban,
        b.ten_ban,
        hdb.ngay_lap,
        hdb.tong_tien,
        hdb.trang_thai,
        cthdb.id AS id_cthdb, 
        cthdb.id_san_pham,
        sp.ten_san_pham,
        cthdb.so_luong,
        cthdb.don_gia
    FROM
        hoa_don_ban AS hdb
    JOIN
        ban AS b ON hdb.id_ban = b.id
    JOIN
        chi_tiet_hoa_don_ban AS cthdb ON hdb.id = cthdb.id_hoa_don_ban
    JOIN
        san_pham AS sp ON cthdb.id_san_pham = sp.id
    ORDER BY
        hdb.ngay_lap DESC,
        hdb.id DESC;
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
        hdb.trang_thai,
		b.id as id_ban,
        b.ten_ban,
        cthdb.id as id_cthdb,
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

-- lấy thông tin hdban khi biet id_ban và ban.trang_thai Đang hoạt động
DELIMITER $$
CREATE PROCEDURE GetHoaDonBanByIDBan(
    IN p_id_ban INT
)
BEGIN
    DECLARE v_ban_hoat_dong INT DEFAULT 0;
    DECLARE v_id_hoa_don_moi_nhat INT DEFAULT NULL;

    -- Kiểm tra bàn có tồn tại và đang "Đang hoạt động"
    SELECT COUNT(*) INTO v_ban_hoat_dong
    FROM ban
    WHERE id = p_id_ban AND trang_thai = 'Đang hoạt động';

    IF v_ban_hoat_dong = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Bàn không tồn tại hoặc không ở trạng thái "Đang hoạt động".';
    END IF;

    -- Lấy ID hóa đơn mới nhất của bàn đó
    SELECT id INTO v_id_hoa_don_moi_nhat
    FROM hoa_don_ban
    WHERE id_ban = p_id_ban
    ORDER BY id DESC
    LIMIT 1;

    -- Nếu không có hóa đơn nào → trả rỗng hoặc báo lỗi (tùy bạn)
    IF v_id_hoa_don_moi_nhat IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Bàn đang hoạt động nhưng chưa có hóa đơn nào.';
    END IF;

    -- Lấy thông tin hóa đơn mới nhất + chi tiết
    SELECT
		hdb.id,
        b.id AS id_ban,
        b.ten_ban,
        hdb.ngay_lap,
        hdb.tong_tien,
        hdb.trang_thai,
        cthdb.id AS id_cthdb,
        cthdb.id_san_pham,
        sp.ten_san_pham,
        cthdb.so_luong,
        cthdb.don_gia

    FROM
        hoa_don_ban hdb
    INNER JOIN ban b ON hdb.id_ban = b.id
    INNER JOIN chi_tiet_hoa_don_ban cthdb ON hdb.id = cthdb.id_hoa_don_ban
    INNER JOIN san_pham sp ON cthdb.id_san_pham = sp.id
    WHERE
        hdb.id = v_id_hoa_don_moi_nhat;
END$$
DELIMITER ;

-- Tên Procedure: Tìm kiếm hóa đơn bán dựa trên từ khóa
-- Từ khóa tìm kiếm: ID Hóa đơn, Tên Bàn, Tên Sản phẩm
DELIMITER $$

CREATE PROCEDURE SearchHoaDonBan(
    IN p_keyword VARCHAR(255) 
)
BEGIN
    SELECT
        hdb.id,
        hdb.id_ban,
        b.ten_ban,
        hdb.ngay_lap,
        hdb.tong_tien,
        hdb.trang_thai,
        cthdb.id AS id_cthdb,
        cthdb.id_san_pham,
        sp.ten_san_pham,
        cthdb.so_luong,
        cthdb.don_gia
    FROM 
        hoa_don_ban AS hdb
    JOIN 
        ban AS b ON hdb.id_ban = b.id 
    JOIN 
        chi_tiet_hoa_don_ban AS cthdb ON hdb.id = cthdb.id_hoa_don_ban
    JOIN
        san_pham AS sp ON cthdb.id_san_pham = sp.id 
    WHERE
	hdb.id = p_keyword 
	OR b.ten_ban LIKE CONCAT('%', p_keyword, '%')
	OR sp.ten_san_pham LIKE CONCAT('%', p_keyword, '%')
	OR hdb.trang_thai LIKE CONCAT('%', p_keyword, '%');
END$$

DELIMITER ;
-- Thanh toán và set ban "Trong" (no)

DELIMITER $$
CREATE PROCEDURE ThanhToanHoaDon(
    IN p_id_hoa_don INT
)
BEGIN
    DECLARE v_id_ban INT;
    
    -- Lấy ID bàn từ hóa đơn
    SELECT id_ban INTO v_id_ban FROM hoa_don_ban WHERE id = p_id_hoa_don;
    
    -- Cập nhật trạng thái hóa đơn
    UPDATE hoa_don_ban SET trang_thai = 'da_thanh_toan' WHERE id = p_id_hoa_don;
    
--     -- Cập nhật trạng thái bàn thành trống
--     UPDATE ban SET trang_thai = 'Trong' WHERE id = v_id_ban;
END$$
DELIMITER ;

call ThanhToanHoaDon(3);

-- thanh toan hdban khi biet id bàn và hd 'cho xac nhan' 
DELIMITER $$

CREATE PROCEDURE ThanhToanHDByIDBan(
    IN p_id_ban INT
)
BEGIN
    DECLARE v_id_hoa_don INT;

    -- Lấy ID hóa đơn có trạng thái 'cho_xac_nhan' theo id_ban
    SELECT id INTO v_id_hoa_don
    FROM hoa_don_ban
    WHERE id_ban = p_id_ban
      AND trang_thai = 'cho_xac_nhan'
    LIMIT 1;

    -- Nếu tìm thấy hóa đơn, tiến hành cập nhật
    IF v_id_hoa_don IS NOT NULL THEN
        UPDATE hoa_don_ban
        SET trang_thai = 'da_thanh_toan'
        WHERE id = v_id_hoa_don;
    ELSE
        -- Tùy chọn: bạn có thể ném lỗi hoặc bỏ qua
         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy hóa đơn cần thanh toán cho bàn này.';
    END IF;

END$$

DELIMITER ;
