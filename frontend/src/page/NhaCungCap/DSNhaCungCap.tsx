/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Input, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddNhaCungCap from './AddNhaCungCap';
import UpdateNhaCungCap from './UpdateNhaCungCap';
import axios from 'axios';
import { NhaCungCap } from '../../component/interface';
const { Search } = Input;


const DSNhaCungCap: React.FC = () => {
    const [danhSachNhaCungCap, setDanhSachNhaCungCap] = useState<NhaCungCap[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    // State Lưu dữ liệu nhà cung cấp đang chỉnh sửa
    const [dataToEdit, setDataToEdit] = useState<NhaCungCap | null>(null);

    // Hàm gọi API lấy tất cả nhà cung cấp
    const fetchNhaCungCap = useCallback(async (searchQuery = '') => {
        setLoading(true);
        try {
            const endpoint = searchQuery ?
                `http://localhost:7000/api/nhacungcap/search-by-keyword?keyword=${searchQuery}` :
                `http://localhost:7000/api/nhacungcap/get-all`;

            const response = await axios.get<{ success: boolean; data: NhaCungCap[] }>(endpoint);
            console.log(response);
            if (response.data.success) {
                const resultData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDanhSachNhaCungCap(resultData.filter(Boolean));
            } else {
                message.error('Lỗi khi tải danh sách nhà cung cấp.');
            }
        } catch (error) {
            console.error('Lỗi API Get-All:', error);
            message.error('Không thể kết nối đến máy chủ hoặc lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm gọi API lấy chi tiết nhà cung cấp (dùng cho chỉnh sửa)
    const fetchNhaCungCapById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; data: NhaCungCap }>(`http://localhost:7000/api/nhacungcap/get-by-ID?id=${id}`);
            if (response.data.success && response.data.data) {
                setDataToEdit(response.data.data);
                setIsModalOpen(true);
            } else {
                message.error('Không tìm thấy dữ liệu nhà cung cấp để sửa.');
            }
        } catch (error) {
            console.error('Lỗi API Get-by-ID:', error);
            message.error('Lỗi khi lấy chi tiết nhà cung cấp.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNhaCungCap();
    }, [fetchNhaCungCap]);

    const onSearch = (value: string) => {
        fetchNhaCungCap(value);
    };
    // Xử lý Thêm mới
    const handleAdd = () => {
        setEditingItemId(null);
        setDataToEdit(null);
        setIsModalOpen(true);
    };

    // Xử lý Sửa
    const handleEdit = (id: number) => {
        setEditingItemId(id);
        fetchNhaCungCapById(id);
    };
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setDataToEdit(null);
        fetchNhaCungCap();
    };

    // Xử lý Xóa 
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa nhà cung cấp ID: ${id} này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await axios.delete(`http://localhost:7000/api/nhacungcap/delete?id=${id}`);

                    if (response.data.success) {
                        message.success(`Đã xóa nhà cung cấp ID: ${id} thành công.`);
                        fetchNhaCungCap();
                    } else {
                        message.error(response.data.message || 'Lỗi khi xóa nhà cung cấp.');
                    }
                } catch (error) {
                    console.error('Lỗi API Delete:', error);
                    message.error('Lỗi máy chủ khi xóa nhà cung cấp.');
                } finally {
                    setLoading(false);
                }
            },
        });
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
            dataIndex: 'ten_ncc',
            key: 'ten_ncc',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'dia_chi',
            key: 'dia_chi',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'so_dien_thoai',
            key: 'so_dien_thoai',
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: NhaCungCap) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Sửa</Button>

                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>            ),
        },
    ];

    return (
        <div >
            <h2>Quản lý nhà cung cấp</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm nhà cung cấp"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm nhà cung cấp
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={danhSachNhaCungCap}
                rowKey="id"
                loading={loading}
            />

            {/* MODAL CHUNG CHO THÊM VÀ SỬA */}
            <Modal
                title={editingItemId ? "Cập nhật nhà cung cấp" : "Thêm mới nhà cung cấp"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden={true}
            >
                {editingItemId ? (
                    <UpdateNhaCungCap
                        id={editingItemId}
                        initialData={dataToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddNhaCungCap
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DSNhaCungCap;