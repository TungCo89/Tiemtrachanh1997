// src/pages/UpdateBan.tsx

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Select, Card, message, Spin } from 'antd'; 
// ... các imports khác

// 1. Định nghĩa Interface cho Props của UpdateBan
interface UpdateBanProps {
    id: number;           // ID của bàn cần cập nhật
    onCancel: () => void; // Hàm đóng modal
}

// Định nghĩa kiểu dữ liệu cho form (giống AddBan)
interface BanFormValues {
    tenBan: string;
    idKhuVuc: number;
    // ... các trường khác
}

// 2. Sử dụng Interface Props trong component
// PHẢI dùng React.FC<UpdateBanProps> và destructing { id, onCancel }
const UpdateBan: React.FC<UpdateBanProps> = ({ id, onCancel }) => { 
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    // Dùng useEffect để tải dữ liệu dựa trên 'id'
    useEffect(() => {
        const fetchBanData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // GIẢ LẬP TẢI DỮ LIỆU CŨ TỪ API (dùng 'id' để fetch)
            const mockInitialData: BanFormValues = {
                tenBan: `Bàn ${id} (Cũ)`,
                idKhuVuc: id % 2 === 0 ? 2 : 1, // Logic ví dụ
            };
            
            form.setFieldsValue(mockInitialData);
            setLoading(false);
        };
        
        fetchBanData();
    }, [form, id]); // Đảm bảo useEffect chạy lại khi ID thay đổi

    const onFinish = (values: BanFormValues) => {
        console.log(`Thông tin bàn ID ${id} cần cập nhật:`, values);
        
        // 🚨 Sau khi gọi API UPDATE thành công:
        message.success(`Đã cập nhật Bàn ID: ${id}`);
        onCancel(); // 👈 Đóng Modal
    };

    return (
        <Spin spinning={loading} tip="Đang tải dữ liệu bàn...">
            <Card 
                title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật Bàn ID: {id}</h2>}
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
                                Lưu Thay Đổi
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </Spin>
    );
};

export default UpdateBan;