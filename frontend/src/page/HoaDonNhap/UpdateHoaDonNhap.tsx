/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin, Select, DatePicker, InputNumber } from 'antd';
import { SaveOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { HoaDonNhap } from '../../component/interface';
import axios from 'axios';
import dayjs from 'dayjs';
const { Option } = Select;
const { List } = Form;
interface HoaDonNhapUpdateValues {
    id: number;
    id_ncc: number;
    ngay_nhap: dayjs.Dayjs;
    tong_tien: number;
    ghi_chu: string;
    chi_tiet: {
        id_cthdn:number;
        id_nguyen_lieu: number;
        so_luong: number;
        don_gia: number;
    }[];
}
interface UpdateHoaDonNhapProps {
    id: number;
    initialData: HoaDonNhap | null;
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/hoadonnhap';


const UpdateHoaDonNhap: React.FC<UpdateHoaDonNhapProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            console.log(initialData);
            const ngayNhapDayjs = dayjs(initialData.ngay_nhap);
            form.setFieldsValue({
                id_ncc: initialData.id_ncc,
                ngay_nhap: ngayNhapDayjs,
                tong_tien: initialData.tong_tien,
                ghi_chu: initialData.ghi_chu,
                chi_tiet: initialData.chi_tiet.map(ct => ({
                    id_cthdn:ct.id_cthdn,
                    id_nguyen_lieu: ct.id_nguyen_lieu,
                    ten_nguyen_lieu: ct.ten_nguyen_lieu,
                    so_luong: ct.so_luong,
                    don_gia: ct.don_gia,
                }))

            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData]);

    const onFinish = async (values: HoaDonNhapUpdateValues) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                chi_tiet: initialData?.chi_tiet.map(ct => ({
                    id_cthdn:ct.id_cthdn,
                    id_nguyen_lieu: ct.id_nguyen_lieu,
                    ten_nguyen_lieu: ct.ten_nguyen_lieu,
                    so_luong: ct.so_luong,
                    don_gia: ct.don_gia,
                })) || []
            };

            const response = await axios.put(`${API_BASE_URL}/update?id=${id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật hóa đơn nhập ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật hóa đơn nhập.');
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
                <Spin tip="Đang tải dữ liệu hóa đơn nhập..." />
            </div>
        );
    }
    return (
        <div style={{ padding: 20 }}>
            <Form
                form={form}
                name="updateHoaDonNhapForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                initialValues={{ chi_tiet: [{}] }}
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
                                        fieldKey={[fieldKey as number, 'so_luong']}
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

export default UpdateHoaDonNhap;