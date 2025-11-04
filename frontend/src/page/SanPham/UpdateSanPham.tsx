import React, { useCallback, useEffect, useState } from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Form, Input, Space, message, Select, InputNumber, Spin } from 'antd';
import { PlusOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { SanPham, LoaiSanPham, NguyenLieu } from '../../component/interface';
import axios from 'axios';

const { Option } = Select;
const { List } = Form;

interface SanPhamUpdateValues {
    ten_san_pham: string;
    gia_ban: number;
    mo_ta: string;
    id_loai: number;
    cong_thuc: {
        id_nguyen_lieu: number;
        ten_nguyen_lieu: string;
        don_vi: string;
        so_luong: number;
    }[];
}

interface UpdateSanPhamProps {
    id: number;
    initialData: SanPham | null;
    onClose: () => void;
    onSuccess: () => void;
}

const API_BASE_URL = 'http://localhost:7000/api';


const UpdateSanPham: React.FC<UpdateSanPhamProps> = ({ id, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loaiSanPhams, setLoaiSanPhams] = useState<LoaiSanPham[]>([]);
    const [isLoadingLoaiSP, setIsLoadingLoaiSP] = useState(false);
    const [nguyenLieus, setNguyenLieus] = useState<NguyenLieu[]>([]);
    const [isLoadingNguyenLieu, setIsLoadingNguyenLieu] = useState(false);
    const fetchLoaiSanPhams = useCallback(async () => {
        setIsLoadingLoaiSP(true);
        try {
            const response = await axios.get<{ success: boolean; data: any }>(`${API_BASE_URL}/loaisanpham/get-all`);
            if (response.data.success && response.data.data) {
                const apiData = response.data.data;
                let resultData: LoaiSanPham[] = [];

                // Xử lý API trả về mảng lồng nhau (SQL rows)
                if (Array.isArray(apiData) && Array.isArray(apiData[0])) {
                    resultData = apiData[0];
                } else if (Array.isArray(apiData)) {
                    resultData = apiData;
                }

                setLoaiSanPhams(resultData.filter(item => item && item.id && item.ten_loai));
            } else {
                message.error('Lỗi khi tải danh sách Loại Sản phẩm.');
            }
        } catch (error) {
            console.error('Lỗi API Loại Sản phẩm:', error);
            message.error('Không thể kết nối để tải Loại Sản phẩm.');
        } finally {
            setIsLoadingLoaiSP(false);
        }
    }, []);
    const fetchNguyenLieus = useCallback(async () => {
        setIsLoadingNguyenLieu(true);
        try {
            const response = await axios.get<{ success: boolean; data: any }>(`${API_BASE_URL}/nguyenlieu/get-all`);

            if (response.data.success && response.data.data) {
                const apiData = response.data.data;
                let resultData: NguyenLieu[] = [];

                if (Array.isArray(apiData) && Array.isArray(apiData[0])) {
                    resultData = apiData[0];
                } else if (Array.isArray(apiData)) {
                    resultData = apiData;
                }

                setNguyenLieus(resultData.filter(item => item && item.id && item.ten_nguyen_lieu));
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách Nguyên liệu.');
        } finally {
            setIsLoadingNguyenLieu(false);
        }
    }, []);
    useEffect(() => {
        fetchLoaiSanPhams();
        fetchNguyenLieus();
        if (initialData) {
            console.log(initialData);
            form.setFieldsValue({
                id_loai: initialData.id_loai,
                ten_san_pham: initialData.ten_san_pham,
                gia_ban: initialData.gia_ban,
                mo_ta: initialData.mo_ta,
                cong_thuc: initialData.cong_thuc.map(ct => ({
                    id_nguyen_lieu: ct.id_nguyen_lieu,
                    so_luong: ct.so_luong,
                    don_vi: ct.don_vi,
                }))

            });
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [form, initialData, fetchLoaiSanPhams,fetchNguyenLieus]);

    const onFinish = async (values: SanPhamUpdateValues) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                cong_thuc: values?.cong_thuc.map(ct => ({
                    id_nguyen_lieu: ct.id_nguyen_lieu,
                    so_luong: parseFloat(String(ct.so_luong)),
                })) || []
            };

            const response = await axios.put(`${API_BASE_URL}/sanpham/update?id=${id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật sản phẩm ID ${id} thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật sản phẩm.');
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
                <Spin tip="Đang tải dữ liệu sản phẩm..." />
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <Form
                form={form}
                name="updateSanPhamForm"
                layout="vertical"
                onFinish={onFinish as (values: any) => void}
                onFinishFailed={onFinishFailed}
                initialValues={{ cong_thuc: [{}] }}
                autoComplete="off"
            >
                <Form.Item
                    label="Loại sản phẩm"
                    name="id_loai"
                    rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
                >
                    <Select
                        placeholder="Chọn loại sản phẩm"
                        loading={isLoadingLoaiSP}
                        disabled={isLoadingLoaiSP || loaiSanPhams.length === 0}
                    >
                        {loaiSanPhams.map(loai => (
                            <Option key={loai.id} value={loai.id}>
                                {loai.ten_loai}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Tên sản phẩm"
                    name="ten_san_pham"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item
                    label="Giá bán"
                    name="gia_ban"
                    rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                >
                    <InputNumber min={1} placeholder="Giá bán" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="mo_ta"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input placeholder="Nhập mô tả" />

                </Form.Item>
                <h3 style={{ marginTop: 20 }}>Công thức</h3>
                <List
                    name="cong_thuc"
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'id_nguyen_lieu']}
                                        fieldKey={[fieldKey as number, 'id_nguyen_lieu']} rules={[{ required: true, message: 'Chọn Nguyên Liệu' }]}
                                        style={{ width: 150 }}
                                    >
                                        <Select
                                            placeholder="Nguyên liệu"
                                            loading={isLoadingNguyenLieu}
                                            disabled={isLoadingNguyenLieu || nguyenLieus.length === 0}
                                        >
                                            {nguyenLieus.map(nl => (
                                                <Option key={nl.id} value={nl.id}>
                                                    {nl.ten_nguyen_lieu}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'so_luong']}
                                        fieldKey={[fieldKey as number, 'so_luong']}
                                        rules={[{ required: true, message: 'Chọn số lượng' }]}
                                    >
                                        <InputNumber min={0.01} placeholder="SL" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'don_vi']}
                                        fieldKey={[fieldKey as number, 'don_vi']}
                                        style={{ width: 50 }}
                                    >
                                        <Input placeholder="Đơn vị" readOnly />
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

export default UpdateSanPham;