import React from 'react';
import { Button, Form, Input, Card, Space, message } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons'; 

interface LoaiSanPham {
    tenLoai: string;
    moTa?: string; 
}

const AddLoaiSanPham: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: LoaiSanPham) => {
        console.log('Thông tin loại sản phẩm cần thêm:', values);
        // Ở đây sẽ gọi API để thêm loại sản phẩm vào database
        message.success(`Đã thêm loại sản phẩm: ${values.tenLoai}`);
        form.resetFields(); 
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card 
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm loại sản phẩm</h2>} 
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
                name="addLoaiSanPhamForm"
                layout="vertical" 
                onFinish={onFinish} 
                onFinishFailed={onFinishFailed} 
                autoComplete="off"
            >
                {/* Trường Tên loại */}
                <Form.Item
                    label="Tên loại"
                    name="tenLoai"
                    rules={[{ required: true, message: 'Vui lòng nhập tên loại sản phẩm!' }]} 
                >
                    <Input placeholder="Nhập tên loại sản phẩm" />
                </Form.Item>

                {/* Trường Mô tả */}
                <Form.Item
                    label="Mô tả"
                    name="moTa"
                >
                    <Input.TextArea placeholder="Nhập mô tả (không bắt buộc)" autoSize={{ minRows: 2, maxRows: 6 }} />
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

export default AddLoaiSanPham;