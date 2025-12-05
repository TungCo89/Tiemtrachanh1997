/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, Card, Space, message, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { SanPham, Ban, HoaDonBan } from '../../component/interface';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;
const { List } = Form;

interface AddHoaDonBanProps {
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api';


const AddHoaDonBan: React.FC<AddHoaDonBanProps> = ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
    const [isLoadingSP, setIsLoadingSP] = useState(false);
    const [bans, setBans] = useState<Ban[]>([]);
    const [isLoadingBan, setIsLoadingBan] = useState(false);
    const fetchSanPhams = useCallback(async () => {
        setIsLoadingSP(true);
        try {
            const response = await axios.get<{ success: boolean; data: any }>(`${API_BASE_URL}/sanpham/get-all`);
            if (response.data.success && response.data.data) {
                const apiData = response.data.data;
                let resultData: SanPham[] = [];

                // Xử lý API trả về mảng lồng nhau (SQL rows)
                if (Array.isArray(apiData) && Array.isArray(apiData[0])) {
                    resultData = apiData[0];
                } else if (Array.isArray(apiData)) {
                    resultData = apiData;
                }

                setSanPhams(resultData.filter(item => item && item.id && item.ten_loai));
            } else {
                message.error('Lỗi khi tải danh sách Sản phẩm.');
            }
        } catch (error) {
            console.error('Lỗi API Sản phẩm:', error);
            message.error('Không thể kết nối để tải Sản phẩm.');
        } finally {
            setIsLoadingSP(false);
        }
    }, []);
    const fetchBans = useCallback(async () => {
        setIsLoadingBan(true);
        try {
            const response = await axios.get<{ success: boolean; data: any }>(`${API_BASE_URL}/ban/get-all`);

            if (response.data.success && response.data.data) {
                const apiData = response.data.data;
                let resultData: Ban[] = [];

                if (Array.isArray(apiData) && Array.isArray(apiData[0])) {
                    resultData = apiData[0];
                } else if (Array.isArray(apiData)) {
                    resultData = apiData;
                }

                setBans(resultData.filter(item => item && item.id && item.ten_ban));
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách Bàn.');
        } finally {
            setIsLoadingBan(false);
        }
    }, []);
    useEffect(() => {
        fetchSanPhams();
        fetchBans();
    }, [fetchSanPhams, fetchBans]);
    const onFinish = async (values: HoaDonBan) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
            };

            // GỌI API create: POST http://localhost:7000/api/hoadonban/create
            const response = await axios.post(`${API_BASE_URL}/hoadonban/create`, payload);

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
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm hóa đơn bán</h2>}
        >
            <Form
                form={form}
                name="addHoaDonBanForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                autoComplete="off"
                initialValues={{
                    ngay_lap: dayjs(),
                    chi_tiet: [{}],
                }}
            >

                {/* -------------------- 1. THÔNG TIN CHUNG (HEADER) -------------------- */}
                <Form.Item
                    label="Bàn"
                    name="id_ban"
                    rules={[{ required: true, message: 'Vui lòng chọn Bàn!' }]}
                >
                    <Select
                        placeholder="Chọn bàn"
                        loading={isLoadingBan}
                        disabled={isLoadingBan || bans.length === 0}
                    >
                        {bans.map(ban => (
                            <Option key={ban.id} value={ban.id}>
                                {ban.ten_ban}
                            </Option>
                        ))}
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
                <h3 style={{ marginTop: 20 }}>Chi tiết Hóa đơn</h3>
                <Form.List
                    name="chi_tiet"
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key as number} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                    {/* Cột 1: Sản phẩm */}
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'id_san_pham']}
                                        fieldKey={[fieldKey as number, 'id_san_pham']}
                                        rules={[{ required: true, message: 'Chọn SP' }]}
                                        style={{ width: 150 }}
                                    >
                                        <Select
                                            placeholder="Sản phẩm"
                                            loading={isLoadingSP}
                                            disabled={isLoadingSP || sanPhams.length === 0}
                                            onChange={(idSanPham: number) => {
                                                const sp = sanPhams.find(p => p.id === idSanPham);
                                                if (sp) {
                                                    form.setFields([
                                                        { name: ['chi_tiet', name, 'don_gia'], value: sp.gia_ban }
                                                    ]);
                                                }
                                            }}
                                        >
                                            {sanPhams.map(sp => (
                                                <Option key={sp.id} value={sp.id}>
                                                    {sp.ten_san_pham}
                                                </Option>
                                            ))}
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
                                        rules={[{ required: true, message: 'ĐG' }]}
                                        style={{ width: 120 }}
                                    >
                                        <InputNumber min={1000} step={1000} placeholder="Đơn giá" />
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
                </Form.List>


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
                        Thêm hóa đơn
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddHoaDonBan;