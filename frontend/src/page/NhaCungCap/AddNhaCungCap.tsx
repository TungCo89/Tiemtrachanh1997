import React from 'react';
import { Button, Form, Input, Card, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface NhaCungCap {
    id: number;
    tenNhaCungCap: string;
    diaChi: string;
    soDienThoai: number;
}

const AddNhaCungCap: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: NhaCungCap) => {
        console.log('Thông tin cần thêm:', values);
        // Ở đây sẽ gọi API để thêm vào database
        message.success(`Đã thêm: ${values.tenNhaCungCap}`);
        form.resetFields();
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm</h2>}
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
                name="addNhaCungCapForm"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {/* Trường Tên nhà cung cấp */}
                <Form.Item
                    label="Tên nhà cung cấp"
                    name="tenNhaCungCap"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input placeholder="Nhập tên" />
                </Form.Item>

                {/* Trường Địa chỉ */}
                <Form.Item
                    label="Địa chỉ"
                    name="diaChi"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}

                >
                    <Input placeholder="Nhập địa chỉ" />
                </Form.Item>

                {/* Trường SDT */}
                <Form.Item
                    label="Số điện thoại"
                    name="soDienThoai"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}

                >
                    <Input placeholder="Nhập số điện thoại" />
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

export default AddNhaCungCap;