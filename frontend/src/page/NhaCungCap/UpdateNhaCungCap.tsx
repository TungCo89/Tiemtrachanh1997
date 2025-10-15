import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

interface NhaCungCap {
    id: number;
    tenNhaCungCap: string;
    diaChi: string;
    soDienThoai: number;
}

interface UpdateNhaCungCapProps {
    id: number;
    onCancel: () => void;
}

// Thay đổi định kiểu component
const UpdateNhaCungCap: React.FC<UpdateNhaCungCapProps> = ({ id, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNhaCungCapData = async () => {
            setLoading(true);
            // GỌI API để lấy dữ liệu chi tiết của id
            // await NhaCungCapService.getByID(id);
            const mockData = {
                tenNhaCungCap: `Tên NCC Cũ ID ${id}`,
                diaChi: `Địa chỉ cũ ID ${id}`,
                soDienThoai: `SDT cũ ID ${id}`

            };

            form.setFieldsValue(mockData);
            setLoading(false);
        };

        if (id) {
            fetchNhaCungCapData();
        }
    }, [form, id]);

    const onFinish = (values: NhaCungCap) => {
        // GỌI API update: NhaCungCapService.updateNhaCungCap(NhaCungCapId, values);
        message.success(`Đã cập nhật nhà cung cấp ID ${id}`);
        onCancel(); // Đóng modal sau khi cập nhật thành công
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật nhà cung cấp</h2>}
            bordered={false}
            style={{
                maxWidth: 600,
                margin: '50px auto',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: 8,
            }}
        >
            <Spin spinning={loading} tip="Đang tải dữ liệu...">
                <Form
                    form={form}
                    name="updateNhaCungCapForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    {/* Trường Tên nhà cung cấp */}
                    <Form.Item
                        label="Tên nhà cung cấp"
                        name="tenNhaCungCap"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên" />
                    </Form.Item>

                    {/* Trường Địa chỉ */}
                    <Form.Item
                        label="Địa chỉ"
                        name="diaChi"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}

                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    {/* Trường SDT */}
                    <Form.Item
                        label="Số điện thoại"
                        name="soDienThoai"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}

                    >
                        <Input placeholder="Nhập số điện thoại" />
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
            </Spin>
        </Card>
    );
};

export default UpdateNhaCungCap;