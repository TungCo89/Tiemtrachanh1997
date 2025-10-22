import React, { useState } from 'react';
import { Button, Form, Input, Card, Space, message, Select, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { SanPham } from '../../component/interface';
import axios from 'axios';
const { Option } = Select;
const { List } = Form;

interface AddSanPhamProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/sanpham';

const mockLoaiSanPham = [
    { id: 1, ten_loai: 'Trà Sữa' },
    { id: 2, ten_loai: 'Coffee' },
    { id: 3, ten_loai: 'Đồ Ăn Vặt' },
];

const AddSanPham: React.FC<AddSanPhamProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const onFinish = async (values: SanPham) => {
        setLoading(true);
        try {
            // Chuẩn bị payload để gửi lên backend
            const payload = {
                ...values,
                // Mặc định công thức là mảng rỗng khi thêm mới, hoặc bạn cần thêm Form.List để nhập công thức
                cong_thuc: [
                ]
            };

            // GỌI API create: POST http://localhost:7000/api/sanpham/create
            const response = await axios.post(`${API_BASE_URL}/create`, payload);

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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Sản Phẩm</h2>}
            bordered={false}
        >
            <Form
                form={form}
                name="AddSanPhamForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                autoComplete="off"
            >
                <Form.Item
                    label="Loại sản phẩm"
                    name="id_loai"
                    rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
                >
                    <Select placeholder="Chọn loại sản phẩm">
                        {mockLoaiSanPham.map(loai => (
                            <Select.Option key={loai.id} value={loai.id}>
                                {loai.ten_loai}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Tên sản phẩm"
                    name="ten_san_pham"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item
                    label="Giá bán"
                    name="gia_ban"
                    rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                >
                    <InputNumber min={1} placeholder="Giá bán" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="mo_ta"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input placeholder="Nhập mô tả" />

                </Form.Item>


                <h3 style={{ marginTop: 20 }}>Công thức</h3>
                <List
                    name="cong_thuc"
                    initialValue={[{}]}
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'idNguyenLieu']}
                                        fieldKey={[fieldKey as number, 'idNguyenLieu']} rules={[{ required: true, message: 'Chọn NL' }]}
                                        style={{ width: 150 }}
                                    >
                                        <Select placeholder="Nguyên liệu">
                                            <Option value={1}>Trà đen</Option>
                                            <Option value={2}>Chanh</Option>
                                            <Option value={3}>Đường</Option>
                                            <Option value={4}>Đào</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'soLuong']}
                                        fieldKey={[fieldKey as number, 'soLuong']}
                                        rules={[{ required: true, message: 'SL' }]}
                                        style={{ width: 120 }}
                                    >
                                        <InputNumber min={1} placeholder="SL" />
                                    </Form.Item>

                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    ) : null}
                                </Space>
                            ))}

                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm Nguyên liệu
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </List>

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
                        Thêm Sản Phẩm
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddSanPham;