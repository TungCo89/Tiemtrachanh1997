import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddLoaiSanPham from './AddLoaiSanPham';
import UpdateLoaiSanPham from './UpdateLoaiSanPham';
const { Search } = Input;

interface LoaiSanPham {
    id: number;
    tenloai: string;
    mota: string;
}

const dataSource: LoaiSanPham[] = [
    { id: 1, tenloai: 'Đồ uống', mota: 'Đồ uống có ga' },
    { id: 2, tenloai: 'Đồ ăn vặt', mota: 'Đồ ăn nhẹ, ăn kèm' },
    { id: 3, tenloai: 'Kem', mota: 'Kem tươi mát lạnh' },
    { id: 4, tenloai: 'Cà phê', mota: 'Coffe nguyên chất' },
    { id: 5, tenloai: 'Trà sữa', mota: 'Trà sữa béo ngậy' },
];


const DSLoaiSanPham: React.FC = () => {

    const onSearch = (value: string) => {
        console.log('Đang tìm kiếm:', value);

    };

    // Giả sử đây là bên trong DSLoaiSanPham.tsx

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null); // null khi không sửa

    // Xử lý Thêm mới
    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    // Xử lý Cập nhật (nhận ID)
    const handleEdit = (id: number) => {
        setEditingItemId(id); // Set ID để mở Modal Sửa
    };

    // Xử lý xóa (nhận ID)
    const handleDelete = (id: number) => {
        // gọi api delete(id)
        //hiển thị thông báo 'xác nhận xóa' --> xác nhận --> xóa
    };

    // Xử lý Đóng Modal chung
    const handleCancel = () => {
        setIsAddModalOpen(false); // Đóng Modal Thêm
        setEditingItemId(null); // Đóng Modal Sửa và reset ID
    };

    // Cấu hình các cột cho Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên loại',
            dataIndex: 'tenloai',
            key: 'ten_loai',
        },
        {
            title: 'Mô tả',
            dataIndex: 'mota',
            key: 'mo_ta',
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: LoaiSanPham) => (
                <Space size="small">
                    <Button
                        type="primary"
                        onClick={() => handleEdit(record.id)}
                        style={{ backgroundColor: '#333', borderColor: '#333' }}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => handleDelete(record.id)}
                        size="small"
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Quản lý Loại sản phẩm</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm Loại sản phẩm
                </Button>
            </div>

            {/* 1. MODAL THÊM MỚI (Add) */}
            <Modal
                title="Thêm Loại sản phẩm mới"
                open={isAddModalOpen} // 👈 Mở theo state Add
                onCancel={handleCancel}
                footer={null}
            >
                <AddLoaiSanPham />
            </Modal>

            {/* 2. MODAL CẬP NHẬT (Update) */}
            <Modal
                title={`Cập nhật Loại sản phẩm (ID: ${editingItemId})`} // Hiển thị ID đang sửa
                open={editingItemId !== null} // 👈 Mở khi editingItemId có giá trị
                onCancel={handleCancel}
                footer={null}
                destroyOnClose // Giúp component UpdateLoaiSanPham reset mỗi lần mở
            >
                {/* 👈 TRUYỀN ID VÀO COMPONENT UPDATE */}
                {editingItemId !== null && (
                    <UpdateLoaiSanPham id={editingItemId} onCancel={handleCancel} />
                )}
            </Modal>

            {/* 1. Thanh tìm kiếm */}
            <div style={{ marginBottom: 20 }}>
                <Search
                    placeholder="Tên loại sản phẩm cần tìm"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={onSearch}
                    style={{ maxWidth: 400 }}
                />
            </div>

            {/* 2. Bảng hiển thị danh sách */}
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

export default DSLoaiSanPham;