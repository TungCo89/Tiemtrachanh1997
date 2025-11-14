import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Card, Space, message, Spin, Select, DatePicker, InputNumber, Empty } from 'antd';
import { SaveOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { SanPham, Ban, HoaDonBan } from '../../component/interface';

// Giả sử bạn có component InvoicePDF ở đường dẫn này
import InvoicePDF from '../../component/InvoicePDF';

const { Option } = Select;
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
interface ChiTietHoaDonForm {
    id_cthdb?: number | null;
    id_san_pham: number;
    so_luong: number;
    don_gia: number;
}

interface UpdateOrderProps {
    idBan: number;
    onClose: () => void;
    onSuccess: () => void;
}

const API_BASE_URL = 'http://localhost:7000/api';

const UpdateOrder: React.FC<UpdateOrderProps> = ({ idBan, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [hoaDon, setHoaDon] = useState<HoaDonBan | null>(null);
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
                if (Array.isArray(apiData) && Array.isArray(apiData[0])) {
                    resultData = apiData[0];
                } else if (Array.isArray(apiData)) {
                    resultData = apiData;
                }
                setSanPhams(resultData.filter(item => item && item.id && item.ten_san_pham));
            }
        } catch (error) {
            message.error('Không thể tải danh sách sản phẩm.');
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
            message.error('Không thể tải danh sách bàn.');
        } finally {
            setIsLoadingBan(false);
        }
    }, []);

    const fetchHoaDonByBanId = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/hoadonban/get-by-IDBan?id=${idBan}`);
            if (response.data.success && response.data.data) {
                const hd = response.data.data;
                setHoaDon(hd);
                const INPUT_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
                const parsedNgayLap = dayjs(hd.ngay_lap, INPUT_DATETIME_FORMAT);
                form.setFieldsValue({
                    id_ban: hd.id_ban,
                    ngay_lap: parsedNgayLap,
                    chi_tiet: hd.chi_tiet.map((ct: any) => ({
                        id_cthdb: ct.id_cthdb,
                        id_san_pham: ct.id_san_pham,
                        so_luong: ct.so_luong,
                        don_gia: ct.don_gia,
                    })),
                });
            } else {
                setHoaDon(null);
            }
        } catch (error) {
            console.error('Lỗi khi lấy hóa đơn:', error);
            message.error('Không thể tải hóa đơn của bàn này.');
            setHoaDon(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSanPhams();
        fetchBans();
        fetchHoaDonByBanId();
    }, [idBan, fetchSanPhams, fetchBans]);

    // ========== Xuất PDF ==========
    const handleExportPDF = async () => {
        if (!hoaDon) {
            message.warning('Chưa có hóa đơn để xuất.');
            return;
        }

        try {
            const formattedDate = hoaDon.ngay_lap
                ? dayjs(hoaDon.ngay_lap, 'DD/MM/YYYY HH:mm:ss').format('HH:mm DD/MM/YYYY')
                : 'Không xác định';
            const blob = await pdf(
                <InvoicePDF
                    tenCuaHang="TIEM TRA CHANH 1997"
                    diaChi="Nhu Quynh, Van Lam, Hung Yen"
                    idHoaDon={hoaDon.id}
                    ngayLap={formattedDate}
                    chiTiet={hoaDon.chi_tiet.map(ct => ({
                        ten_san_pham: ct.ten_san_pham,
                        so_luong: ct.so_luong,
                        don_gia: ct.don_gia,
                        thanh_tien: ct.so_luong * ct.don_gia,
                    }))}
                    tongTien={hoaDon.tong_tien}
                />
            ).toBlob();

            saveAs(blob, `Hoa_Don_${idBan}_${dayjs().format('YYYYMMDD_HHmm')}.pdf`);
        } catch (error) {
            console.error('Lỗi xuất PDF:', error);
            message.error('Không thể xuất hóa đơn. Vui lòng thử lại.');
        }
    };

    // ========== Cập nhật hóa đơn ==========
    const onFinish = async (values: any) => {
        if (!hoaDon) {
            message.error('Không có hóa đơn để cập nhật.');
            return;
        }

        setLoading(true);
        try {
            const chiTietChuanHoa = values.chi_tiet.map((item: any) => {
                const soLuong = Number(item.so_luong);
                const donGia = Number(item.don_gia);
                const thanhTien = soLuong * donGia;

                const baseItem = {
                    id_san_pham: item.id_san_pham,
                    so_luong: soLuong,
                    don_gia: donGia,
                    thanh_tien: thanhTien,
                };

                if (item.id_cthdb != null) {
                    return { ...baseItem, id_cthdb: item.id_cthdb };
                }
                return baseItem;
            });

            const payload = {
                id: hoaDon.id,
                id_ban: values.id_ban,
                ngay_lap: values.ngay_lap ? values.ngay_lap.format('YYYY-MM-DD HH:mm:ss') : null,
                chi_tiet: chiTietChuanHoa,
            };

            const response = await axios.put(`${API_BASE_URL}/hoadonban/update?id=${hoaDon.id}`, payload);

            if (response.data.success) {
                message.success(`Đã cập nhật hóa đơn thành công.`);
                onSuccess();
            } else {
                message.error(response.data.message || 'Lỗi khi cập nhật hóa đơn.');
            }
        } catch (error) {
            console.error('Lỗi API Update:', error);
            message.error('Lỗi kết nối máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    const tenBan = bans.find(b => b.id === idBan)?.ten_ban || `Bàn ${idBan}`;

    if (loading) {
        return (
            <div style={{ padding: 20, textAlign: 'center' }}>
                <Spin />
            </div>
        );
    }

    return (
        <Card title={<h2 style={{ textAlign: 'center', margin: 0 }}>Hóa đơn - {tenBan}</h2>}>
            {!hoaDon ? (
                <Empty description={`${tenBan} chưa có hóa đơn nào.`} style={{ padding: 20 }} />
            ) : (
                <Form
                    form={form}
                    name="updateOrderForm"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ chi_tiet: [] }}
                >
                    <Form.Item label="Bàn" name="id_ban">
                        <Select disabled value={idBan}>
                            <Option value={idBan}>{tenBan}</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngày lập"
                        name="ngay_lap"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày lập!' }]}
                    >
                        <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} disabled />
                    </Form.Item>

                    <h3 style={{ marginTop: 20 }}>Chi tiết Sản phẩm</h3>
                    <Form.List name="chi_tiet">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'id_san_pham']}
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
                                                        form.setFields([{ name: ['chi_tiet', name, 'don_gia'], value: sp.gia_ban }]);
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

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'so_luong']}
                                            rules={[{ required: true, message: 'SL' }]}
                                            style={{ width: 80 }}
                                        >
                                            <InputNumber min={1} placeholder="SL" />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'don_gia']}
                                            rules={[{ required: true, message: 'ĐG' }]}
                                            style={{ width: 120 }}
                                        >
                                            <InputNumber min={1000} step={1000} placeholder="Đơn giá" />
                                        </Form.Item>

                                        {fields.length > 0 && (
                                            <MinusCircleOutlined
                                                onClick={() => remove(name)}
                                                style={{ color: 'red', marginLeft: 8 }}
                                            />
                                        )}
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

                    <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                            style={{ width: '100%', maxWidth: 300 }}
                        >
                            Cập nhật Hóa đơn
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center', marginTop: 10 }}>
                        <Button
                            type="default"
                            onClick={handleExportPDF}
                            disabled={!hoaDon}
                            style={{ width: '100%', maxWidth: 300 }}
                        >
                            Xuất Hóa đơn (PDF)
                        </Button>
                    </Form.Item>
                </Form>
            )}

            <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button onClick={onClose}>Đóng</Button>
            </div>
        </Card>
    );
};

export default UpdateOrder;