import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

interface NguyenLieuFormValues {
    ten: string;
    donvi?: string;
}
interface UpdateNguyenLieuProps {
    id: number;
    onCancel: () => void;
}

// Thay đổi định kiểu component
const UpdateNguyenLieu: React.FC<UpdateNguyenLieuProps> = ({ id, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNguyenLieuData = async () => {
            setLoading(true);
            // GỌI API để lấy dữ liệu chi tiết của id
            // await NguyenLieuService.getByID(id);
            const mockData = {
                ten: `Tên Cũ ID ${id}`,
                donvi: `Đơn vị cũ ID ${id}`
            };

            form.setFieldsValue(mockData);
            setLoading(false);
        };

        if (id) {
            fetchNguyenLieuData();
        }
    }, [form, id]);

    const onFinish = (values: NguyenLieuFormValues) => {
        // GỌI API update: NguyenLieuService.updateNguyenLieu(NguyenLieuId, values);
        message.success(`Đã cập nhật nguyên liệu ID ${id}`);
        onCancel(); // Đóng modal sau khi cập nhật thành công
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật nguyên liệu</h2>}
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
                    name="updateNguyenLieuForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >
                    {/* Trường Tên */}
                    <Form.Item
                        label="Tên nguyên liệu"
                        name="ten"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu!' }]}
                    >
                        <Input placeholder="Nhập tên nguyên liệu" />
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

export default UpdateNguyenLieu;