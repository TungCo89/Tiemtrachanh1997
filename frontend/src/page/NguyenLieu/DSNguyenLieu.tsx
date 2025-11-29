/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Table, Button, Input, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddNguyenLieu from './AddNguyenLieu';
import UpdateNguyenLieu from './UpdateNguyenLieu';
import axios from 'axios';
import { NguyenLieu } from '../../component/interface';
const { Search } = Input;



const DSNguyenLieu: React.FC = () => {
    const [danhSachSP, setDanhSachSP] = useState<NguyenLieu[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    // State Lưu dữ liệu nguyên liệu đang chỉnh sửa
    const [dataToEdit, setDataToEdit] = useState<NguyenLieu | null>(null);
    // Hàm gọi API lấy tất cả danh mục sản phẩm
    const fetchNguyenLieu = useCallback(async (searchQuery = '') => {
        setLoading(true);
        try {
            const endpoint = searchQuery ?
                `http://localhost:7000/api/nguyenlieu/search-by-name?name=${searchQuery}` :
                `http://localhost:7000/api/nguyenlieu/get-all`;

            const response = await axios.get<{ success: boolean; data: NguyenLieu[] }>(endpoint);
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
    const fetchNguyenLieuById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; data: NguyenLieu }>(`http://localhost:7000/api/nguyenlieu/get-by-ID?id=${id}`);
            if (response.data.success && response.data.data) {
                setDataToEdit(response.data.data);
                setIsModalOpen(true);
            } else {
                message.error('Không tìm thấy dữ liệu nguyên liệu để sửa.');
            }
        } catch (error) {
            console.error('Lỗi API Get-by-ID:', error);
            message.error('Lỗi khi lấy chi tiết nguyên liệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNguyenLieu();
    }, [fetchNguyenLieu]);

    const onSearch = (value: string) => {
        fetchNguyenLieu(value);
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
        fetchNguyenLieuById(id);
    };
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setDataToEdit(null);
        fetchNguyenLieu();
    };

    // Xử lý Xóa 
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa nguyên liệu ID: ${id} này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await axios.delete(`http://localhost:7000/api/nguyenlieu/delete?id=${id}`);

                    if (response.data.success) {
                        message.success(`Đã xóa nguyên liệu ID: ${id} thành công.`);
                        fetchNguyenLieu();
                    } else {
                        message.error(response.data.message || 'Lỗi khi xóa sản phẩm.');
                    }
                } catch (error) {
                    console.error('Lỗi API Delete:', error);
                    message.error('Lỗi máy chủ khi xóa nguyên liệu.');
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
            title: 'Tên nguyên liệu',
            dataIndex: 'ten_nguyen_lieu',
            key: 'ten_nguyen_lieu',
        },
        {
            title: 'Số lượng tồn',
            dataIndex: 'so_luong_ton',
            key: 'so_luong_ton',
        },
        {
            title: 'Đơn vị đo',
            dataIndex: 'don_vi',
            key: 'don_vi',
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: NguyenLieu) => (
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
        <div >
            <h2>Quản lý nguyên liệu</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm nguyên liệu"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm nguyên liệu
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
                title={editingItemId ? "Cập nhật nguyên liệu" : "Thêm mới nguyên liệu"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden={true}
            >
                {editingItemId ? (
                    <UpdateNguyenLieu
                        id={editingItemId}
                        initialData={dataToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddNguyenLieu
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </Modal>

            {/* MODAL CHUNG CHO THÊM VÀ SỬA */}
            <Modal
                title={editingItemId ? "Cập nhật nguyên liệu" : "Thêm mới nguyên liệu"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden={true}
            >
                {editingItemId ? (
                    <UpdateNguyenLieu
                        id={editingItemId}
                        initialData={dataToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddNguyenLieu
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DSNguyenLieu;