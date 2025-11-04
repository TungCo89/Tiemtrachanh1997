import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Link } = Typography;

interface Data {
    email: string;
    mat_khau: string;
}

interface UserData {
    id: number;
    ten_dang_nhap: string;
    ho_ten: string;
    email: string;
    so_dien_thoai: string;
    ten_vai_tro: string;
    id_vai_tro: number;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data?: UserData;
}

const API_LOGIN_URL = 'http://localhost:7000/api/user/login';

const DangNhap: React.FC = () => {
    const [form] = Form.useForm<Data>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const saveUserData = (userData: UserData) => {
        try {
            localStorage.setItem('userInfo', JSON.stringify(userData));
            console.log('Đã lưu thông tin người dùng vào Local Storage:', userData);
        } catch (error) {
            console.error('Lỗi khi lưu vào Local Storage:', error);
            message.error('Lưu thông tin đăng nhập cục bộ thất bại.');
        }
    };

    const onFinish = async (values: Data) => {
        setIsSubmitting(true);

        const payload: Data = {
            email: values.email,
            mat_khau: values.mat_khau,
        };

        try {
            const response = await axios.post<ApiResponse>(`${API_LOGIN_URL}`, payload);

            if (response.data.success && response.data.data) {
                const userData = response.data.data;

                saveUserData(userData);

                message.success(`Đăng nhập thành công! Chào mừng ${userData.ho_ten}.`);
                form.resetFields();
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 2000);

            } else {
                message.error(response.data.message || 'Email hoặc mật khẩu không đúng.');
            }
        } catch (error) {
            console.error('Lỗi API Đăng nhập:', error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                message.error('Sai email hoặc mật khẩu. Vui lòng thử lại.');
            } else {
                message.error('Lỗi kết nối máy chủ hoặc lỗi không xác định.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f0f2f5 0%, #bae7ff 100%)',
        }}>

            <div style={{
                maxWidth: '400px',
                width: '100%',
                padding: '40px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
            }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Đăng Nhập
                </Title>

                <Form
                    form={form}
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email của bạn!' },
                            { type: 'email', message: 'Email không đúng định dạng!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Nhập email"
                            disabled={isSubmitting}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="mat_khau"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Mật khẩu!' },
                            { min: 1, message: 'Mật khẩu phải có ít nhất 1 ký tự.' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                            disabled={isSubmitting}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Row justify="space-between">
                            <Col>
                                Chưa có tài khoản? <Link href="/dangky" strong>Đăng ký</Link>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item style={{ marginTop: '20px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            style={{ width: '100%', height: '45px', fontSize: '16px' }}
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default DangNhap;