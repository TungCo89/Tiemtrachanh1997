import React from 'react';
import { Button, Form, Input, Card, Space, message, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Import dayjs

const { Option } = Select;
const { List } = Form;

// --- CẬP NHẬT INTERFACE CHO HÓA ĐƠN BÁN (Sales Invoice) ---
interface HoaDonBanFormValues {
    idBan: number; // Đổi từ idNhaCungCap (Nhập) sang idBan (Bán)
    ngayLap: dayjs.Dayjs; // Đổi từ ngayBan sang ngayLap (Dùng Dayjs cho DatePicker)
    chiTiet: {
        idSanPham: number; // Đổi từ idNguyenLieu sang idSanPham
        soLuong: number;
        donGia: number;
    }[];
}

interface AddHoaDonBanProps {
    onCancel: () => void;
}
// -----------------------------------------------------------


const AddHoaDonBan: React.FC<AddHoaDonBanProps> = ({ onCancel }) => {
    const [form] = Form.useForm();

    const onFinish = (values: HoaDonBanFormValues) => {
        // Log dữ liệu để kiểm tra
        console.log('Thông tin hóa đơn bán cần thêm:', values);
        
        // Tính tổng tiền từ chi tiết sản phẩm
        const tongTien = values.chiTiet.reduce((sum, item) => sum + (item.soLuong * item.donGia), 0);
        
        // Gọi API...
        message.success(`Đã thêm Hóa đơn Bán thành công. Tổng tiền: ${tongTien.toLocaleString('vi-VN')} VNĐ`);
        
        onCancel(); // Đóng Modal
        form.resetFields(); 
    };

    return (
        <Card
            // 👈 ĐÃ SỬA TIÊU ĐỀ
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Hóa đơn Bán</h2>}
            bordered={false}
        >
            <Form
                form={form}
                name="addHoaDonBanForm"
                layout="vertical"
                onFinish={onFinish as any} 
                autoComplete="off"
                initialValues={{ chiTiet: [{}] }} // Khởi tạo 1 dòng trống cho chi tiết
            >

                {/* -------------------- 1. THÔNG TIN CHUNG (HEADER) -------------------- */}
                <Form.Item
                    // 👈 ĐÃ SỬA NHÃN
                    label="Bàn"
                    name="idBan"
                    rules={[{ required: true, message: 'Vui lòng chọn Bàn!' }]}
                >
                    <Select placeholder="Chọn Bàn">
                        {/* Dữ liệu Bàn (ví dụ) */}
                        <Option value={1}>Bàn 1</Option>
                        <Option value={2}>Bàn 2</Option>
                        <Option value={3}>Mang về</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    // 👈 ĐÃ SỬA NHÃN
                    label="Ngày lập"
                    name="ngayLap"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày lập!' }]}
                >
                    <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
                </Form.Item>


                {/* -------------------- 2. CHI TIẾT HÓA ĐƠN (FORM LIST) -------------------- */}
                <h3 style={{ marginTop: 20 }}>Chi tiết Sản phẩm</h3>
                <List
                    name="chiTiet" 
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                // Ép kiểu key để tránh lỗi TS nếu có
                                <Space key={key as number} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    
                                    {/* Cột 1: Sản phẩm */}
                                    <Form.Item
                                        {...restField}
                                        // 👈 ĐÃ SỬA TÊN TRƯỜNG: idSanPham
                                        name={[name, 'idSanPham']}
                                        fieldKey={[fieldKey as number, 'idSanPham']} rules={[{ required: true, message: 'Chọn SP' }]}
                                        style={{ width: 150 }}
                                    >
                                        <Select placeholder="Sản phẩm">
                                            {/* Giả định: 1=Trà chanh, 2=Trà đào, 3=Cà phê */}
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

                                    {/* Cột 3: Đơn giá (Đã thêm step=1 để sửa lỗi TS) */}
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


                {/* -------------------- 3. NÚT SUBMIT VÀ HỦY -------------------- */}
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

export default AddHoaDonBan;