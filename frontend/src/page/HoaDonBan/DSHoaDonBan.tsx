import React, { useState } from 'react';
import { Button, Input, Space, Modal, Table, Popconfirm, message } from 'antd'; 
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddHoaDonBan from './AddHoaDonBan';
import UpdateHoaDonBan from './UpdateHoaDonBan';

// Khai báo component Search từ Input của Ant Design
const { Search } = Input; 

// ----------------------------------------------------------------------
// --- CẬP NHẬT INTERFACE VÀ DATA SOURCE CHO HÓA ĐƠN BÁN ---

interface HoaDonBan {
    id: number;
    idBan: number; // Đổi từ idNhaCungCap sang idBan
    tenBan?: string; // Tên Bàn để hiển thị
    ngayLap: string; // Đổi từ ngayBan sang ngayLap (theo SQL: ngay_lap)
    tongTien: number;
}

// Cập nhật Data source dựa trên dữ liệu SQL của bạn
const initialDataSource: HoaDonBan[] = [
    // (1, '2025-09-15 19:30:00', 40000)
    { id: 1, idBan: 1, tenBan: 'Bàn 1 (Lầu 1)', ngayLap: '2025-09-15 19:30:00', tongTien: 40000 },
    // (2, '2025-09-15 20:15:00', 25000)
    { id: 2, idBan: 2, tenBan: 'Bàn 2 (Lầu 1)', ngayLap: '2025-09-15 20:15:00', tongTien: 25000 },
];
// --- KẾT THÚC CẬP NHẬT ---
// ----------------------------------------------------------------------


const DSHoaDonBan: React.FC = () => {
    const [dataSource, setDataSource] = useState<HoaDonBan[]>(initialDataSource);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);

    // Xử lý Tìm kiếm (hiện tại chỉ log)
    const onSearch = (value: string) => {
        console.log('Đang tìm kiếm hóa đơn theo ID Bàn:', value);
        // THỰC TẾ: Cần lọc dataSource dựa trên value
    };

    // Xử lý Thêm mới
    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    // Xử lý Cập nhật (nhận ID)
    const handleEdit = (id: number) => {
        setEditingItemId(id);
    };

    // Xử lý xóa (nhận ID) - Dùng Popconfirm để xác nhận
    const handleDelete = (id: number) => {
        // THỰC TẾ: Gọi API xóa
        setDataSource(prev => prev.filter(hd => hd.id !== id));
        // Đã sửa thông báo từ Hóa đơn Nhập sang Hóa đơn Bán
        message.success(`Đã xóa Hóa đơn Bán ID: ${id}`); 
    };

    // Xử lý Đóng Modal chung
    const handleCancel = () => {
        setIsAddModalOpen(false);
        setEditingItemId(null);
    };

    // Cấu hình các cột cho Table (ĐÃ SỬA CHO HÓA ĐƠN BÁN)
    const columns = [
        {
            title: 'ID HĐ',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Bàn', // 👈 Đã sửa từ 'Nhà cung cấp'
            // Hiển thị tên Bàn
            dataIndex: 'tenBan', 
            key: 'tenBan',
        },
        {
            title: 'Ngày lập', // 👈 Đã sửa từ 'Ngày nhập'
            dataIndex: 'ngayLap',
            key: 'ngayLap',
            width: 180,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tongTien',
            key: 'tongTien',
            width: 150,
            // Format tiền tệ
            render: (tien: number) => `${tien.toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: HoaDonBan) => (
                <Space size="small">
                    <Button
                        type="primary"
                        onClick={() => handleEdit(record.id)} 
                        style={{ backgroundColor: '#333', borderColor: '#333' }}
                        size="small"
                    >
                        Chi tiết / Sửa
                    </Button>
                    <Popconfirm
                        title={`Xác nhận xóa HĐ ID: ${record.id}?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            type="primary"
                            danger
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 0 }}>
            {/* --- TIÊU ĐỀ VÀ NÚT THÊM --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Quản lý Hóa đơn Bán</h2> {/* 👈 ĐÃ SỬA TIÊU ĐỀ */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm Hóa đơn Bán {/* 👈 ĐÃ SỬA NÚT */}
                </Button>
            </div>

            {/* --- MODAL THÊM MỚI (Add) --- */}
            <Modal
                title="Thêm Hóa đơn Bán mới" 
                open={isAddModalOpen} 
                onCancel={handleCancel}
                footer={null}
            >
                <AddHoaDonBan onCancel={handleCancel} /> 
            </Modal>

            {/* --- MODAL CẬP NHẬT (Update) --- */}
            <Modal
                // title={`Cập nhật Hóa đơn Bán (ID: ${editingItemId})`} 
                open={editingItemId !== null}
                onCancel={handleCancel}
                footer={null}
                width={800} 
                destroyOnClose
            >
                {editingItemId !== null && (
                    <UpdateHoaDonBan id={editingItemId} onCancel={handleCancel} />
                )}
            </Modal>

            {/* --- THANH TÌM KIẾM --- */}
            <div style={{ marginBottom: 20 }}>
                <Search
                    placeholder="Tìm kiếm theo ID hoặc Tên Bàn" 
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={onSearch}
                    style={{ maxWidth: 400 }}
                />
            </div>

            {/* --- BẢNG HIỂN THỊ DANH SÁCH --- */}
            <Table
                pagination={{
                    position: ['bottomCenter'],
                    pageSize: 10,
                    showSizeChanger: false,
                    total: dataSource.length,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên tổng ${total} mục`,
                }}
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
            />
        </div>
    );
};

export default DSHoaDonBan;