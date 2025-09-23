/* Nhân Viên (Role 1)
Nhân viên có quyền hạn giới hạn hơn.

1. Xem Thông tin Sản Phẩm và Công Thức
API cần thiết:

GET /api/sanpham/get-all: Lấy danh sách sản phẩm.

GET /api/sanpham/get-by-id/:id: Lấy thông tin sản phẩm và công thức.

GET /api/sanpham/search: Tìm kiếm sản phẩm.

GET /api/nguyen-lieu/get-all: Lấy danh sách nguyên liệu.

GET /api/nguyen-lieu/get-by-id/:id: Lấy thông tin nguyên liệu.

GET /api/nguyen-lieu/search: Tìm kiếm nguyên liệu.

Lưu ý: Nhân viên không cần các API create/update/delete.

2. Quản Lý Bàn và Order
Mục đích: Tạo, cập nhật và thanh toán hóa đơn bán.

API cần thiết:

GET /api/ban/get-all: Lấy danh sách tất cả bàn để biết trạng thái.

GET /api/ban/get-by-id/:id: Xem thông tin một bàn cụ thể.

POST /api/hoadon-ban/create: Tạo hóa đơn mới cho một bàn trống (bao gồm cả chi tiết).

PUT /api/hoadon-ban/update/:id: Cập nhật hóa đơn (thêm/bớt món, thay đổi số lượng).

GET /api/hoadon-ban/get-by-id/:id: Xem chi tiết hóa đơn.

POST /api/hoadon-ban/export: Xuất hóa đơn, cập nhật trạng thái bàn và tính tổng tiền. Đây là một API nghiệp vụ đặc thù, không chỉ là update.
*/