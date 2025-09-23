use tiemtrachanh1997;
-- Thống Kê - Báo Cáo
-- Mục đích: Tổng hợp dữ liệu để đưa ra các báo cáo kinh doanh.

-- API cần thiết:

-- GET /api/thong-ke/doanh-thu: Tính toán doanh thu theo ngày, tháng, năm.

-- GET /api/thong-ke/loi-nhuan-so-bo: Tính lợi nhuận theo ngày, tháng, năm.

-- GET /api/thong-ke/hieu-suat-san-pham: Thống kê sản phẩm bán chạy nhất (theo số lượng hoặc doanh thu).

-- Procedure: GetDoanhThuByDateRange, GetLoiNhuanSoBo, GetHieuSuatSanPham.