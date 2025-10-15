import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

interface LoaiSanPhamFormValues {
    tenLoai: string;
    moTa?: string;
}
interface UpdateLoaiSanPhamProps {
    id: number;
    onCancel: () => void;
}

// Thay đổi định kiểu component
const UpdateLoaiSanPham: React.FC<UpdateLoaiSanPhamProps> = ({ id, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoaiSanPhamData = async () => {
            setLoading(true);
            // GỌI API để lấy dữ liệu chi tiết của id
            // await loaiSanPhamService.getByID(id);
            const mockData = {
                tenLoai: `Tên Loại Cũ ID ${id}`,
                moTa: `Mô tả cũ ID ${id}`
            };

            form.setFieldsValue(mockData);
            setLoading(false);
        };

        if (id) {
            fetchLoaiSanPhamData();
        }
    }, [form, id]);

    const onFinish = (values: LoaiSanPhamFormValues) => {
        // GỌI API update: loaiSanPhamService.updateLoaiSanPham(loaiSanPhamId, values);
        message.success(`Đã cập nhật Loại sản phẩm ID ${id}`);
        onCancel(); // Đóng modal sau khi cập nhật thành công
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật loại sản phẩm</h2>}
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
                    name="updateLoaiSanPhamForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    {/* Trường Tên loại */}
                    <Form.Item
                        label="Tên loại"
                        name="tenLoai"
                        rules={[{ required: true, message: 'Vui lòng nhập tên loại sản phẩm!' }]}
                    >
                        <Input placeholder="Nhập tên loại sản phẩm" />
                    </Form.Item>

                    {/* Trường Mô tả */}
                    <Form.Item
                        label="Mô tả"
                        name="moTa"
                    >
                        <Input.TextArea placeholder="Nhập mô tả (không bắt buộc)" autoSize={{ minRows: 2, maxRows: 6 }} />
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

export default UpdateLoaiSanPham;