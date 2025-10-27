/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Button, Input, Space, Card, Modal, Tag, Popconfirm, message } from 'antd'; // Thêm Popconfirm cho xóa
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import AddBan from './AddBan';
import UpdateBan from './UpdateBan';

const { Search } = Input;

interface Ban {
    id: number;
    tenBan: string;
    trangThai: 'Trong' | 'Đang hoạt động';
    idKhuVuc: number;
    tenKhuVuc: string;
}
interface BanProps {
    trangThai: Ban['trangThai'];
}
const rawDataSource: Ban[] = [
    { id: 1, tenBan: 'Bàn 1', trangThai: 'Trong', idKhuVuc: 1, tenKhuVuc: 'Khu A' },
    { id: 2, tenBan: 'Bàn 2', trangThai: 'Trong', idKhuVuc: 1, tenKhuVuc: 'Khu A' },
    { id: 3, tenBan: 'Bàn 3', trangThai: 'Trong', idKhuVuc: 1, tenKhuVuc: 'Khu A' },
    { id: 4, tenBan: 'Bàn 4', trangThai: 'Trong', idKhuVuc: 1, tenKhuVuc: 'Khu A' },
    { id: 5, tenBan: 'Bàn 5', trangThai: 'Đang hoạt động', idKhuVuc: 1, tenKhuVuc: 'Khu A' },
    { id: 6, tenBan: 'Bàn 9', trangThai: 'Trong', idKhuVuc: 2, tenKhuVuc: 'Khu B' },
    { id: 7, tenBan: 'Bàn 10', trangThai: 'Trong', idKhuVuc: 2, tenKhuVuc: 'Khu B' },
    { id: 8, tenBan: 'Bàn 11', trangThai: 'Trong', idKhuVuc: 2, tenKhuVuc: 'Khu B' },
    { id: 9, tenBan: 'Bàn 12', trangThai: 'Trong', idKhuVuc: 2, tenKhuVuc: 'Khu B' },
];

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
const getBanColor = (trangThai: Ban['trangThai']) => {
    switch (trangThai) {
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
    border: 2px solid ${props => getBanColor(props.trangThai)}; 
    color: ${props => getBanColor(props.trangThai)}; 

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;
// --- END STYLED COMPONENTS ---

const DSBan: React.FC = () => {

    const [dataSource, setDataSource] = useState<Ban[]>(rawDataSource);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [searchText, setSearchText] = useState('');

    // --- LOGIC XỬ LÝ STATE VÀ HANDLERS ---

    // Nhóm dữ liệu theo Khu vực
    const banGroupedByKhuVuc = useMemo(() => {
        return dataSource.reduce((acc, ban) => {
            if (!acc[ban.tenKhuVuc]) {
                acc[ban.tenKhuVuc] = { tenKhuVuc: ban.tenKhuVuc, idKhuVuc: ban.idKhuVuc, bans: [] };
            }
            acc[ban.tenKhuVuc].bans.push(ban);
            return acc;
        }, {} as Record<string, { tenKhuVuc: string, idKhuVuc: number, bans: Ban[] }>);
    }, [dataSource]);

    const handleAdd = () => setIsAddModalOpen(true);
    const handleEdit = (id: number) => setEditingItemId(id);
    const handleCancel = () => {
        setIsAddModalOpen(false);
        setEditingItemId(null);
    };

    const filteredBanData = useMemo(() => {
        if (!searchText) return dataSource;
        return dataSource.filter(ban =>
            ban.tenBan.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [dataSource, searchText]);

    const handleOrder = (id: number) => {
        // API call
        setDataSource(prev => prev.filter(b => b.id !== id));
        message.success(`Đã thêm order Bàn ID: ${id}`);
    };

    const handleDelete = (id: number) => {
        // API call
        setDataSource(prev => prev.filter(b => b.id !== id));
        message.success(`Đã xóa Bàn ID: ${id}`);
    };



    // --- RENDER COMPONENT BÀN ---
    const RenderBanItem: React.FC<{ ban: Ban }> = ({ ban }) => {
        return (
            <Popconfirm
                title={`Thao tác với ${ban.tenBan}`}
                description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(ban.id)}
                            style={{ width: '100%', backgroundColor: '#333', color: 'white', borderColor: '#333' }}
                            size="small"
                        >
                            Sửa
                        </Button>
                        <Popconfirm
                            title={`Order với ${ban.tenBan}?`}
                            onConfirm={() => handleOrder(ban.id)}
                            okText="order"
                            cancelText="Hủy"
                            placement="bottom"
                        >
                            <Button
                                icon={<EditOutlined />}
                                style={{ width: '100%', backgroundColor: '#333', color: 'white', borderColor: '#333' }}
                                size="small"
                            >
                                Order
                            </Button>
                        </Popconfirm>

                        <Popconfirm
                            title={`Xác nhận xóa ${ban.tenBan}?`}
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
                okText="Xem chi tiết"
                cancelText="Đóng"
                icon={null}
                placement="rightTop"
            >
                <BanItem trangThai={ban.trangThai}>
                    {ban.tenBan.split(' ').pop()}
                    <div style={{ fontSize: 10, fontWeight: 'normal', color: 'gray', marginTop: 2 }}>
                        {ban.trangThai}
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

        // Nếu có tìm kiếm, chỉ hiển thị bàn đã lọc (bỏ qua nhóm khu vực trực quan)
        if (searchText && filteredBanData.length > 0) {
            return (
                <KhuVucBox title={`Kết quả tìm kiếm cho: "${searchText}"`}>
                    <BanGrid>
                        {filteredBanData.map(ban => (
                            <RenderBanItem key={ban.id} ban={ban} />
                        ))}
                    </BanGrid>
                </KhuVucBox>
            );
        }


        return (
            <KhuVucContainer>
                {khuVucKeys.map(key => {
                    const khuVuc = banGroupedByKhuVuc[key];
                    return (
                        <KhuVucBox
                            key={khuVuc.idKhuVuc}
                            title={khuVuc.tenKhuVuc}
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
                    >
                        Thêm Bàn
                    </Button>
                </Space>
            </div>
            {renderKhuVuc()}

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
        </div>
    );
};

export default DSBan;