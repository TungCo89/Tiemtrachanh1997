import React from 'react';
import { Button, Form, Input, Card, Space, message, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'; // Cần MinusCircleOutlined cho danh sách
const { Option } = Select;
const { List } = Form;
interface HoaDonNhapFormValues {
    idNhaCungCap: number; 
    ngayNhap: string;     
    chiTiet: {
        idNguyenLieu: number;
        soLuong: number;
        donGia: number;
    }[];
}

interface AddHoaDonNhapProps {
    onCancel: () => void;
}


const AddHoaDonNhap: React.FC<AddHoaDonNhapProps> = ({ onCancel }) => {
    const [form] = Form.useForm();

    const onFinish = (values: HoaDonNhapFormValues) => {
        console.log('Thông tin hóa đơn nhập cần thêm:', values);
        const tongTien = values.chiTiet.reduce((sum, item) => sum + (item.soLuong * item.donGia), 0);
        // Gọi API...
        message.success(`Đã thêm Hóa đơn Nhập thành công. Tổng tiền: ${tongTien.toLocaleString('vi-VN')} VNĐ`);
        onCancel();
        form.resetFields();
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Hóa đơn Nhập</h2>}
            bordered={false}
        >
            <Form
                form={form}
                name="addHoaDonNhapForm"
                layout="vertical"
                onFinish={onFinish as any} 
                autoComplete="off"
            >

                <Form.Item
                    label="Nhà cung cấp"
                    name="idNhaCungCap"
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
                    name="ngayNhap"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày nhập!' }]}
                >
                    <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
                </Form.Item>


                <h3 style={{ marginTop: 20 }}>Chi tiết Nguyên liệu</h3>
                <List
                    name="chiTiet" 
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
                                        style={{ width: 80 }}
                                    >
                                        <InputNumber min={1} placeholder="SL" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'donGia']}
                                        fieldKey={[fieldKey as number, 'donGia']}
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


                <Form.Item style={{ textAlign: 'right', marginTop: 30 }}>
                    <Space>
                        <Button onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                        >
                            Lưu Hóa đơn
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddHoaDonNhap;