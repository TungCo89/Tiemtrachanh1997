import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, Spin, Select, DatePicker, InputNumber } from 'antd';
import { SaveOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; 

const { Option } = Select;
const { List } = Form;

interface UpdateHoaDonBanProps {
    id: number;           
    onCancel: () => void; 
}

interface HoaDonBanFormValues {
    idBan: number; 
    ngayLap: dayjs.Dayjs; 
    chiTiet: {
        idSanPham: number; 
        soLuong: number;
        donGia: number;
    }[];
}

const UpdateHoaDonBan: React.FC<UpdateHoaDonBanProps> = ({ id, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchHoaDonBanData = async () => {
            setLoading(true);

            // --- MOCK DATA TẢI DỮ LIỆU CŨ CHO HÓA ĐƠN BÁN (Thay thế bằng API call) ---
            const initialData = {
                idBan: 1, 
                ngayLap: dayjs('2025-09-15 19:30:00'),
                chiTiet: [
                    { idSanPham: 1, soLuong: 1, donGia: 15000 },  
                    { idSanPham: 2, soLuong: 1, donGia: 25000 }, 
                ],
            };

            form.setFieldsValue(initialData);
            setLoading(false);
        };

        if (id) {
            fetchHoaDonBanData();
        }
    }, [form, id]);

    const onFinish = (values: HoaDonBanFormValues) => {
        // GỌI API update: HoaDonBanService.updateHoaDonBan(id, values);
        console.log(`Cập nhật HĐ Bán ID ${id}:`, values);
        message.success(`Đã cập nhật hóa đơn BÁN ID ${id}`); 
        onCancel(); 
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Gửi form thất bại:', errorInfo);
        message.error('Vui lòng điền đầy đủ các trường bắt buộc.');
    };

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật Hóa đơn BÁN ID: {id}</h2>}
            bordered={false}
        >
            <Spin spinning={loading} tip="Đang tải dữ liệu...">
                <Form
                    form={form}
                    name="updateHoaDonBanForm"
                    layout="vertical"
                    onFinish={onFinish as any} 
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={{ chiTiet: [{}] }} 
                >
                    
                    <Form.Item
                        label="Bàn"
                        name="idBan" 
                        rules={[{ required: true, message: 'Vui lòng chọn Bàn!' }]}
                    >
                        <Select placeholder="Chọn Bàn">
                            <Option value={1}>Bàn 1 (Lầu 1)</Option>
                            <Option value={2}>Bàn 2 (Lầu 1)</Option>
                            <Option value={3}>Bàn 3 (Mang về)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngày lập"
                        name="ngayLap" 
                        rules={[{ required: true, message: 'Vui lòng chọn ngày lập!' }]}
                    >
                        <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
                    </Form.Item>

                    {/* --------------------  CHI TIẾT HÓA ĐƠN (FORM LIST) -------------------- */}

                    <h3 style={{ marginTop: 20 }}>Chi tiết Sản phẩm</h3>
                    <List
                        name="chiTiet"
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key as number} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        
                                        {/* Cột 1: Sản phẩm */}
                                        <Form.Item
                                            {...restField}
                                            // 👈 Sửa tên trường: idSanPham
                                            name={[name, 'idSanPham']}
                                            fieldKey={[fieldKey as number, 'idSanPham']}
                                            rules={[{ required: true, message: 'Chọn SP' }]}
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
                                            name={[name, 'soLuong']}
                                            fieldKey={[fieldKey as number, 'soLuong']}
                                            rules={[{ required: true, message: 'SL' }]}
                                            style={{ width: 80 }}
                                        >
                                            <InputNumber min={1} placeholder="SL" />
                                        </Form.Item>

                                        {/* Cột 3: Đơn giá (Đã có step=1 để tránh lỗi TS) */}
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

                                        {/* Cột 4: Nút Xóa */}
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        ) : null}
                                    </Space>
                                ))}

                                {/* Nút Thêm dòng mới */}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm Sản phẩm
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </List>

                    {/* -------------------- 3. NÚT LƯU VÀ HỦY -------------------- */}
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

export default UpdateHoaDonBan;