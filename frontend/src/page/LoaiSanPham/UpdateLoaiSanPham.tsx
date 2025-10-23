import React, { useEffect, useState } from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Form, Input, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { LoaiSanPham } from '../../component/interface';
import axios from 'axios';
interface LoaiSanPhamUpdateValues {
    ten_loai: string;
    mo_ta: string;
}
interface UpdateLoaiSanPhamProps {
    id: number;
    initialData: LoaiSanPham | null;
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/loaisanpham';

// Thay đổi định kiểu component
const UpdateLoaiSanPham: React.FC<UpdateLoaiSanPhamProps> = ({ id,  initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                id: initialData.id,
                ten_loai: initialData.ten_loai,
                mo_ta: initialData.mo_ta,

            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData]);

    const onFinish = async (values: LoaiSanPhamUpdateValues) => {
        setLoading(true);
        try {
            const payload : LoaiSanPhamUpdateValues={
                ten_loai: values.ten_loai,
                mo_ta: values.mo_ta,
            };

            const response = await axios.put(`${API_BASE_URL}/update?id=${id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật loại sản phẩm ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật loại sản phẩm.');
            }
        } catch (error) {
            console.error('Lỗi API Update:', error);
            message.error('Lỗi kết nối máy chủ hoặc dữ liệu không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    if (loading || !initialData) {
        return (
            <div style={{ padding: 20, textAlign: 'center' }}>
                <Spin tip="Đang tải dữ liệu loại sản phẩm..." />
            </div>
        );
    }
    return (
        <div style={{ padding: 20 }}>
            <Form
                form={form}
                name="updateLoaiSanPhamForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                    label="Tên danh mục"
                    name="ten_loai"
                    rules={[{ required: true, message: 'Vui lòng nhập tên loại sản phẩm!' }]}
                >
                    <Input placeholder="Nhập tên loại sản phẩm" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="mo_ta"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input placeholder="Nhập mô tả" />

                </Form.Item>

                <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={loading}
                        style={{ width: '100%', maxWidth: 300 }}
                    >
                        Lưu Thay Đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateLoaiSanPham;