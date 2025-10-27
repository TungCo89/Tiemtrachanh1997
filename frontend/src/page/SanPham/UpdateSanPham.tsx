import React, { useEffect, useState } from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Form, Input, Space, message, Select, InputNumber, Spin } from 'antd';
import { PlusOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { SanPham } from '../../component/interface';
import axios from 'axios';

const { Option } = Select;
const { List } = Form;

interface SanPhamUpdateValues {
    ten_san_pham: string;
    gia_ban: number;
    mo_ta: string;
    id_loai: number;
    cong_thuc: {
        idNguyenLieu: number;
        ten_nguyen_lieu: string;
        don_vi: string;
        so_luong: number;
    }[];
}

interface UpdateSanPhamProps {
    id: number;
    initialData: SanPham | null;
    onClose: () => void;
    onSuccess: () => void;
}

const API_BASE_URL = 'http://localhost:7000/api/sanpham';

const mockLoaiSanPham = [
    { id: 1, ten_loai: 'Trà Sữa' },
    { id: 2, ten_loai: 'Coffee' },
    { id: 3, ten_loai: 'Đồ Ăn Vặt' },
];

const UpdateSanPham: React.FC<UpdateSanPhamProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);
            form.setFieldsValue({
                id_loai: initialData.id_loai,
                ten_san_pham: initialData.ten_san_pham,
                gia_ban: parseFloat(initialData.gia_ban),
                mo_ta: initialData.mo_ta,
                cong_thuc: initialData.cong_thuc.map(ct => ({
                    ten_nguyen_lieu: ct.ten_nguyen_lieu,
                    so_luong: parseFloat(ct.so_luong),
                    don_vi: ct.don_vi,
                }))

            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData]);

    const onFinish = async (values: SanPhamUpdateValues) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                cong_thuc: initialData?.cong_thuc.map(ct => ({
                    id_nguyen_lieu: ct.id_nguyen_lieu,
                    so_luong: parseFloat(ct.so_luong),
                })) || []
            };

            const response = await axios.put(`${API_BASE_URL}/update?id=${id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật sản phẩm ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật sản phẩm.');
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
                <Spin tip="Đang tải dữ liệu sản phẩm..." />
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <Form
                form={form}
                name="updateSanPhamForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                onFinishFailed={onFinishFailed}
                initialValues={{ cong_thuc: [{}] }}
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
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'ten_nguyen_lieu']}
                                        fieldKey={[fieldKey as number, 'ten_nguyen_lieu']} rules={[{ required: true, message: 'Chọn Nguyên Liệu' }]}
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
                                        name={[name, 'so_luong']}
                                        fieldKey={[fieldKey as number, 'so_luong']}
                                        rules={[{ required: true, message: 'Chọn số lượng' }]}
                                    >
                                        <InputNumber min={0.01} placeholder="SL" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'don_vi']}
                                        fieldKey={[fieldKey as number, 'don_vi']}
                                        style={{ width: 50}}
                                    >
                                        <Input placeholder="Đơn vị" readOnly />
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

export default UpdateSanPham;