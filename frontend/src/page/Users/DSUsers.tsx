import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddUsers from './AddUsers';
import UpdateUsers from './UpdateUsers';
const { Search } = Input;

interface Users {
    id: number;
    tenDangNhap: string;
    hoTen: string;
    email: string;
    soDienThoai: string;
    tenVaiTro: string;
}

const dataSource: Users[] = [
    {
        id: 1,
        tenDangNhap: 'admin',
        hoTen: 'Nguyễn Văn A',
        email: 'admin@example.com',
        soDienThoai: '0987654321',
        tenVaiTro: 'Quản trị viên'
    },
    {
        id: 2,
        tenDangNhap: 'nv_lam',
        hoTen: 'Nguyễn Thị B',
        email: 'lam@example.com',
        soDienThoai: '0123456789',
        tenVaiTro: 'Nhân viên'
    },
];

const DSUsers: React.FC = () => {

    const onSearch = (value: string) => {
        console.log('Đang tìm kiếm:', value);

    };


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null); // null khi không sửa

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleEdit = (id: number) => {
        setEditingItemId(id); // Set ID để mở Modal Sửa
    };

    const handleDelete = (id: number) => {
        // gọi api delete(id)
        //hiển thị thông báo 'xác nhận xóa' --> xác nhận --> xóa
    };

    const handleCancel = () => {
        setIsAddModalOpen(false);
        setEditingItemId(null);
    };

    // Cấu hình các cột cho Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'tenDangNhap',
            key: 'tenDangNhap',
            width: 120,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'soDienThoai',
            key: 'soDienThoai',
            width: 120,
        },
        {
            title: 'Vai trò',
            dataIndex: 'tenVaiTro',
            key: 'tenVaiTro',
            width: 120,
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: Users) => (
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
                <h2>Quản lý người dùng</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm người dùng
                </Button>
            </div>

            {/* 1. MODAL THÊM MỚI (Add) */}
            <Modal
                title="Thêm người dùng mới"
                open={isAddModalOpen} // 👈 Mở theo state Add
                onCancel={handleCancel}
                footer={null}
            >
                <AddUsers />
            </Modal>

            {/* 2. MODAL CẬP NHẬT (Update) */}
            <Modal
                title={`Cập nhật người dùng (ID: ${editingItemId})`} // Hiển thị ID đang sửa
                open={editingItemId !== null} // 👈 Mở khi editingItemId có giá trị
                onCancel={handleCancel}
                footer={null}
                destroyOnClose // Giúp component UpdateUsers reset mỗi lần mở
            >
                {/* 👈 TRUYỀN ID VÀO COMPONENT UPDATE */}
                {editingItemId !== null && (
                    <UpdateUsers id={editingItemId} onCancel={handleCancel} />
                )}
            </Modal>

            {/* 1. Thanh tìm kiếm */}
            <div style={{ marginBottom: 20 }}>
                <Search
                    placeholder="Tên người dùng cần tìm"
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

export default DSUsers;