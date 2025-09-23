use tiemtrachanh1997;
-- Quản lý bàn
-- Mục đích: Quản lý tài bàn, thay đổi trạng thái, và xem thông tin người dùng.

-- API cần thiết: CreateBan, UpdateBan, DeleteBan, GetAllBan, GetBanByID

-- POST /api/ban/create: Tạo bàn mới.

DELIMITER $$

CREATE PROCEDURE CreateBan(
    IN p_ten_ban VARCHAR(50)
)
BEGIN
    INSERT INTO ban (ten_ban)
    VALUES (p_ten_ban);
END$$

DELIMITER ;

-- PUT /api/ban/update/:id: Cập nhật thông tin 

DELIMITER $$

CREATE PROCEDURE UpdateBan(
    IN p_id INT,
    IN p_ten_ban VARCHAR(50),
    IN p_trang_thai VARCHAR(20)
)
BEGIN
    UPDATE ban
    SET
        ten_ban = p_ten_ban,
        trang_thai = p_trang_thai
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
    SELECT * FROM ban;
END$$

DELIMITER ;

-- GET /api/ban/get-by-id/:id: Lấy thông tin bàntheo ID.

DELIMITER $$

CREATE PROCEDURE GetBanByID(
    IN p_id INT
)
BEGIN
    SELECT * FROM ban WHERE id = p_id;
END$$

DELIMITER ;

-- Procedure: CreateBan, UpdateBan, DeleteBan, GetAllBan, GetBanByID