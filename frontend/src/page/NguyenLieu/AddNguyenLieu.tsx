import React from 'react';
import { Button, Form, Input, Card, Space, message } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons'; 

interface NguyenLieu {
    ten: string;
    donvi?: string; 
}

const AddNguyenLieu: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: NguyenLieu) => {
        console.log('Thông tin nguyên liệu cần thêm:', values);
        // Ở đây sẽ gọi API để thêm nguyên liệu vào database
        message.success(`Đã thêm nguyên liệu: ${values.ten}`);
        form.resetFields(); 
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card 
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm nguyên liệu</h2>} 
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
                name="addNguyenLieuForm"
                layout="vertical" 
                onFinish={onFinish} 
                onFinishFailed={onFinishFailed} 
                autoComplete="off"
            >
                {/* Trường Tên */}
                <Form.Item
                    label="Tên nguyên liệu"
                    name="ten"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu!' }]} 
                >
                    <Input placeholder="Nhập tên nguyên liệu" />
                </Form.Item>

                {/* Trường Đơn vị */}
                <Form.Item
                    label="Đơn vị tính"
                    name="don_vi"
                >
                    <Input.TextArea placeholder="Nhập đơn vị đo lường (lit,g,kg...) " autoSize={{ minRows: 2, maxRows: 6 }} />
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

export default AddNguyenLieu;