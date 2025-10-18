import React, { useState } from 'react';
import { Button, Input, Space, Modal, Table, Popconfirm, message } from 'antd'; 
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddHoaDonNhap from './AddHoaDonNhap';
import UpdateHoaDonNhap from './UpdateHoaDonNhap';
const { Search } = Input; 

interface HoaDonNhap {
    id: number;
    idNhaCungCap: number;
    ngayNhap: string;
    tongTien: number;
    tenNhaCungCap?: string; 
}


const initialDataSource: HoaDonNhap[] = [
    { id: 1, idNhaCungCap: 1, tenNhaCungCap: 'Công ty Trà Xanh', ngayNhap: '2025-09-01 10:00:00', tongTien: 500000 },
    { id: 2, idNhaCungCap: 2, tenNhaCungCap: 'Kho Nguyên Liệu Tổng Hợp', ngayNhap: '2025-09-05 15:30:00', tongTien: 800000 },
];



const DSHoaDonNhap: React.FC = () => {
    const [dataSource, setDataSource] = useState<HoaDonNhap[]>(initialDataSource);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);

    // Xử lý Tìm kiếm 
    const onSearch = (value: string) => {
        console.log('Đang tìm kiếm hóa đơn theo NCC/ID:', value);
        // lọc dataSource dựa trên value
    };

    // Xử lý Thêm mới
    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    // Xử lý Cập nhật (nhận ID)
    const handleEdit = (id: number) => {
        setEditingItemId(id);
    };

    const handleDelete = (id: number) => {
        //  Gọi API xóa
        setDataSource(prev => prev.filter(hd => hd.id !== id));
        message.success(`Đã xóa Hóa đơn nhập ID: ${id}`);
    };

    const handleCancel = () => {
        setIsAddModalOpen(false);
        setEditingItemId(null);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'tenNhaCungCap', 
            key: 'tenNhaCungCap',
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'ngayNhap',
            key: 'ngayNhap',
            width: 180,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tongTien',
            key: 'tongTien',
            width: 150,
            render: (tien: number) => `${tien.toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: HoaDonNhap) => (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Quản lý Hóa đơn Nhập</h2> 
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm Hóa đơn Nhập
                </Button>
            </div>

            {/* --- MODAL THÊM MỚI (Add) --- */}
            <Modal
                title="Thêm Hóa đơn Nhập mới" 
                open={isAddModalOpen} 
                onCancel={handleCancel}
                footer={null}
            >
                <AddHoaDonNhap onCancel={handleCancel} /> 
            </Modal>

            {/* --- MODAL CẬP NHẬT (Update) --- */}
            <Modal
                // title={`Cập nhật Hóa đơn Nhập (ID: ${editingItemId})`} 
                open={editingItemId !== null}
                onCancel={handleCancel}
                footer={null}
                width={800} 
                destroyOnClose
            >
                {editingItemId !== null && (
                    <UpdateHoaDonNhap id={editingItemId} onCancel={handleCancel} />
                )}
            </Modal>

            {/* --- THANH TÌM KIẾM --- */}
            <div style={{ marginBottom: 20 }}>
                <Search
                    placeholder="Tìm kiếm theo ID hoặc Nhà cung cấp" 
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

export default DSHoaDonNhap;