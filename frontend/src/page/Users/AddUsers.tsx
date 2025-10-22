import React, { useState } from 'react';
import { Button, Form, Input, Card, Select, message } from 'antd';
import axios from 'axios';
const { Option } = Select; 
interface Users {
    id: number;
    tenDangNhap: string;
    matKhau :string;
    hoTen: string;
    email: string;
    soDienThoai: string;
    tenVaiTro: string;
}
interface AddUserProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/user';


const AddUsers: React.FC<AddUserProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
        const [loading, setLoading] = useState(false);
        const onFinish = async (values: Users) => {
        setLoading(true);
        try {
            // Chuẩn bị payload để gửi lên backend
            const payload = {
                ...values,
                // Mặc định công thức là mảng rỗng khi thêm mới, hoặc bạn cần thêm Form.List để nhập công thức
                cong_thuc: [
                ]
            };

            // GỌI API create: POST http://localhost:7000/api/User/create
            const response = await axios.post(`${API_BASE_URL}/create`, payload);

            if (response.data.success) {
                message.success(`Đã thêm sản phẩm thành công.`);
                form.resetFields();
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi thêm sản phẩm.');
            }
        } catch (error) {
            console.error('Lỗi API Create:', error);
            message.error('Lỗi kết nối máy chủ hoặc dữ liệu không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm người dùng</h2>}
            bordered={false}
            style={{
                maxWidth: 600,
                margin: '50px auto',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: 8,
            }}
        >
            <Form
                form={form}
                name="addUsersForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
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

                {/* Nút Thêm */}
                <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{
                            width: '100%',
                            maxWidth: 300,
                            backgroundColor: '#d9d9d9',
                            borderColor: '#d9d9d9',
                            color: '#000',
                        }}
                    >
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddUsers;