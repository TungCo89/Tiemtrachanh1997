import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddNhaCungCap from './AddNhaCungCap';
import UpdateNhaCungCap from './UpdateNhaCungCap';
const { Search } = Input;

interface NhaCungCap {
    id: number;
    tenNhaCungCap: string;
    diaChi: string;
    soDienThoai: string;
}

const dataSource: NhaCungCap[] = [
    { 
        id: 1, 
        tenNhaCungCap: 'Công ty Trà Xanh', 
        diaChi: 'Hà Nội', 
        soDienThoai: '09481234567' 
    },
    { 
        id: 2, 
        tenNhaCungCap: 'Kho Nguyên Liệu Tổng Hợp', 
        diaChi: 'Hưng yên', 
        soDienThoai: '0989876543' 
    },
    { 
        id: 3, 
        tenNhaCungCap: 'Bách hóa Xanh', 
        diaChi: 'Hưng Yên', 
        soDienThoai: '0932552762' 
    },
];


const DSNhaCungCap: React.FC = () => {

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
            width: 80,
        },
        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'tenNhaCungCap',
            key: 'ten_ncc',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'diaChi',
            key: 'dia_chi',
        },
                {
            title: 'Số điện thoại',
            dataIndex: 'soDienThoai',
            key: 'so_dien_thoai',
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: NhaCungCap) => (
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
                <h2>Quản lý nhà cung cấp</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm nhà cung cấp
                </Button>
            </div>


            <Modal
                title="Thêm nhà cung cấp mới"
                open={isAddModalOpen} 
                onCancel={handleCancel}
                footer={null}
            >
                <AddNhaCungCap />
            </Modal>

            <Modal
                title={`Cập nhật nhà cung cấp (ID: ${editingItemId})`} 
                open={editingItemId !== null} 
                onCancel={handleCancel}
                footer={null}
                destroyOnClose 
            >
                {editingItemId !== null && (
                    <UpdateNhaCungCap id={editingItemId} onCancel={handleCancel} />
                )}
            </Modal>

            <div style={{ marginBottom: 20 }}>
                <Search
                    placeholder="Tên nhà cung cấp cần tìm"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={onSearch}
                    style={{ maxWidth: 400 }}
                />
            </div>

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

export default DSNhaCungCap;