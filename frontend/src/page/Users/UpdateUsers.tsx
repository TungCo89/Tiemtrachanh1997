import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Select, message, Spin, InputNumber } from 'antd';
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

                {/* Trường Tên đăng nhập */}
                <Form.Item
                    label="Tên đăng nhập"
                    name="tenDangNhap"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                        { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự.' }
                    ]}
                >
                    <Input placeholder="admin, nv_lam,..." />
                </Form.Item>
                {/* Trường Mật khẩu */}
                <Form.Item
                    label="Mật khẩu"
                    name="matKhau"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Mật khẩu!' },
                        { min: 1, message: 'Mật khẩu phải có ít nhất 1 ký tự.' }
                    ]}
                >
                    <Input placeholder="6666888,11111111" />
                </Form.Item>

                {/* Trường Họ tên */}
                <Form.Item
                    label="Họ và Tên"
                    name="hoTen"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input placeholder="Nguyễn Văn A" />
                </Form.Item>

                {/* Trường Email */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Email!' },
                        { type: 'email', message: 'Email không đúng định dạng!' }
                    ]}
                >
                    <Input placeholder="user@example.com" />
                </Form.Item>

                {/* Trường Số điện thoại */}
                <Form.Item
                    label="Số điện thoại"
                    name="soDienThoai"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ.' }
                    ]}
                >
                    <Input placeholder="09xxxxxxxx" maxLength={11} />
                </Form.Item>

                {/* Trường Vai trò */}
                <Form.Item
                    label="Vai trò"
                    name="tenVaiTro"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Select placeholder="Chọn vai trò người dùng">
                        {/* Dữ liệu các vai trò thường được fetch từ API */}
                        <Option value="Quản trị viên">Quản trị viên</Option>
                        <Option value="Nhân viên">Nhân viên</Option>
                        <Option value="Khách hàng">Khách hàng</Option>
                    </Select>
                </Form.Item>

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