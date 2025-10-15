import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

interface SanPhamFormValues {
    idLoai: number;
    ten: string;
    giaBan: number;
    moTa?: string;
}
interface UpdateSanPhamProps {
    id: number;
    onCancel: () => void;
}

// Thay đổi định kiểu component
const UpdateSanPham: React.FC<UpdateSanPhamProps> = ({ id, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSanPhamData = async () => {
            setLoading(true);
            // GỌI API để lấy dữ liệu chi tiết của id
            // await SanPhamService.getByID(id);
            const mockData = {
                idLoai: `ID loại Cũ ID ${id}`,
                ten: `Tên sản phẩm Cũ ID ${id}`,
                giaBan: `Giá sản phẩm Cũ ID ${id}`,
                moTa: `Mô tả cũ ID ${id}`
            };

            form.setFieldsValue(mockData);
            setLoading(false);
        };

        if (id) {
            fetchSanPhamData();
        }
    }, [form, id]);

    const onFinish = (values: SanPhamFormValues) => {
        // GỌI API update: SanPhamService.updateSanPham(SanPhamId, values);
        message.success(`Đã cập nhật sản phẩm ID ${id}`);
        onCancel(); // Đóng modal sau khi cập nhật thành công
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật sản phẩm</h2>}
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
                    name="updateSanPhamForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    {/* Trường id loại */}
                    <Form.Item
                        label="ID loại "
                        name="idLoai"
                        rules={[{ required: true, message: 'ID loại sản phẩm!' }]}
                    >
                        <Input placeholder="ID loại sản phẩm" />
                    </Form.Item>
                    {/* Trường Tên loại */}
                    <Form.Item
                        label="Tên "
                        name="ten"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                    {/* Trường Giá bán*/}
                    <Form.Item
                        label="Giá bán"
                        name="giaBan"
                    >
                        <Input.TextArea placeholder="Nhập giá bán" autoSize={{ minRows: 2, maxRows: 6 }} />
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

export default UpdateSanPham;