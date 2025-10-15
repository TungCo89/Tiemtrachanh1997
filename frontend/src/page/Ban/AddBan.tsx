import React from 'react';
import { Button, Form, Input, Space, Select, Card, message } from 'antd'; 

interface AddBanProps {
    onCancel: () => void; 
}

interface BanFormValues {
    tenBan: string;
    idKhuVuc: number;
}

const AddBan: React.FC<AddBanProps> = ({ onCancel }) => { // 👈 CHÚ Ý: nhận onCancel qua destructuring
    const [form] = Form.useForm();
    
    const onFinish = (values: BanFormValues) => {
        console.log('Thông tin bàn cần thêm:', values);
        
        message.success(`Đã thêm bàn: ${values.tenBan}`);
        onCancel();
        form.resetFields();
    };

    return (
        <Card 
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Bàn</h2>} 
        >
            <Form
                form={form} 
                layout="vertical" 
                onFinish={onFinish} 
            >
                <Form.Item label="Tên Bàn" name="tenBan" rules={[{ required: true, message: 'Vui lòng nhập tên bàn!' }]}>
                    <Input placeholder="Ví dụ: Bàn 17" />
                </Form.Item>
                
                <Form.Item label="Khu vực" name="idKhuVuc" rules={[{ required: true, message: 'Vui lòng chọn khu vực!' }]}>
                    <Select placeholder="Chọn khu vực">
                        <Select.Option value={1}>Khu A</Select.Option>
                        <Select.Option value={2}>Khu B</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginTop: 30 }}>
                    <Space>
                        <Button onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                        >
                            Thêm
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddBan;