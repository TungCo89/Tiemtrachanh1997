/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Select, Card, message, Spin } from 'antd';
import axios from 'axios';
import { Ban } from '../../component/interface';

const { Option } = Select;

interface UpdateBanProps {
    id: number;
    initialData: Ban | null;
    onClose: () => void;
    onSuccess: () => void;
}

interface BanFormValues {
    tenBan: string;
    idKhuVuc: number;
}

const UpdateBan: React.FC<UpdateBanProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    // Cập nhật form khi có initialData
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                tenBan: initialData.ten_ban,
                idKhuVuc: initialData.id_khu_vuc,
            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [initialData, form]);

    const onFinish = async (values: BanFormValues) => {
        setLoading(true);
        try {
            const payload = {
                ten_ban: values.tenBan,
                id_khu_vuc: values.idKhuVuc,
            };

            const response = await axios.put(`http://localhost:7000/api/ban/update?id=${id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật bàn ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật bàn.');
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
                        <Button onClick={onClose}>
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