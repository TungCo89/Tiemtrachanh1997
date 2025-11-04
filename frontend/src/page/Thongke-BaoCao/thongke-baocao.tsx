/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DatePicker, Card, Row, Col, Statistic, Table, Select, Spin, message, Typography, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from 'chart.js';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;
const BASE_URL = 'http://localhost:7000/api/thongke';

interface LoiNhuanData {
    ngay: string;
    tong_doanh_thu: number;
    tong_chi_phi_nguyen_lieu: number;
    loi_nhuan_so_bo: number;
}

interface HieuSuatSanPhamData {
    id?: number;
    ten_san_pham: string;
    ten_loai: string;
    tong_so_luong_ban: number;
    tong_doanh_thu_san_pham: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

const ThongKeBaoCao: React.FC = () => {
    const [startDate, setStartDate] = useState(dayjs().subtract(30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    const [loading, setLoading] = useState(false);
    const [loiNhuanData, setLoiNhuanData] = useState<LoiNhuanData[]>([]);
    const [hieuSuatSPData, setHieuSuatSPData] = useState<HieuSuatSanPhamData[]>([]);
    const [topN, setTopN] = useState<number>(5);

    const totalRevenue = loiNhuanData?.reduce((sum, item) => sum + item.tong_doanh_thu, 0) || 0;
    const totalProfit = loiNhuanData?.reduce((sum, item) => sum + item.loi_nhuan_so_bo, 0) || 0;
    const chiPhiNguyenLieu = totalRevenue - totalProfit;
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resLoiNhuan, resHieuSuat] = await Promise.all([
                axios.get<ApiResponse<LoiNhuanData[]>>(`${BASE_URL}/loi-nhuan-so-bo`, { params: { startDate, endDate } }),
                axios.get<ApiResponse<HieuSuatSanPhamData[]>>(`${BASE_URL}/hieu-suat-san-pham`, { params: { startDate, endDate, topN } }),
            ]);

            const loiNhuanArray = resLoiNhuan.data.data || [];
            setLoiNhuanData(loiNhuanArray);

            const hieuSuatArray = resHieuSuat.data.data || [];
            setHieuSuatSPData(hieuSuatArray.map((item, index) => ({ ...item, id: index })));


        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thống kê:", error);
            message.error("Không thể tải dữ liệu thống kê từ server. Vui lòng kiểm tra API.");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        const loiNhuanSheetName = "Loi_Nhuan_So_Bo";
        const loiNhuanHeader = ["Ngày", "Doanh Thu (VNĐ)", "Chi Phí Nguyên Liệu (VNĐ)", "Lợi Nhuận Sơ Bộ (VNĐ)"];

        const loiNhuanDataForExport = loiNhuanData.map(item => [
            item.ngay,
            item.tong_doanh_thu,
            item.tong_chi_phi_nguyen_lieu,
            item.loi_nhuan_so_bo,
        ]);

        const loiNhuanWorksheet = XLSX.utils.aoa_to_sheet([loiNhuanHeader, ...loiNhuanDataForExport]);
        XLSX.utils.book_append_sheet(wb, loiNhuanWorksheet, loiNhuanSheetName);

        const hieuSuatSheetName = "Hieu_Suat_San_Pham_Top_" + topN;
        const hieuSuatHeader = ["Sản Phẩm", "Loại", "Số Lượng Bán", "Doanh Thu (VNĐ)"];

        const hieuSuatDataForExport = hieuSuatSPData.map(item => [
            item.ten_san_pham,
            item.ten_loai,
            item.tong_so_luong_ban,
            item.tong_doanh_thu_san_pham,
        ]);

        const hieuSuatWorksheet = XLSX.utils.aoa_to_sheet([hieuSuatHeader, ...hieuSuatDataForExport]);
        XLSX.utils.book_append_sheet(wb, hieuSuatWorksheet, hieuSuatSheetName);

        try {
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            const fileName = `Bao_Cao_Kinh_Doanh_${startDate}_den_${endDate}.xlsx`;

            saveAs(blob, fileName);
            message.success("Đã xuất file báo cáo Excel thành công!");
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
            message.error("Lỗi trong quá trình xuất file Excel.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, topN]);

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
            setStartDate(dateStrings[0]);
            setEndDate(dateStrings[1]);
        }
    }

    const lineChartData = {
        labels: loiNhuanData?.map(item => dayjs(item.ngay).format('DD/MM')) || [],
        datasets: [
            {
                label: 'Doanh Thu',
                data: loiNhuanData?.map(item => item.tong_doanh_thu) || [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
                tension: 0.3,
            },
            {
                label: 'Lợi Nhuận Sơ Bộ',
                data: loiNhuanData?.map(item => item.loi_nhuan_so_bo) || [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y',
                tension: 0.3,
            },
        ],
    };

    const barChartData = {
        labels: hieuSuatSPData?.map(item => item.ten_san_pham) || [],
        datasets: [
            {
                label: 'Doanh Thu Sản Phẩm (VNĐ)',
                data: hieuSuatSPData?.map(item => item.tong_doanh_thu_san_pham) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                order: 1,
            },
            // {
            //     label: 'Số Lượng Bán',
            //     data: hieuSuatSPData?.map(item => item.tong_so_luong_ban) || [],
            //     backgroundColor: 'rgba(153, 102, 255, 0.8)',
            //     order: 2,
            // },
        ],
    };

    const productColumns = [
        { title: 'Sản Phẩm', dataIndex: 'ten_san_pham', key: 'ten_san_pham' },
        { title: 'Loại', dataIndex: 'ten_loai', key: 'ten_loai' },
        {
            title: 'Số Lượng Bán',
            dataIndex: 'tong_so_luong_ban',
            key: 'tong_so_luong_ban',
            sorter: (a: HieuSuatSanPhamData, b: HieuSuatSanPhamData) => a.tong_so_luong_ban - b.tong_so_luong_ban,
            align: 'right' as const
        },
        {
            title: 'Doanh Thu',
            dataIndex: 'tong_doanh_thu_san_pham',
            key: 'tong_doanh_thu_san_pham',
            render: (text: number) => `${text.toLocaleString('vi-VN')} VNĐ`,
            sorter: (a: HieuSuatSanPhamData, b: HieuSuatSanPhamData) => a.tong_doanh_thu_san_pham - b.tong_doanh_thu_san_pham,
            align: 'right' as const
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={2} style={{ marginBottom: 20 }}>Báo Cáo Thống Kê Kinh Doanh</Title>

            <Card style={{ marginBottom: 20 }}>
                <Row gutter={16} align="middle">
                    <Col>
                        Chọn Khoảng Thời Gian:
                    </Col>
                    <Col>
                        <RangePicker
                            defaultValue={[dayjs(startDate), dayjs(endDate)]}
                            format="YYYY-MM-DD"
                            onChange={handleDateChange}
                            allowClear={false}
                            disabled={loading}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={exportToExcel}
                            loading={loading}
                            disabled={loiNhuanData.length === 0 && hieuSuatSPData.length === 0}
                        >
                            Xuất Excel
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Spin spinning={loading} tip="Đang tải dữ liệu...">
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={8}>
                        <Card >
                            <Statistic
                                title="Tổng Doanh Thu"
                                value={totalRevenue}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="VNĐ"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card >
                            <Statistic
                                title="Tổng Lợi Nhuận "
                                value={totalProfit}
                                precision={0}
                                valueStyle={{ color: totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
                                prefix={totalProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                suffix="VNĐ"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card >
                            <Statistic
                                title="Chi Phí Nguyên Liệu "
                                value={chiPhiNguyenLieu}
                                precision={0}
                                valueStyle={{ color: chiPhiNguyenLieu >= 0 ? '#3f8600' : '#cf1322' }}
                                suffix="VNĐ"
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title={`Biểu đồ Doanh Thu và Lợi Nhuận theo ngày (${startDate} đến ${endDate})`} style={{ marginBottom: 20 }}>
                    {loiNhuanData.length > 0 ? (
                        <Line
                            options={{ responsive: true, interaction: { mode: 'index', intersect: false } }}
                            data={lineChartData}
                        />
                    ) : (
                        <p style={{ textAlign: 'center', margin: '50px 0' }}>Không có dữ liệu Doanh thu/Lợi nhuận trong khoảng thời gian này.</p>
                    )}
                </Card>

                <Row gutter={16}>
                    <Col span={24}>
                        <Card
                            title="Top Sản Phẩm Bán Chạy Nhất"
                            extra={
                                <Select value={topN} style={{ width: 120 }} onChange={(value: number) => setTopN(value)}>
                                    <Option value={5}>Top 5</Option>
                                    <Option value={10}>Top 10</Option>
                                    <Option value={20}>Top 20</Option>
                                </Select>
                            }
                        >
                            {hieuSuatSPData.length > 0 ? (
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <h3 style={{ marginTop: 0 }}>Biểu Đồ So Sánh Doanh Thu/Số Lượng</h3>
                                        <Bar options={{ responsive: true }} data={barChartData} />
                                    </Col>
                                    <Col span={12}>
                                        <h3 style={{ marginTop: 0 }}>Chi Tiết Bảng</h3>
                                        <Table
                                            columns={productColumns}
                                            dataSource={hieuSuatSPData}
                                            pagination={{ pageSize: topN }}
                                            size="small"
                                        />
                                    </Col>
                                </Row>
                            ) : (
                                <p style={{ textAlign: 'center', margin: '50px 0' }}>Không có dữ liệu Sản phẩm bán ra trong khoảng thời gian này.</p>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default ThongKeBaoCao;