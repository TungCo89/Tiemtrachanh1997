use tiemtrachanh1997;
-- Quản lý bàn
-- Mục đích: Quản lý tài bàn, thay đổi trạng thái, và xem thông tin người dùng.

-- API cần thiết: CreateBan, UpdateBan, DeleteBan, GetAllBan, GetBanByID

-- POST /api/ban/create: Tạo bàn mới.

DELIMITER $$

CREATE PROCEDURE CreateBan(
    IN p_ten_ban VARCHAR(50),
    IN p_id_khu_vuc INT 
)
BEGIN
    INSERT INTO ban (ten_ban, id_khu_vuc)
    VALUES (p_ten_ban, p_id_khu_vuc);
END$$

DELIMITER ;

-- PUT /api/ban/update/:id: Cập nhật thông tin 

DELIMITER $$

CREATE PROCEDURE UpdateBan(
    IN p_id INT,
    IN p_ten_ban VARCHAR(50),
    IN p_trang_thai VARCHAR(20),
    IN p_id_khu_vuc INT 
)
BEGIN
    UPDATE ban
    SET
        ten_ban = p_ten_ban,
        trang_thai = p_trang_thai,
        id_khu_vuc = p_id_khu_vuc 
    WHERE id = p_id;
END$$

DELIMITER ;

-- DELETE /api/ban/delete/:id: Xóa 

DELIMITER $$

CREATE PROCEDURE DeleteBan(
    IN p_id INT
)
BEGIN
    DELETE FROM ban WHERE id = p_id;
END$$

DELIMITER ;

-- GET /api/ban/get-all: Lấy danh sách tất cả 

DELIMITER $$

CREATE PROCEDURE GetAllBan()
BEGIN
    SELECT 
        b.id,
        b.ten_ban,
        b.trang_thai,
        b.id_khu_vuc,
        kv.ten_khu_vuc
    FROM 
        ban AS b
    JOIN
        khu_vuc AS kv ON b.id_khu_vuc = kv.id
    ORDER BY kv.ten_khu_vuc, b.ten_ban;
END$$

DELIMITER ;
call GetAllBan();
-- GET /api/ban/get-by-id/:id: Lấy thông tin bàn theo ID.

DELIMITER $$

CREATE PROCEDURE GetBanByID(
    IN p_id INT
)
BEGIN
    SELECT 
        b.id,
        b.ten_ban,
        b.trang_thai,
        b.id_khu_vuc,
        kv.ten_khu_vuc
    FROM 
        ban AS b
    JOIN
        khu_vuc AS kv ON b.id_khu_vuc = kv.id
    WHERE 
        b.id = p_id;
END$$

DELIMITER ;

-- GET /api/ban/get-by-khuvuc/:id: Lấy thông tin bàn theo khu vực.
DELIMITER $$

CREATE PROCEDURE GetBanByKhuVuc(
    IN p_id_khu_vuc INT
)
BEGIN
    SELECT 
        b.id,
        b.ten_ban,
        b.trang_thai 
    FROM 
        ban AS b
    WHERE 
        b.id_khu_vuc = p_id_khu_vuc
    ORDER BY 
        b.ten_ban;
END$$

DELIMITER ;

-- dọn bàn --> bàn 'Trong'
DELIMITER $$

CREATE PROCEDURE DonBan(
    IN p_id INT
)
BEGIN
    -- Chỉ dọn bàn nếu bàn hiện đang "Đang hoạt động"
    UPDATE ban
    SET trang_thai = 'Trong'
    WHERE id = p_id
      AND trang_thai = 'Đang hoạt động';
      
    -- (Tùy chọn) Kiểm tra xem có cập nhật được không
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không thể dọn bàn: Bàn không tồn tại hoặc không ở trạng thái "Đang hoạt động".';
    END IF;
END$$

DELIMITER ;

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
-- Procedure: CreateBan, UpdateBan, DeleteBan, GetAllBan, GetBanByID