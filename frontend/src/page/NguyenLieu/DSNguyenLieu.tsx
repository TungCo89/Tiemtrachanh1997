import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddNguyenLieu from './AddNguyenLieu';
import UpdateNguyenLieu from './UpdateNguyenLieu';
const { Search } = Input;

interface NguyenLieu {
    id: number;
    ten: string;
    donvi: string;
}

const dataSource: NguyenLieu[] = [
    { id: 1, ten: 'Trà chanh', donvi: 'kg' },
    { id: 2, ten: 'Đào', donvi: 'kg' },
    { id: 3, ten: 'Vải', donvi: 'kg' },
    { id: 4, ten: 'Đường', donvi: 'kg' },
    { id: 5, ten: 'Cam', donvi: 'kg' },
];


const DSNguyenLieu: React.FC = () => {

    const onSearch = (value: string) => {
        console.log('Đang tìm kiếm:', value);

    };

    // Giả sử đây là bên trong DSNguyenLieu.tsx

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
            title: 'Tên nguyên liệu',
            dataIndex: 'ten',
            key: 'ten',
        },
        {
            title: 'Đơn vị đo',
            dataIndex: 'donvi',
            key: 'don_vi',
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: NguyenLieu) => (
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
                <h2>Quản lý nguyên liệu</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm nguyên liệu
                </Button>
            </div>

            {/* 1. MODAL THÊM MỚI (Add) */}
            <Modal
                title="Thêm nguyên liệu mới"
                open={isAddModalOpen} // 👈 Mở theo state Add
                onCancel={handleCancel}
                footer={null}
            >
                <AddNguyenLieu />
            </Modal>

            {/* 2. MODAL CẬP NHẬT (Update) */}
            <Modal
                title={`Cập nhật nguyên liệu (ID: ${editingItemId})`} // Hiển thị ID đang sửa
                open={editingItemId !== null} // 👈 Mở khi editingItemId có giá trị
                onCancel={handleCancel}
                footer={null}
                destroyOnClose // Giúp component UpdateNguyenLieu reset mỗi lần mở
            >
                {/* 👈 TRUYỀN ID VÀO COMPONENT UPDATE */}
                {editingItemId !== null && (
                    <UpdateNguyenLieu id={editingItemId} onCancel={handleCancel} />
                )}
            </Modal>

            {/* 1. Thanh tìm kiếm */}
            <div style={{ marginBottom: 20 }}>
                <Search
                    placeholder="Tên nguyên liệu cần tìm"
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

export default DSNguyenLieu;