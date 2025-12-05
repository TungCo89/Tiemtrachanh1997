import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Row, Col } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Link } = Typography;

interface Data {
    ten_dang_nhap: string;
    mat_khau: string;
    ho_ten: string;
    email: string;
    so_dien_thoai: string;
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

const API_SIGNUP_URL = 'http://localhost:7000/api/user/signup';

const DangKy: React.FC = () => {
    const [form] = Form.useForm<Data>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const onFinish = async (values: Data) => {
        setIsSubmitting(true);

        const payload: Data = {
            ten_dang_nhap: values.ten_dang_nhap,
            mat_khau: values.mat_khau,
            ho_ten: values.ho_ten,
            email: values.email,
            so_dien_thoai: values.so_dien_thoai,
        };

        try {
            const response = await axios.post<ApiResponse>(`${API_SIGNUP_URL}`, payload);

            if (response.data.success) {
                const tenNguoiDung = response.data.data?.ho_ten || 'bạn';
                message.success(`Đăng ký thành công! Chào mừng ${tenNguoiDung}. Đang chuyển hướng đến trang Đăng nhập...`);
                
                form.resetFields();
                
                setTimeout(() => {
                    window.location.href = '/dangnhap';
                }, 1000);

            } else {
                message.error(response.data.message || 'Lỗi đăng ký không xác định.');
            }
        } catch (error) {
            console.error('Lỗi API Đăng ký:', error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message.error(error.response.data.message);
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
                    Đăng ký tài khoản
                </Title>

                <Form
                    form={form}
                    name="signup_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="ten_dang_nhap"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Tên đăng nhập!' },
                            { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự.' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nhập tên đăng nhập"
                            disabled={isSubmitting}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Họ và tên"
                        name="ho_ten"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Họ và tên của bạn!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nhập họ và tên"
                            disabled={isSubmitting}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email!' },
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
                        label="Số điện thoại"
                        name="so_dien_thoai"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Số điện thoại!' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 chữ số).' }
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Nhập số điện thoại"
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
                                Đã có tài khoản? <Link href="/dangnhap" strong>Đăng nhập</Link>
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
                            Đăng Ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default DangKy;