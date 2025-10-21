import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, Select, message, Spin, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { User } from '../../component/interface';
import axios from 'axios';
const { Option } = Select;
const { List } = Form;
interface UsersFormValues {
    id: number;
    tenDangNhap: string;
    matKhau: string;
    hoTen: string;
    email: string;
    soDienThoai: string;
    tenVaiTro: string;
}
interface UserUpdateValues {
    ten_dang_nhap: string;
    mat_khau: string;
    email: string;
    ho_ten: string;
    so_dien_thoai: string;
    ten_vai_tro: string;
}
interface UpdateUsersProps {
    id: number;
    initialData: User | null;
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/user';


// Thay đổi định kiểu component
const UpdateUsers: React.FC<UpdateUsersProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                id: initialData.id,
                ten_dang_nhap: initialData.ten_dang_nhap,
                mat_khau: parseFloat(initialData.mat_khau),
                email: initialData.email,
                ho_ten: initialData.ho_ten,
                so_dien_thoai: initialData.so_dien_thoai,
                ten_vai_tro: initialData.ten_vai_tro

            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData]);

    const onFinish = async (values: UsersFormValues) => { 
        setLoading(true);
        try {
            const payload: UserUpdateValues = {
                ten_dang_nhap: values.tenDangNhap,
                mat_khau: values.matKhau,
                ho_ten: values.hoTen,
                email: values.email,
                so_dien_thoai: values.soDienThoai,
                ten_vai_tro: values.tenVaiTro,
            };
            const response = await axios.put(`${API_BASE_URL}/update?id=${id}`, payload);
            if (response.data.success) {
                message.success(`Đã cập nhật người dùng ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật người dùng.');
            }
        } catch (error) {
            console.error('Lỗi API Update:', error);
            message.error('Lỗi kết nối máy chủ hoặc dữ liệu không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    if (loading || !initialData) {
        return (
            <div style={{ padding: 20, textAlign: 'center' }}>
                <Spin tip="Đang tải dữ liệu người dùng..." />
            </div>
        );
    }

    //
    useEffect(() => {
        const fetchUsersData = async () => {
            setLoading(true);
            // GỌI API để lấy dữ liệu chi tiết của id
            // await UsersService.getByID(id);
            const mockData = {
                tenDangNhap: `Tên đăng nhập Cũ ID ${id}`,
                matKhau: `Mật khẩu cũ ID ${id}`,
                hoTen: `Họ và tên cũ ID ${id}`,
                email: `Email đăng nhập Cũ ID ${id}`,
                soDienThoai: `SDT Cũ ID ${id}`,
                tenVaiTro: `Vai trò Cũ ID ${id}`,
            };

            form.setFieldsValue(mockData);
            setLoading(false);
        };

        if (id) {
            fetchUsersData();
        }
    }, [form, id]);


    return (
        <div style={{ padding: 20 }}>
            <Form
                form={form}
                name="updateUserForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                onFinishFailed={onFinishFailed}
                initialValues={{ cong_thuc: [{}] }}

                autoComplete="off"
            >

                <Form.Item
                    label="Tên người dùng"
                    name="ten_san_pham"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                >
                    <Input placeholder="Nhập tên người dùng" />
                </Form.Item>

                <Form.Item
                    label="Giá bán"
                    name="gia_ban"
                    rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                >
                    <InputNumber min={1} placeholder="Giá bán" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="mo_ta"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input placeholder="Nhập mô tả" />

                </Form.Item>
                <h3 style={{ marginTop: 20 }}>Công thức</h3>
                <List
                    name="cong_thuc"
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'idNguyenLieu']}
                                        fieldKey={[fieldKey as number, 'idNguyenLieu']} rules={[{ required: true, message: 'Chọn NL' }]}
                                        style={{ width: 150 }}
                                    >
                                        <Select placeholder="Nguyên liệu">
                                            <Option value={1}>Trà đen</Option>
                                            <Option value={2}>Chanh</Option>
                                            <Option value={3}>Đường</Option>
                                            <Option value={4}>Đào</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'soLuong']}
                                        fieldKey={[fieldKey as number, 'soLuong']}
                                        rules={[{ required: true, message: 'SL' }]}
                                        style={{ width: 120 }}
                                    >
                                        <InputNumber min={1} placeholder="SL" />
                                    </Form.Item>

                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    ) : null}
                                </Space>
                            ))}

                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm Nguyên liệu
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </List>


                <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={loading}
                        style={{ width: '100%', maxWidth: 300 }}
                    >
                        Lưu Thay Đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateUsers;