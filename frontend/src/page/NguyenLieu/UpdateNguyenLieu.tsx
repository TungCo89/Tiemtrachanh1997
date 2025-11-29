/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import { NguyenLieu } from '../../component/interface';

interface NguyenLieuUpdateValues {
    ten_nguyen_lieu: string;
    don_vi: string;
    so_luong_ton: number;
}
interface UpdateNguyenLieuProps {
    id: number;
    initialData: NguyenLieu | null;
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/nguyenlieu';

// Thay đổi định kiểu component
const UpdateNguyenLieu: React.FC<UpdateNguyenLieuProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);
            form.setFieldsValue({
                id: initialData.id,
                ten_nguyen_lieu: initialData.ten_nguyen_lieu,
                don_vi: initialData.don_vi,
                so_luong_ton: initialData.so_luong_ton,
            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData]);

    const onFinish = async (values: NguyenLieuUpdateValues) => {
        setLoading(true);
        try {
            const payload: NguyenLieuUpdateValues = {
                ten_nguyen_lieu: values.ten_nguyen_lieu,
                don_vi: values.don_vi,
                so_luong_ton: values.so_luong_ton
            };

            const response = await axios.put(`${API_BASE_URL}/update?id=${id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật nguyên liệu ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật nguyên liệu.');
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
                <Spin />
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <Form
                form={form}
                name=""
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                {/* Trường Tên */}
                <Form.Item
                    label="Tên nguyên liệu"
                    name="ten_nguyen_lieu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu!' }]}
                >
                    <Input placeholder="Nhập tên nguyên liệu" />
                </Form.Item>
                <Form.Item
                    label="Số lượng tồn"
                    name="so_luong_ton"
                    rules={[{ required: true, message: 'Chọn số lượng' }]}
                >
                    <InputNumber min={0.01} placeholder="SL" />
                </Form.Item>

                {/* Trường Đơn vị */}
                <Form.Item
                    label="Đơn vị tính"
                    name="don_vi"
                >
                    <Input.TextArea placeholder="Nhập đơn vị đo lường (lit,g,kg...) " autoSize={{ minRows: 2, maxRows: 6 }} />
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

export default UpdateNguyenLieu;