/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Button, Input, Space, Modal, Table, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { HoaDonNhap } from '../../component/interface';
import AddHoaDonNhap from './AddHoaDonNhap';
import UpdateHoaDonNhap from './UpdateHoaDonNhap';
import axios from 'axios';
const { Search } = Input;

const DSHoaDonNhap: React.FC = () => {
    const [danhSachHoaDonNhap, setDanhSachHoaDonNhap] = useState<HoaDonNhap[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
    const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDonNhap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    // State Lưu dữ liệu hóa đơn nhập đang chỉnh sửa
    const [dataToEdit, setDataToEdit] = useState<HoaDonNhap | null>(null);

    // Hàm gọi API lấy tất cả hóa đơn nhập
    const fetchHoaDonNhap = useCallback(async (searchQuery = '') => {
        setLoading(true);
        try {
            const endpoint = searchQuery ?
                `http://localhost:7000/api/hoadonnhap/search-by-keyword?keyword=${searchQuery}` :
                `http://localhost:7000/api/hoadonnhap/get-all`;

            const response = await axios.get<{ success: boolean; data: HoaDonNhap[] }>(endpoint);
            console.log(response);
            if (response.data.success) {
                const resultData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDanhSachHoaDonNhap(resultData.filter(Boolean));
            } else {
                message.error('Lỗi khi tải danh sách hóa đơn nhập.');
            }
        } catch (error) {
            console.error('Lỗi API Get-All:', error);
            message.error('Không thể kết nối đến máy chủ hoặc lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm gọi API lấy chi tiết hóa đơn nhập (dùng cho chỉnh sửa)
    const fetchHoaDonNhapById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; data: HoaDonNhap }>(`http://localhost:7000/api/hoadonnhap/get-by-ID?id=${id}`);
            if (response.data.success && response.data.data) {
                setDataToEdit(response.data.data);
                setIsModalOpen(true);
            } else {
                message.error('Không tìm thấy dữ liệu hóa đơn nhập để sửa.');
            }
        } catch (error) {
            console.error('Lỗi API Get-by-ID:', error);
            message.error('Lỗi khi lấy chi tiết hóa đơn nhập.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHoaDonNhap();
    }, [fetchHoaDonNhap]);

    const onSearch = (value: string) => {
        fetchHoaDonNhap(value);
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
        fetchHoaDonNhapById(id);
    };
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setDataToEdit(null);
        fetchHoaDonNhap();
    };

    // Xử lý Xóa 
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa hóa đơn nhập ID: ${id} này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await axios.delete(`http://localhost:7000/api/hoadonnhap/delete?id=${id}`);

                    if (response.data.success) {
                        message.success(`Đã xóa hóa đơn nhập ID: ${id} thành công.`);
                        fetchHoaDonNhap();
                    } else {
                        message.error(response.data.message || 'Lỗi khi xóa hóa đơn nhập.');
                    }
                } catch (error) {
                    console.error('Lỗi API Delete:', error);
                    message.error('Lỗi máy chủ khi xóa hóa đơn nhập.');
                } finally {
                    setLoading(false);
                }
            },
        });
    };
    // Xử lý Xem Chi Tiết Hóa Đơn
    const handleView = (id: number) => {
        const product = danhSachHoaDonNhap.find(sp => sp.id === id);

        if (!product) {
            message.warning('Không tìm thấy hóa đơn nhập này.');
            return;
        }

        setSelectedHoaDon(product);
        setIsFormulaModalOpen(true);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nhà cung cấp', dataIndex: 'ten_ncc', key: 'ten_ncc' },
        {
            title: 'Ngày nhập',
            dataIndex: 'ngay_nhap',
            key: 'ngay_nhap',
            render: (ngay_nhap: string) => {
                if (!ngay_nhap) return '';
                const date = new Date(ngay_nhap);

                // Định dạng YYYY-MM-DD
                const formattedDate = date.toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).replace(/\//g, '-'); // Đảm bảo dấu gạch ngang

                // Định dạng HH:MM (24h)
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

                // Định dạng tiền tệ (560.000)
                const formattedAmount = amount.toLocaleString('vi-VN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });

                return `${formattedAmount} VNĐ`;
            }
        },
        { title: 'Ghi chú', dataIndex: 'ghi_chu', key: 'ghi_chu' },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: HoaDonNhap) => (
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
            <h2>Quản Lý Hóa Đơn Nhập</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm hóa đơn nhập"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm hóa đơn nhập
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={danhSachHoaDonNhap}
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
                    <UpdateHoaDonNhap
                        id={editingItemId}
                        initialData={dataToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddHoaDonNhap
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </Modal>

            {/* Modal Xem Chi Tiết Hóa Đơn */}
            <Modal
                title={`Chi Tiết Hóa Đơn Nhập: ${selectedHoaDon?.id || 'Chi tiết hóa đơn nhập'}`}
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
                        rowKey="id_nguyen_lieu"
                        pagination={false}
                        columns={[
                            { title: 'Nguyên liệu', dataIndex: 'ten_nguyen_lieu', key: 'ten_nguyen_lieu' },
                            { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong' },
                            { title: 'Đơn giá', dataIndex: 'don_gia', key: 'don_gia' },
                        ]}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DSHoaDonNhap;