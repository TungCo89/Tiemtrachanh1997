/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Button, Input, Space, Card, Modal, Tag, Popconfirm, message } from 'antd'; // Thêm Popconfirm cho xóa
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, ClearOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import AddBan from './AddBan';
import UpdateBan from './UpdateBan';
import axios from 'axios';
import { Ban } from '../../component/interface';
import AddOrder from '../Order/AddOrder';
import UpdateOrder from '../Order/UpdateOrder';
interface BanProps {
    trang_thai: Ban['trang_thai'];
}

const KhuVucContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: start;
`;

const KhuVucBox = styled(Card)`
    flex: 0 0 auto; 
    width: 350px; 
    padding: 10px;
    background-color: #f0f0f0; 
    border-radius: 8px;
    .ant-card-head {
        text-align: center;
        font-weight: bold;
        border-bottom: none;
    }
`;

const BanGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    gap: 15px;
    padding: 10px;
`;
const getBanColor = (trang_thai: Ban['trang_thai']) => {
    switch (trang_thai) {
        case 'Đang hoạt động':
            return '#ff4d4f';
        case 'Trong':
        default:
            return '#52c41a';
    }
};

const BanItem = styled.div<BanProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px; 
    padding: 5px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    border: 2px solid ${props => getBanColor(props.trang_thai)}; 
    color: ${props => getBanColor(props.trang_thai)}; 

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;
// --- END STYLED COMPONENTS ---

const DSBan: React.FC = () => {
    const [danhSachBan, setDanhSachBan] = useState<Ban[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [orderIdBan, setOrderIdBan] = useState<number | null>(null);
    const [viewingBanId, setViewingBanId] = useState<number | null>(null);
    // --- LOGIC XỬ LÝ STATE VÀ HANDLERS ---
    // Hàm gọi API
    const fetchBanData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:7000/api/ban/get-all');
            const result = response.data;
            console.log(result);

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                const banList: Ban[] = result.data[0].map((item: any) => ({
                    id: item.id,
                    ten_ban: item.ten_ban,
                    trang_thai: item.trang_thai,
                    id_khu_vuc: item.id_khu_vuc,
                    ten_khu_vuc: item.ten_khu_vuc,
                }));
                setDanhSachBan(banList);

            } else {
                setDanhSachBan([]);
                message.warning('Không có dữ liệu bàn');
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách bàn:', error);
            message.error('Không thể tải danh sách bàn');
            setDanhSachBan([]);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {

        fetchBanData();
    }, []);
    // Nhóm dữ liệu theo Khu vực
    const banGroupedByKhuVuc = useMemo(() => {
        return danhSachBan.reduce((acc, ban) => {
            if (!acc[ban.ten_khu_vuc]) {
                acc[ban.ten_khu_vuc] = { ten_khu_vuc: ban.ten_khu_vuc, id_khu_vuc: ban.id_khu_vuc, bans: [] };
            }
            acc[ban.ten_khu_vuc].bans.push(ban);
            return acc;
        }, {} as Record<string, { ten_khu_vuc: string, id_khu_vuc: number, bans: Ban[] }>);
    }, [danhSachBan]);

    const handleAdd = () => setIsAddModalOpen(true);
    const handleEdit = (id: number) => setEditingItemId(id);
    const handleCancel = () => {
        setIsAddModalOpen(false);
        setEditingItemId(null);
    };

    const filteredBanData = useMemo(() => {
        if (!searchText) return danhSachBan;
        return danhSachBan.filter(ban =>
            ban.ten_ban.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [danhSachBan, searchText]);

    const handleClear = async (id: number) => {
        try {
            const response = await axios.post(`http://localhost:7000/api/ban/don-ban?id=${id}`);
            // Kiểm tra phản hồi từ server
            if (response.data.success) {
                message.success(`Đã dọn sạch Bàn ID: ${id}`);
                fetchBanData();
            } else {
                message.error(response.data.message || 'Không thể dọn bàn.');
            }
        } catch (error) {
            console.error('Lỗi khi dọn bàn:', error);
            message.error('Lỗi kết nối máy chủ. Vui lòng thử lại.');
        }
    };

    const handleDelete = (id: number) => {
        // API call
        setDanhSachBan(prev => prev.filter(b => b.id !== id));
        message.success(`Đã xóa Bàn ID: ${id}`);
    };

    // --- RENDER COMPONENT BÀN ---
    const RenderBanItem: React.FC<{ ban: Ban }> = ({ ban }) => {
        const hienThiTrangThai = ban.trang_thai === 'Trong' ? 'Trống' : 'Đang dùng';
        return (
            <Popconfirm
                title={`Thao tác với ${ban.ten_ban}`}
                description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {/* <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(ban.id)}
                            style={{ width: '100%', backgroundColor: '#333', color: 'white', borderColor: '#333' }}
                            size="small"
                        >
                            Sửa
                        </Button> */}
                        <Popconfirm
                            title={`Tạo order cho ${ban.ten_ban}?`}
                            onConfirm={() => setOrderIdBan(ban.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ type: 'primary' }}
                        >
                            <Button
                                icon={<PlusCircleOutlined />}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#52c41a', // xanh lá - hành động tích cực
                                    borderColor: '#52c41a',
                                    color: 'white',
                                }}
                                size="small"
                            >
                                Order
                            </Button>
                        </Popconfirm>

                        <Popconfirm
                            title={`Dọn sạch bàn ${ban.ten_ban}?`}
                            onConfirm={() => handleClear(ban.id)}
                            okText="Dọn"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                            placement="bottom"
                        >
                            <Button
                                icon={<ClearOutlined />}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#faad14', // vàng cam - cảnh báo nhẹ
                                    borderColor: '#faad14',
                                    color: 'white',
                                }}
                                size="small"
                            >
                                Dọn bàn
                            </Button>
                        </Popconfirm>

                        <Popconfirm
                            title={`Xác nhận xóa ${ban.ten_ban}?`}
                            onConfirm={() => handleDelete(ban.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            placement="bottom"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{ width: '100%' }}
                                size="small"
                            >
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Space>
                }
                onConfirm={() => setViewingBanId(ban.id)}
                okText="Xem chi tiết"
                cancelText="Đóng"
                icon={null}
                placement="rightTop"
            >
                <BanItem trang_thai={ban.trang_thai}>
                    <div>{ban.ten_ban}</div>

                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: 'normal',
                            marginTop: '4px',
                            color: ban.trang_thai === 'Trong' ? '#52c41a' : '#ff4d4f',
                        }}
                    >
                        {(() => {
                            // console.log('trang_thai:', ban.trang_thai);
                            return null; 
                        })()}
                        {ban.trang_thai === 'Trong' ? 'Trống' : 'Đang dùng'}
                    </div>
                </BanItem>
            </Popconfirm>
        );
    };

    // --- RENDER KHU VỰC ---
    const renderKhuVuc = () => {
        // Lấy danh sách Khu vực từ dữ liệu đã lọc
        const khuVucKeys = Object.keys(banGroupedByKhuVuc);

        if (searchText && filteredBanData.length === 0) {
            return <p>Không tìm thấy bàn nào theo từ khóa: "{searchText}"</p>
        }

        // // Nếu có tìm kiếm, chỉ hiển thị bàn đã lọc (bỏ qua nhóm khu vực trực quan)
        // if (searchText && filteredBanData.length > 0) {
        //     return (
        //         <KhuVucBox title={`Kết quả tìm kiếm cho: "${searchText}"`}>
        //             <BanGrid>
        //                 {filteredBanData.map(ban => (
        //                     <RenderBanItem key={ban.id} ban={ban} />
        //                 ))}
        //             </BanGrid>
        //         </KhuVucBox>
        //     );
        // }


        return (
            <KhuVucContainer>
                {khuVucKeys.map(key => {
                    const khuVuc = banGroupedByKhuVuc[key];
                    return (
                        <KhuVucBox
                            key={khuVuc.id_khu_vuc}
                            title={khuVuc.ten_khu_vuc}
                        >
                            <BanGrid>
                                {khuVuc.bans.map(ban => (
                                    <RenderBanItem key={ban.id} ban={ban} />
                                ))}
                            </BanGrid>
                        </KhuVucBox>
                    );
                })}
            </KhuVucContainer>
        );
    };

    return (
        <div style={{ padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Quản lý Bàn & Sơ đồ</h2>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        disabled={loading}
                    >
                        Thêm Bàn
                    </Button>
                </Space>
            </div>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Đang tải danh sách bàn...</p>
                </div>
            ) : (
                renderKhuVuc()
            )}

            <Modal
                title="Thêm Bàn mới"
                open={isAddModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <AddBan onCancel={handleCancel} />
            </Modal>

            {/* 5. MODAL CẬP NHẬT */}
            <Modal
                title={`Cập nhật Bàn ID: ${editingItemId}`}
                open={editingItemId !== null}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                {editingItemId !== null && (
                    <UpdateBan id={editingItemId} onCancel={handleCancel} />
                )}
            </Modal>

            <Modal
                title="Tạo Hóa đơn"
                open={orderIdBan !== null}
                onCancel={() => setOrderIdBan(null)}
                footer={null}
                width={700}
            >
                {orderIdBan && (
                    <AddOrder
                        id_ban={orderIdBan}
                        onClose={() => setOrderIdBan(null)}
                        onSuccess={() => {
                            setOrderIdBan(null);
                            fetchBanData();
                        }}
                    />
                )}
            </Modal>

            <Modal
                title="Chi tiết Hóa đơn"
                open={viewingBanId !== null}
                onCancel={() => setViewingBanId(null)}
                footer={null}
                width={800}
            >
                {viewingBanId && (
                    <UpdateOrder
                        idBan={viewingBanId}
                        onClose={() => setViewingBanId(null)}
                        onSuccess={() => {
                            setViewingBanId(null);
                            fetchBanData();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default DSBan;