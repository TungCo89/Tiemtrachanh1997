/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Form, Input, Card, Space, message, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { HoaDonBan } from '../../component/interface';
import axios from 'axios';

const { Option } = Select;
const { List } = Form;

interface AddHoaDonBanProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/hoadonban';


const AddHoaDonBan: React.FC<AddHoaDonBanProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const onFinish = async (values: HoaDonBan) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
            };

            // GỌI API create: POST http://localhost:7000/api/hoadonban/create
            const response = await axios.post(`${API_BASE_URL}/create`, payload);

            if (response.data.success) {
                message.success(`Đã thêm hóa đơn bán thành công.`);
                form.resetFields();
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi thêm hóa đơn bán.');
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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Hóa đơn Bán</h2>}
        >
            <Form
                form={form}
                name="addHoaDonBanForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                autoComplete="off"
                initialValues={{ chiTiet: [{}] }} 
            >

                {/* -------------------- 1. THÔNG TIN CHUNG (HEADER) -------------------- */}
                <Form.Item
                    label="Bàn"
                    name="id_ban"
                    rules={[{ required: true, message: 'Vui lòng chọn Bàn!' }]}
                >
                    <Select placeholder="Chọn Bàn">
                        {/* Dữ liệu Bàn (ví dụ) */}
                        <Option value={1}>Bàn 1</Option>
                        <Option value={2}>Bàn 2</Option>
                        <Option value={3}>Bàn 3</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Ngày lập"
                    name="ngay_lap"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày lập!' }]}
                >
                    <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
                </Form.Item>


                {/* -------------------- 2. CHI TIẾT HÓA ĐƠN (FORM LIST) -------------------- */}
                <h3 style={{ marginTop: 20 }}>Chi tiết Sản phẩm</h3>
                <List
                    name="chi_tet" 
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key as number} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    
                                    {/* Cột 1: Sản phẩm */}
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'id_san_pham']}
                                        fieldKey={[fieldKey as number, 'id_san_pham']} rules={[{ required: true, message: 'Chọn SP' }]}
                                        style={{ width: 150 }}
                                    >
                                        <Select placeholder="Sản phẩm">
                                            <Option value={1}>Trà chanh</Option>
                                            <Option value={2}>Trà đào</Option>
                                            <Option value={3}>Cà phê</Option>
                                            <Option value={4}>Bánh ngọt</Option>
                                        </Select>
                                    </Form.Item>

                                    {/* Cột 2: Số lượng */}
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'so_luong']}
                                        fieldKey={[fieldKey as number, 'so_luong']}
                                        rules={[{ required: true, message: 'SL' }]}
                                        style={{ width: 80 }}
                                    >
                                        <InputNumber min={1} placeholder="SL" />
                                    </Form.Item>

                                    {/* Cột 3: Đơn giá (Đã thêm step=1 để sửa lỗi TS) */}
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'don_gia']}
                                        fieldKey={[fieldKey as number, 'don_gia']}
                                        rules={[{ required: true, message: 'ĐG' }]}
                                        style={{ width: 120 }}
                                    >
                                        <InputNumber
                                            min={100}
                                            step={1} 
                                            parser={value => Number(value!.replace(/\$\s?|(,*)/g, ''))}
                                            placeholder="Đơn giá"
                                        />
                                    </Form.Item>

                                    {fields.length > 0 ? (
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    ) : null}
                                </Space>
                            ))}

                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm Sản phẩm
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

export default AddHoaDonBan;