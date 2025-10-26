/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Form, Input, Card, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { NhaCungCap } from '../../component/interface';
import axios from 'axios';

interface AddNhaCungCapProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/nhacungcap';
const AddNhaCungCap: React.FC<AddNhaCungCapProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const onFinish = async (values: NhaCungCap) => {
        setLoading(true);
        try {
            // Chuẩn bị payload để gửi lên backend
            const payload = {
                ...values,
                // Mặc định công thức là mảng rỗng khi thêm mới
                cong_thuc: [
                ]
            };

            // GỌI API create: POST http://localhost:7000/api/NhaCungCap/create
            const response = await axios.post(`${API_BASE_URL}/create`, payload);

            if (response.data.success) {
                message.success(`Đã thêm người dùng thành công.`);
                form.resetFields();
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi thêm người dùng.');
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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Nhà Cung Cấp</h2>}
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
                onFinish={onFinish as (values: any) => void}
                autoComplete="off"
            >
                {/* Trường Tên nhà cung cấp */}
                <Form.Item
                    label="Tên nhà cung cấp"
                    name="ten_ncc"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}
                >
                    <Input placeholder="Nhập tên nhà cung cấp" />
                </Form.Item>

                {/* Trường Địa chỉ */}
                <Form.Item
                    label="Địa chỉ"
                    name="dia_chi"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhà cung cấp!' }]}

                >
                    <Input placeholder="Nhập địa chỉ nhà cung cấp" />
                </Form.Item>

                {/* Trường SDT */}
                <Form.Item
                    label="Số điện thoại"
                    name="so_dien_thoai"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại nhà cung cấp!' }]}

                >
                    <Input placeholder="Nhập số điện thoại nhà cung cấp" />
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

export default AddNhaCungCap;