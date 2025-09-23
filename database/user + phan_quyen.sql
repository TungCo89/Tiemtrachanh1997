use tiemtrachanh1997;
-- Người Dùng và Phân Quyền
-- Mục đích: Quản lý tài khoản, thay đổi vai trò (role), và xem thông tin người dùng.

-- API cần thiết:

-- POST /api/users/create: Tạo người dùng mới.

DELIMITER $$
CREATE PROCEDURE CreateUser(
    IN p_ten_dang_nhap VARCHAR(50),
    IN p_mat_khau VARCHAR(255),
    IN p_ho_ten VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_so_dien_thoai VARCHAR(20),
    IN p_id_vai_tro INT
)
BEGIN
    DECLARE v_id_vai_tro INT;

    -- Kiểm tra nếu id_vai_tro không được cung cấp hoặc là NULL
    IF p_id_vai_tro IS NULL THEN
        SET v_id_vai_tro = 2; -- Gán vai trò mặc định (ví dụ: Nhân viên)
    ELSE
        SET v_id_vai_tro = p_id_vai_tro;
    END IF;

    -- Thêm người dùng mới
    INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai, id_vai_tro)
    VALUES (p_ten_dang_nhap, p_mat_khau, p_ho_ten, p_email, p_so_dien_thoai, v_id_vai_tro);
END$$

DELIMITER ;

-- PUT /api/users/update/:id: Cập nhật thông tin người dùng (tên, email, số điện thoại, vai trò).

DELIMITER $$

CREATE PROCEDURE UpdateUser(
    IN p_id INT,
    IN p_ten_dang_nhap VARCHAR(50),
    IN p_mat_khau VARCHAR(255),
    IN p_ho_ten VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_so_dien_thoai VARCHAR(20),
    IN p_id_vai_tro INT
)
BEGIN
    UPDATE nguoi_dung
    SET
        ten_dang_nhap = p_ten_dang_nhap,
        mat_khau = p_mat_khau,
        ho_ten = p_ho_ten,
        email = p_email,
        so_dien_thoai = p_so_dien_thoai,
        id_vai_tro = p_id_vai_tro
    WHERE id = p_id;
END$$

DELIMITER ;

-- DELETE /api/users/delete/:id: Xóa người dùng.

DELIMITER $$

CREATE PROCEDURE DeleteUser(
    IN p_id INT
)
BEGIN
    DELETE FROM nguoi_dung WHERE id = p_id;
END$$

DELIMITER ;

-- GET /api/users/get-all: Lấy danh sách tất cả người dùng.

DELIMITER $$

CREATE PROCEDURE GetAllUsers()
BEGIN
    SELECT 
        nd.id, 
        nd.ten_dang_nhap, 
        nd.ho_ten, 
        nd.email, 
        nd.so_dien_thoai,
        vt.ten_vai_tro
    FROM nguoi_dung AS nd
    JOIN vai_tro AS vt ON nd.id_vai_tro = vt.id;
END$$

DELIMITER ;

-- GET /api/users/get-by-id/:id: Lấy thông tin người dùng theo ID.

DELIMITER $$

CREATE PROCEDURE GetUserByID(
    IN p_id INT
)
BEGIN
    SELECT 
        nd.id, 
        nd.ten_dang_nhap, 
        nd.ho_ten, 
        nd.email, 
        nd.so_dien_thoai,
        vt.ten_vai_tro
    FROM nguoi_dung AS nd
    JOIN vai_tro AS vt ON nd.id_vai_tro = vt.id
    WHERE nd.id = p_id;
END$$

DELIMITER ;

-- GET /api/users/search: Tìm kiếm người dùng.

DELIMITER $$

CREATE PROCEDURE SearchUsers(
    IN p_keyword VARCHAR(255)
)
BEGIN
    SELECT 
        nd.id, 
        nd.ten_dang_nhap, 
        nd.ho_ten, 
        nd.email, 
        nd.so_dien_thoai,
        vt.ten_vai_tro
    FROM nguoi_dung AS nd
    JOIN vai_tro AS vt ON nd.id_vai_tro = vt.id
    WHERE
        nd.ho_ten LIKE CONCAT('%', p_keyword, '%')
        OR nd.ten_dang_nhap LIKE CONCAT('%', p_keyword, '%')
        OR nd.email LIKE CONCAT('%', p_keyword, '%');
END$$

DELIMITER ;

-- Procedure: CreateUser, UpdateUser, DeleteUser, GetAllUsers, GetUserByID.

