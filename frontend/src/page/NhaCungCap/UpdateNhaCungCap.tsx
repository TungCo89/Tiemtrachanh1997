import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import { NhaCungCap } from '../../component/interface';
const { Option } = Select;
const { List } = Form;
interface NhaCungCapUpdateValues {
    ten_ncc: string;
    dia_chi: string;
    so_dien_thoai: string;
}
interface UpdateNhaCungCapProps {
    id: number;
    initialData: NhaCungCap | null;
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/nhacungcap';


// Thay đổi định kiểu component
const UpdateNhaCungCap: React.FC<UpdateNhaCungCapProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (initialData) {
            console.log(initialData);
            form.setFieldsValue({
                id: initialData.id,
                ten_ncc: initialData.ten_ncc,
                dia_chi: initialData.dia_chi,
                so_dien_thoai: initialData.so_dien_thoai,
            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData]);

    const onFinish = async (values: NhaCungCapUpdateValues) => {
        setLoading(true);
        try {
            const payload: NhaCungCapUpdateValues = {
                ten_ncc: values.ten_ncc,
                dia_chi: values.dia_chi,
                so_dien_thoai: values.so_dien_thoai,
            };
            const response = await axios.put(`${API_BASE_URL}/update?id=${id}`, payload);
            if (response.data.success) {
                message.success(`Đã cập nhật nhà cung cấp ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật nhà cung cấp.');
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
                <Spin tip="Đang tải dữ liệu nhà cung cấp..." >
                    <div />
                </Spin>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <Form
                form={form}
                name="updateNhaCungCapForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}

                onFinishFailed={onFinishFailed}
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

                <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={<SaveOutlined />}
                        style={{
                            width: '100%',
                            maxWidth: 300,
                            backgroundColor: '#1890ff',
                            borderColor: '#1890ff',
                            color: '#fff',
                        }}
                    >
                        Lưu Thay Đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateNhaCungCap;