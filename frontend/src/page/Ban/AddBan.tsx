import React, { useState } from 'react';
import { Button, Form, Input, Space, Select, Card, message } from 'antd'; 
import { Ban } from '../../component/interface';
import axios from 'axios';

interface AddBanProps {
    onCancel: () => void;
    onSuccess: () => void; 
}

interface BanFormValues {
    ten_ban: string;
    id_khu_vuc: number;
}

const API_BASE_URL = 'http://localhost:7000/api';

const AddBan: React.FC<AddBanProps> = ({ onCancel, onSuccess }) => { 
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    
    const onFinish = async (values: Ban) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
            };

            // GỌI API create: POST http://localhost:7000/api/ban/create
            const response = await axios.post(`${API_BASE_URL}/ban/create`, payload);
            if (response.data.success) {
                message.success(`Đã thêm bàn thành công.`);
                form.resetFields();
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi thêm bàn.');
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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Bàn</h2>} 
        >
            <Form
                form={form} 
                layout="vertical" 
                onFinish={onFinish} 
            >
                <Form.Item label="Tên Bàn" name="ten_ban" rules={[{ required: true, message: 'Vui lòng nhập tên bàn!' }]}>
                    <Input placeholder="Ví dụ: Bàn 17" />
                </Form.Item>
                
                <Form.Item label="Khu vực" name="id_khu_vuc" rules={[{ required: true, message: 'Vui lòng chọn khu vực!' }]}>
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