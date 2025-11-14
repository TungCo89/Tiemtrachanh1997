/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Card, Space, message, Spin, Select, DatePicker, InputNumber } from 'antd';
import { SaveOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { SanPham, Ban, HoaDonBan } from '../../component/interface';

const { Option } = Select;
const { List } = Form;
interface HoaDonBanUpdateValues {
    id: number;
    id_ban: number;
    ngay_lap: dayjs.Dayjs;
    tong_tien: number;
    chi_iet: {
        id_cthdb: number;
        id_san_pham: number;
        so_luong: number;
        don_gia: number;
    }[];
}

interface UpdateHoaDonBanProps {
    id: number;
    initialData: HoaDonBan | null;
    onClose: () => void;
    onSuccess: () => void;
}
const API_BASE_URL = 'http://localhost:7000/api';

const UpdateHoaDonBan: React.FC<UpdateHoaDonBanProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
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
    // Gọi khi component mount
    useEffect(() => {
        fetchSanPhams();
        fetchBans();
    }, [fetchSanPhams, fetchBans]);
    useEffect(() => {
        if (initialData) {
            // console.log(initialData);
            const INPUT_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
            let parsedNgayLap = null;
            //  Chuyển đổi chuỗi ngày tháng thành đối tượng dayjs
            if (initialData.ngay_lap) {
                const dateObject = dayjs(initialData.ngay_lap, INPUT_DATETIME_FORMAT);

                if (dateObject.isValid()) {
                    parsedNgayLap = dateObject;
                } else {
                    console.error("Lỗi phân tích cú pháp ngày lập:", initialData.ngay_lap);
                }
            } form.setFieldsValue({
                id_ban: initialData.id_ban,
                ngay_lap: parsedNgayLap,
                tong_tien: initialData.tong_tien,
                chi_tiet: initialData.chi_tiet.map(ct => ({
                    id_cthdb: ct.id_cthdb,
                    id_san_pham: ct.id_san_pham,
                    ten_san_pham: ct.ten_san_pham,
                    so_luong: ct.so_luong,
                    don_gia: ct.don_gia,
                }))

            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData]);

    const onFinish = async (values: HoaDonBanUpdateValues) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
            };

            const response = await axios.put(`${API_BASE_URL}/hoadonban/update?id=${id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật hóa đơn bán ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật hóa đơn bán.');
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
                <Spin />
            </div>
        );
    }

    return (
        <Card
            title={<h2 style={{ textAlign: 'center', margin: 0 }}>Cập nhật Hóa đơn Bán ID: {id}</h2>}
        >
            <Spin spinning={loading} tip="Đang tải dữ liệu...">
                <Form
                    form={form}
                    name="updateHoaDonBanForm"
                    layout="vertical"
                    onFinish={onFinish as (values: any) => void}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={{ chi_tiet: [{}] }}
                >

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

                    {/* --------------------  CHI TIẾT HÓA ĐƠN (FORM LIST) -------------------- */}

                    <h3 style={{ marginTop: 20 }}>Chi tiết Sản phẩm</h3>
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

                    {/* -------------------- 3. NÚT LƯU  -------------------- */}
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
            </Spin>
        </Card>
    );
};

export default UpdateHoaDonBan;