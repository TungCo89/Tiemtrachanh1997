/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Table, Button, Input, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { LoaiSanPham } from '../../component/interface';
import AddLoaiSanPham from './AddLoaiSanPham';
import UpdateLoaiSanPham from './UpdateLoaiSanPham';
import axios from 'axios';
const { Search } = Input;


const DSLoaiSanPham: React.FC = () => {
    const [danhSachSP, setDanhSachSP] = useState<LoaiSanPham[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    // State Lưu dữ liệu loại sản phẩm đang chỉnh sửa
    const [dataToEdit, setDataToEdit] = useState<LoaiSanPham | null>(null);

    // Hàm gọi API lấy tất cả danh mục sản phẩm
    const fetchLoaiSanPham = useCallback(async (searchQuery = '') => {
        setLoading(true);
        try {
            const endpoint = searchQuery ?
                `http://localhost:7000/api/loaisanpham/search-by-name?name=${searchQuery}` :
                `http://localhost:7000/api/loaisanpham/get-all`;

            const response = await axios.get<{ success: boolean; data: LoaiSanPham[] }>(endpoint);
            console.log(response);
            if (response.data.success) {
                const resultData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDanhSachSP(resultData.filter(Boolean));
            } else {
                message.error('Lỗi khi tải danh sách danh mục sản phẩm.');
            }
        } catch (error) {
            console.error('Lỗi API Get-All:', error);
            message.error('Không thể kết nối đến máy chủ hoặc lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm gọi API lấy chi tiết sản phẩm (dùng cho chỉnh sửa)
    const fetchLoaiSanPhamById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; data: LoaiSanPham }>(`http://localhost:7000/api/sanpham/get-by-ID?id=${id}`);
            if (response.data.success && response.data.data) {
                setDataToEdit(response.data.data);
                setIsModalOpen(true);
            } else {
                message.error('Không tìm thấy dữ liệu loại sản phẩm để sửa.');
            }
        } catch (error) {
            console.error('Lỗi API Get-by-ID:', error);
            message.error('Lỗi khi lấy chi tiết loại sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoaiSanPham();
    }, [fetchLoaiSanPham]);

    const onSearch = (value: string) => {
        fetchLoaiSanPham(value);
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
        fetchLoaiSanPhamById(id);
    };
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setDataToEdit(null);
        fetchLoaiSanPham();
    };

    // Xử lý Xóa 
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa loại sản phẩm ID: ${id} này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await axios.delete(`http://localhost:7000/api/loaisanpham/delete?id=${id}`);

                    if (response.data.success) {
                        message.success(`Đã xóa loại sản phẩm ID: ${id} thành công.`);
                        fetchLoaiSanPham();
                    } else {
                        message.error(response.data.message || 'Lỗi khi xóa sản phẩm.');
                    }
                } catch (error) {
                    console.error('Lỗi API Delete:', error);
                    message.error('Lỗi máy chủ khi xóa loại sản phẩm.');
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
            title: 'Tên loại',
            dataIndex: 'ten_loai',
            key: 'ten_loai',
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: LoaiSanPham) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Sửa</Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>Quản lý loại sản phẩm</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm loại sản phẩm"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm danh mục sản phẩm
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={danhSachSP}
                rowKey="id"
                loading={loading}
            />

            {/* MODAL CHUNG CHO THÊM VÀ SỬA */}
            <Modal
                title={editingItemId ? "Cập nhật Loại sản phẩm" : "Thêm mới Loại sản phẩm"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden={true}
            >
                {editingItemId ? (
                    <UpdateLoaiSanPham
                        id={editingItemId}
                        initialData={dataToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddLoaiSanPham
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DSLoaiSanPham;