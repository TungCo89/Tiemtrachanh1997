/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, message, notification, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { SanPham } from '../../component/interface';
import AddSanPham from './AddSanPham'
import UpdateSanPham from './UpdateSanPham';
const { Search } = Input;

const DSSanPham: React.FC = () => {
    const [danhSachSP, setDanhSachSP] = useState<SanPham[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<SanPham | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    // State Lưu dữ liệu sản phẩm đang chỉnh sửa
    const [dataToEdit, setDataToEdit] = useState<SanPham | null>(null);

    // Hàm gọi API lấy tất cả sản phẩm
    const fetchSanPham = useCallback(async (searchQuery = '') => {
        setLoading(true);
        try {
            const endpoint = searchQuery ?
                `http://localhost:7000/api/sanpham/search-by-name?name=${searchQuery}` :
                `http://localhost:7000/api/sanpham/get-all`;

            const response = await axios.get<{ success: boolean; data: SanPham[] }>(endpoint);
            console.log(response);
            if (response.data.success) {
                const resultData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDanhSachSP(resultData.filter(Boolean));
            } else {
                message.error('Lỗi khi tải danh sách sản phẩm.');
            }
        } catch (error) {
            console.error('Lỗi API Get-All:', error);
            message.error('Không thể kết nối đến máy chủ hoặc lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm gọi API lấy chi tiết sản phẩm (dùng cho chỉnh sửa)
    const fetchSanPhamById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; data: SanPham }>(`http://localhost:7000/api/sanpham/get-by-ID?id=${id}`);
            if (response.data.success && response.data.data) {
                setDataToEdit(response.data.data);
                setIsModalOpen(true);
            } else {
                message.error('Không tìm thấy dữ liệu sản phẩm để sửa.');
            }
        } catch (error) {
            console.error('Lỗi API Get-by-ID:', error);
            message.error('Lỗi khi lấy chi tiết sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSanPham();
    }, [fetchSanPham]);

    const onSearch = (value: string) => {
        fetchSanPham(value);
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
        fetchSanPhamById(id);
    };
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setDataToEdit(null);
        fetchSanPham();
    };

    // Xử lý Xóa 
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa sản phẩm ID: ${id} này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await axios.delete(`http://localhost:7000/api/sanpham/delete?id=${id}`);

                    if (response.data.success) {
                        message.success(`Đã xóa sản phẩm ID: ${id} thành công.`);
                        fetchSanPham();
                    } else {
                        message.error(response.data.message || 'Lỗi khi xóa sản phẩm.');
                    }
                } catch (error) {
                    console.error('Lỗi API Delete:', error);
                    message.error('Lỗi máy chủ khi xóa sản phẩm.');
                } finally {
                    setLoading(false);
                }
            },
        });
    };
    // Xử lý Xem Công thức
    const handleView = (id: number) => {
        const product = danhSachSP.find(sp => sp.id === id);

        if (!product) {
            message.warning('Không tìm thấy sản phẩm này.');
            return;
        }

        setSelectedProduct(product);
        setIsFormulaModalOpen(true);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Loại', dataIndex: 'ten_loai', key: 'ten_loai' },
        { title: 'Tên sản phẩm', dataIndex: 'ten_san_pham', key: 'ten_san_pham' },
        { title: 'Giá bán', dataIndex: 'gia_ban', key: 'gia_ban' },
        { title: 'Mô tả', dataIndex: 'mo_ta', key: 'mo_ta' },
        {
            title: 'Chức năng',
            key: 'action',
            render: (_: any, record: SanPham) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleView(record.id)}>CT</Button>
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
            <h2>Quản lý sản phẩm</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm sản phẩm"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm sản phẩm
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
                title={editingItemId ? "Cập nhật Sản phẩm" : "Thêm mới Sản phẩm"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden={true}
            >
                {editingItemId ? (
                    <UpdateSanPham
                        id={editingItemId}
                        initialData={dataToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddSanPham
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </Modal>

            {/* Modal Xem Công thức */}
            <Modal
                title={`Công thức: ${selectedProduct?.ten_san_pham || 'Chi tiết sản phẩm'}`}
                open={isFormulaModalOpen}
                onCancel={() => {
                    setIsFormulaModalOpen(false);
                    setSelectedProduct(null); 
                }}
                footer={[
                    <Button key="close" onClick={() => setIsFormulaModalOpen(false)}>
                        Đóng
                    </Button>,
                ]}
                width={700} 
            >
                {selectedProduct && (
                    <Table
                        size="small"
                        dataSource={selectedProduct.cong_thuc}
                        rowKey="id_nguyen_lieu"
                        pagination={false}
                        columns={[
                            { title: 'Nguyên liệu', dataIndex: 'ten_nguyen_lieu', key: 'ten_nguyen_lieu' },
                            { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong' },
                            { title: 'Đơn vị', dataIndex: 'don_vi', key: 'don_vi' },
                        ]}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DSSanPham;