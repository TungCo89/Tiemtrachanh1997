import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Input, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { User } from '../../component/interface';
import AddUsers from './AddUsers';
import UpdateUsers from './UpdateUsers';
import axios from 'axios';
const { Search } = Input;

const DSUsers: React.FC = () => {
    const [danhSachUser, setDanhSachUser] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [editingItemId, setEditingItemId] = useState<number | null>(null);
    // State Lưu dữ liệu người dùng đang chỉnh sửa
    const [dataToEdit, setDataToEdit] = useState<User | null>(null);

    // Hàm gọi API lấy tất cả người dùng
    const fetchUser = useCallback(async (searchQuery = '') => {
        setLoading(true);
        try {
            const endpoint = searchQuery ?
                `http://localhost:7000/api/user/search-by-name?name=${searchQuery}` :
                `http://localhost:7000/api/user/get-all`;

            const response = await axios.get<{ success: boolean; data: User[] }>(endpoint);

            if (response.data.success) {
                const resultData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDanhSachUser(resultData.filter(Boolean));
            } else {
                message.error('Lỗi khi tải danh sách người dùng.');
            }
        } catch (error) {
            console.error('Lỗi API Get-All:', error);
            message.error('Không thể kết nối đến máy chủ hoặc lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm gọi API lấy chi tiết người dùng (dùng cho chỉnh sửa)
    const fetchUserById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ success: boolean; data: User }>(`http://localhost:7000/api/user/get-by-ID?id=${id}`);
            if (response.data.success && response.data.data) {
                setDataToEdit(response.data.data);
                setIsModalOpen(true);
            } else {
                message.error('Không tìm thấy dữ liệu người dùng để sửa.');
            }
        } catch (error) {
            console.error('Lỗi API Get-by-ID:', error);
            message.error('Lỗi khi lấy chi tiết người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const onSearch = (value: string) => {
        fetchUser(value);
    };


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null); // null khi không sửa

    // Xử lý Thêm mới
    const handleAdd = () => {
        setEditingItemId(null);
        setDataToEdit(null);
        setIsModalOpen(true);
    };

    // Xử lý Sửa
    const handleEdit = (id: number) => {
        setEditingItemId(id);
        fetchUserById(id);
    };
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItemId(null);
        setDataToEdit(null);
        fetchUser();
    };

    // Xử lý Xóa 
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa người dùng ID: ${id} này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await axios.delete(`http://localhost:7000/api/user/delete?id=${id}`);

                    if (response.data.success) {
                        message.success(`Đã xóa người dùng ID: ${id} thành công.`);
                        fetchUser();
                    } else {
                        message.error(response.data.message || 'Lỗi khi xóa người dùng.');
                    }
                } catch (error) {
                    console.error('Lỗi API Delete:', error);
                    message.error('Lỗi máy chủ khi xóa người dùng.');
                } finally {
                    setLoading(false);
                }
            },
        });
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
            width: 60,
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'tenDangNhap',
            key: 'tenDangNhap',
            width: 120,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mật khẩu',
            dataIndex: 'matKhau',
            key: 'matKhau',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'soDienThoai',
            key: 'soDienThoai',
            width: 120,
        },
        {
            title: 'Vai trò',
            dataIndex: 'tenVaiTro',
            key: 'tenVaiTro',
            width: 120,
        },
        {
            title: 'Chức năng',
            key: 'action',
            width: 150,
            render: (_: any, record: User) => (
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
                <h2>Quản lý người dùng</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Search
                        placeholder="Tìm kiếm người dùng"
                        allowClear
                        onSearch={onSearch}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm người dùng
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={danhSachUser}
                    rowKey="id"
                    loading={loading}
                />

                {/* MODAL CHUNG CHO THÊM VÀ SỬA */}
                <Modal
                    title={editingItemId ? "Cập nhật người dùng" : "Thêm mới người dùng"}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    destroyOnClose={true}
                >
                    {editingItemId ? (
                        <UpdateUsers
                            id={editingItemId}
                            initialData={dataToEdit}
                            onClose={() => setIsModalOpen(false)}
                            onSuccess={handleSuccess}
                        />
                    ) : (
                        <AddUsers
                            onClose={() => setIsModalOpen(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default DSUsers;