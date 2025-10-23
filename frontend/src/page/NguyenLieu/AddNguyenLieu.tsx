/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Form, Input, Card, Space, message, Select } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons'; 
import axios from 'axios';
import { NguyenLieu } from '../../component/interface';
const { List } = Form;
interface NguyenLieuMoi {
    ten_nguyen_lieu: string;
    don_vi: string; 
}
interface AddNguyenLieuProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api/nguyenlieu';

const AddNguyenLieu:  React.FC<AddNguyenLieuProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const onFinish = async (values: NguyenLieuMoi) => {
        setLoading(true);
        try {
            const payload : NguyenLieuMoi={
                ten_nguyen_lieu: values.ten_nguyen_lieu,
                don_vi: values.don_vi,
            };

            // GỌI API create: POST http://localhost:7000/api/nguyenlieu/create
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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm nguyên liệu</h2>} 
        >
            <Form
                form={form} 
                name="addNguyenLieuForm"
                layout="vertical" 
                onFinish={onFinish as (values: any) => void}
                autoComplete="off"
            >
                {/* Trường Tên */}
                <Form.Item
                    label="Tên nguyên liệu"
                    name="ten_nguyen_lieu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu!' }]} 
                >
                    <Input placeholder="Nhập tên nguyên liệu" />
                </Form.Item>

                {/* Trường Đơn vị */}
                <Form.Item
                    label="Đơn vị tính"
                    name="don_vi"
                >
                    <Input.TextArea placeholder="Nhập đơn vị đo lường (lit, g, kg...) " autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>

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
                        Thêm Nguyên Liệu
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddNguyenLieu;