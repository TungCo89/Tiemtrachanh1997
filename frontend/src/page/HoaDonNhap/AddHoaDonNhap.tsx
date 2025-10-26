/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Form, Input, Card, Space, message, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'; // Cần MinusCircleOutlined cho danh sách
import { HoaDonNhap } from '../../component/interface';
import axios from 'axios';
const { Option } = Select;
const { List } = Form;
interface AddHoaDonNhapProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/hoadonnhap';

const AddHoaDonNhap: React.FC<AddHoaDonNhapProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const onFinish = async (values: HoaDonNhap) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
            };

            // GỌI API create: POST http://localhost:7000/api/hoadonnhap/create
            const response = await axios.post(`${API_BASE_URL}/create`, payload);

            if (response.data.success) {
                message.success(`Đã thêm hóa đơn nhập thành công.`);
                form.resetFields();
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi thêm hóa đơn nhập.');
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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Hóa đơn Nhập</h2>}
        >
            <Form
                form={form}
                name="addHoaDonNhapForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                autoComplete="off"
            >

                <Form.Item
                    label="Nhà cung cấp"
                    name="id_ncc"
                    rules={[{ required: true, message: 'Vui lòng chọn Nhà cung cấp!' }]}
                >
                    <Select placeholder="Chọn Nhà cung cấp">
                        <Option value={1}>Công ty Trà Xanh (ID: 1)</Option>
                        <Option value={2}>Kho Nguyên Liệu Tổng Hợp (ID: 2)</Option>
                        <Option value={3}>Bách hóa Xanh (ID: 3)</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Ngày nhập"
                    name="ngay_nhap"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày nhập!' }]}
                >
                    <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="ghi_chu"
                    rules={[{ required: true, message: 'Ghi chú hóa đơn!' }]}
                >
                    <Input placeholder="Nhập ghi chú" />
                </Form.Item>


                <h3 style={{ marginTop: 20 }}>Chi tiết Nguyên liệu</h3>
                <List
                    name="chi_tiet"
                    initialValue={[{}]}
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'id_nguyen_lieu']}
                                        fieldKey={[fieldKey as number, 'id_nguyen_lieu']} rules={[{ required: true, message: 'Chọn NL' }]}
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
                                        fieldKey={[fieldKey as number, 'soLuong']}
                                        rules={[{ required: true, message: 'SL' }]}
                                        style={{ width: 80 }}
                                    >
                                        <InputNumber min={1} placeholder="SL" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'don_gia']}
                                        fieldKey={[fieldKey as number, 'don_gia']}
                                        rules={[{ required: true, message: 'Đơn giá' }]}
                                        style={{ width: 120 }}
                                    >
                                        <InputNumber
                                            min={100}
                                            step={1}
                                            parser={value => Number(value!.replace(/\$\s?|(,*)/g, ''))}
                                            placeholder="Đơn giá"
                                        />
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
                        Thêm Hóa Đơn
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddHoaDonNhap;