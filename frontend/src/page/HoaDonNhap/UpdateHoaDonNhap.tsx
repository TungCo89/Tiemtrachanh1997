import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin, Select, DatePicker, InputNumber } from 'antd';
import { SaveOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; 
const { Option } = Select;
const { List } = Form;

interface UpdateHoaDonNhapProps {
    id: number;           
    onCancel: () => void; 
}

// 2. Cập nhật interface cho Form Values (Giống với AddHoaDonNhap)
interface HoaDonNhapFormValues {
    idNhaCungCap: number; 
    ngayNhap: dayjs.Dayjs; 
    chiTiet: {
        idNguyenLieu: number;
        soLuong: number;
        donGia: number;
    }[];
}

const UpdateHoaDonNhap: React.FC<UpdateHoaDonNhapProps> = ({ id, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    // Xử lý tải dữ liệu cũ lên Form
    useEffect(() => {
        const fetchHoaDonNhapData = async () => {
            setLoading(true);

            const initialData = {
                idNhaCungCap: 2, 
                ngayNhap: dayjs('2025-09-05 15:30:00'), 
                chiTiet: [
                    { idNguyenLieu: 2, soLuong: 5, donGia: 20000 },  
                    { idNguyenLieu: 3, soLuong: 20, donGia: 15000 }, 
                ],
            };

            form.setFieldsValue(initialData);
            setLoading(false);
        };

        if (id) {
            fetchHoaDonNhapData();
        }
    }, [form, id]);

    const onFinish = (values: HoaDonNhapFormValues) => {
        // GỌI API update: HoaDonNhapService.updateHoaDonNhap(id, values);
        console.log(`Cập nhật HĐ ID ${id}:`, values);
        message.success(`Đã cập nhật hóa đơn nhập ID ${id}`);
        onCancel(); 
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật Hóa đơn Nhập ID: {id}</h2>}
            bordered={false}
        >
            <Spin spinning={loading} tip="Đang tải dữ liệu...">
                <Form
                    form={form}
                    name="updateHoaDonNhapForm"
                    layout="vertical"
                    onFinish={onFinish as any} 
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={{ chiTiet: [{}] }} 
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
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key as number} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'idNguyenLieu']}
                                            fieldKey={[fieldKey as number, 'idNguyenLieu']}
                                            rules={[{ required: true, message: 'Chọn NL' }]}
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
                                icon={<SaveOutlined />}
                            >
                                Lưu Thay Đổi
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default UpdateHoaDonNhap;