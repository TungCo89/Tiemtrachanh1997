/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, Space, Modal, Table, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { HoaDonBan } from '../../component/interface';
import AddHoaDonBan from './AddHoaDonBan';
import UpdateHoaDonBan from './UpdateHoaDonBan';
import axios from 'axios';
const { Search } = Input;
const DSHoaDonBan: React.FC = () => {
    const [danhSachHoaDonBan, setDanhSachHoaDonBan] = useState<HoaDonBan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
    const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDonBan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    // State Lưu dữ liệu hóa đơn bán đang chỉnh sửa
    const [dataToEdit, setDataToEdit] = useState<HoaDonBan | null>(null);

    // Hàm gọi API lấy tất cả hóa đơn bán
    const fetchHoaDonBan = useCallback(async (searchQuery = '') => {
        setLoading(true);
        try {
            const endpoint = searchQuery ?
                `http://localhost:7000/api/hoadonban/search-by-keyword?keyword=${searchQuery}` :
                `http://localhost:7000/api/hoadonban/get-all`;

            const response = await axios.get<{ success: boolean; data: HoaDonBan[] }>(endpoint);
            console.log(response);
            if (response.data.success) {
                const resultData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDanhSachHoaDonBan(resultData.filter(Boolean));
            } else {
                message.error('Lỗi khi tải danh sách hóa đơn bán.');
            }
        } catch (error) {
            console.error('Lỗi API Get-All:', error);
            message.error('Không thể kết nối đến máy chủ hoặc lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm gọi API lấy chi tiết hóa đơn bán (dùng cho chỉnh sửa)
    const fetchHoaDonBanById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; data: HoaDonBan }>(`http://localhost:7000/api/hoadonban/get-by-ID?id=${id}`);
            if (response.data.success && response.data.data) {
                setDataToEdit(response.data.data);
                setIsModalOpen(true);
            } else {
                message.error('Không tìm thấy dữ liệu hóa đơn bán để sửa.');
            }
        } catch (error) {
            console.error('Lỗi API Get-by-ID:', error);
            message.error('Lỗi khi lấy chi tiết hóa đơn bán.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHoaDonBan();
    }, [fetchHoaDonBan]);

    const onSearch = (value: string) => {
        fetchHoaDonBan(value);
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
        fetchHoaDonBanById(id);
    };
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setDataToEdit(null);
        fetchHoaDonBan();
    };

    // Xử lý Xóa 
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa hóa đơn bán ID: ${id} này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await axios.delete(`http://localhost:7000/api/hoadonnhap/delete?id=${id}`);

                    if (response.data.success) {
                        message.success(`Đã xóa hóa đơn bán ID: ${id} thành công.`);
                        fetchHoaDonBan();
                    } else {
                        message.error(response.data.message || 'Lỗi khi xóa hóa đơn bán.');
                    }
                } catch (error) {
                    console.error('Lỗi API Delete:', error);
                    message.error('Lỗi máy chủ khi xóa hóa đơn bán.');
                } finally {
                    setLoading(false);
                }
            },
        });
    };
    // Xử lý Xem Chi Tiết Hóa Đơn
    const handleView = (id: number) => {
        const product = danhSachHoaDonBan.find(sp => sp.id === id);

        if (!product) {
            message.warning('Không tìm thấy hóa đơn bán này.');
            return;
        }

        setSelectedHoaDon(product);
        setIsFormulaModalOpen(true);
    };


    // Cấu hình các cột cho Table (ĐÃ SỬA CHO HÓA ĐƠN BÁN)
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Bàn', dataIndex: 'ten_ban', key: 'ten_ban' },
        {
            title: 'Ngày lập',
            dataIndex: 'ngay_lap',
            key: 'ngay_lap',
            render: (ngay_lap: string) => {
                if (!ngay_lap) return '';
                const date = new Date(ngay_lap);

                const formattedDate = date.toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).replace(/\//g, '-');

                const formattedTime = date.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                return `${formattedDate} ${formattedTime}`;
            }
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tong_tien',
            key: 'tong_tien',
            render: (tong_tien: string) => {
                if (!tong_tien) return '0 VNĐ';
                const amount = parseFloat(tong_tien);

                const formattedAmount = amount.toLocaleString('vi-VN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });

                return `${formattedAmount} VNĐ`;
            }
        },

        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: HoaDonBan) => (
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
            <h2>Quản Lý Hóa Đơn Bán</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm hóa đơn bán"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm hóa đơn bán
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={danhSachHoaDonBan}
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
                    <UpdateHoaDonBan
                        id={editingItemId}
                        initialData={dataToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddHoaDonBan
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </Modal>

            {/* Modal Xem Chi Tiết Hóa Đơn */}
            <Modal
                title={`Chi Tiết Hóa Đơn: ${selectedHoaDon?.id || 'Chi tiết hóa đơn bán'}`}
                open={isFormulaModalOpen}
                onCancel={() => {
                    setIsFormulaModalOpen(false);
                    setSelectedHoaDon(null);
                }}
                footer={[
                    <Button key="close" onClick={() => setIsFormulaModalOpen(false)}>
                        Đóng
                    </Button>,
                ]}
                width={700}
            >
                {selectedHoaDon && (
                    <Table
                        size="small"
                        dataSource={selectedHoaDon.chi_tiet}
                        rowKey="id_san_pham"
                        pagination={false}
                        columns={[
                            { title: 'Sản phẩm', dataIndex: 'ten_san_pham', key: 'ten_san_pham' },
                            { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong' },
                            { title: 'Đơn giá', dataIndex: 'don_gia', key: 'don_gia' },
                        ]}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DSHoaDonBan;