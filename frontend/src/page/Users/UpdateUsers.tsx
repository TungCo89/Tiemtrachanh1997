import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, Select, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
const { Option } = Select;
interface UsersFormValues {
    id: number;
    tenDangNhap: string;
    matKhau: string;
    hoTen: string;
    email: string;
    soDienThoai: string;
    tenVaiTro: string;
}
interface UpdateUsersProps {
    id: number;
    onCancel: () => void;
}

// Thay đổi định kiểu component
const UpdateUsers: React.FC<UpdateUsersProps> = ({ id, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

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

    const onFinish = (values: UsersFormValues) => {
        // GỌI API update: UsersService.updateUsers(UsersId, values);
        message.success(`Đã cập nhật người dùng ID ${id}`);
        onCancel(); // Đóng modal sau khi cập nhật thành công
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật người dùng</h2>}
            bordered={false}
            style={{
                maxWidth: 600,
                margin: '50px auto',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: 8,
            }}
        >
            <Spin spinning={loading} tip="Đang tải dữ liệu...">
                <Form
                    form={form}
                    name="updateUsersForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
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
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.' }
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
                            style={{
                                width: '100%',
                                maxWidth: 300,
                                backgroundColor: '#1890ff',
                                borderColor: '#1890ff',
                                color: '#fff',
                            }}
                        >
                            Lưu Thay Đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default UpdateUsers;