import React, { useState } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface LoaiSanPham {
    ten_loai: string;
    mo_ta?: string;
}
interface AddLoaiSanPhamProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/loaisanpham';

const AddLoaiSanPham: React.FC<AddLoaiSanPhamProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoaiSanPham) => {
        setLoading(true);
        try {
            // GỌI API create: POST http://localhost:7000/api/loaisanpham/create
            const response = await axios.post(`${API_BASE_URL}/create`);

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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Loại Sản Phẩm</h2>}
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
                onFinish={onFinish as (values: any) => void}
                autoComplete="off"
            >
                {/* Trường Tên loại */}
                <Form.Item
                    label="Tên loại"
                    name="ten_loai"
                    rules={[{ required: true, message: 'Vui lòng nhập tên loại sản phẩm!' }]}
                >
                    <Input placeholder="Nhập tên loại sản phẩm" />
                </Form.Item>

                {/* Trường Mô tả */}
                <Form.Item
                    label="Mô tả"
                    name="mo_ta"
                >
                    <Input.TextArea placeholder="Nhập mô tả (không bắt buộc)" autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>

                {/* Nút Thêm */}
                <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={<PlusOutlined />}
                        loading={loading}
                        style={{ width: '100%', maxWidth: 300 }}
                    >
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddLoaiSanPham;