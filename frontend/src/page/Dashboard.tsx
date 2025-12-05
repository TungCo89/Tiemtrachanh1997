/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Card, Statistic, Row, Col, Space, Progress } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Dữ liệu mẫu: Doanh thu 7 ngày gần nhất
const revenueData = [
    { date: '10/11', revenue: 450000 },
    { date: '11/11', revenue: 620000 },
    { date: '12/11', revenue: 580000 },
    { date: '13/11', revenue: 720000 },
    { date: '14/11', revenue: 578000 },
    { date: '15/11', revenue: 630000 },
    { date: '16/11', revenue: 680000 },
];

const Dashboard: React.FC = () => (
    <div style={{ padding: 24, background: '#f0f2f5' }}>
        <h1 style={{ marginBottom: 24 }}>Dashboard tổng quan bán hàng 📈</h1>

        {/* -------------------- 1. KHU VỰC KPI CHÍNH  -------------------- */}
        <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
            {/* KPI 1: Doanh thu hôm nay */}
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={{ borderLeft: '5px solid #1890ff' }}>
                    <Statistic
                        title="Doanh thu (Hôm nay)"
                        value={578000}
                        precision={0}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<DollarCircleOutlined />}
                        suffix="VNĐ"
                    />
                </Card>
            </Col>

            {/* KPI 2: Số đơn hàng */}
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={{ borderLeft: '5px solid #52c41a' }}>
                    <Statistic
                        title="Số đơn hàng"
                        value={15}
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<ShoppingCartOutlined />}
                        suffix="đơn"
                    />
                </Card>
            </Col>

            {/* KPI 3: Lợi nhuận gộp */}
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={{ borderLeft: '5px solid #faad14' }}>
                    <Statistic
                        title="Lợi nhuận gộp (Tháng)"
                        value={35}
                        precision={2}
                        valueStyle={{ color: '#faad14' }}
                        prefix="+"
                        suffix="%"
                    />
                </Card>
            </Col>

            {/* KPI 4: Tổng Sản phẩm */}
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={{ borderLeft: '5px solid #722ed1' }}>
                    <Statistic
                        title="Tổng sản phẩm đã bán"
                        value={15}
                        valueStyle={{ color: '#722ed1' }}
                        suffix="sản phẩm"
                    />
                </Card>
            </Col>
        </Row>

        {/* -------------------- 2. BIỂU ĐỒ VÀ THỐNG KÊ CHI TIẾT -------------------- */}
        <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
            {/* Col 1: Biểu đồ Doanh thu */}
            <Col xs={24} lg={16}>
                <Card title="Doanh thu 7 ngày gần nhất" style={{ height: 350 }}>
                    <div style={{ width: '100%', height: '100%' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={revenueData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} VNĐ`, 'Doanh thu']} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </Col>

            {/* Col 2: Top Sản phẩm & Tình trạng tồn kho */}
            <Col xs={24} lg={8}>
                <Card title="Tình trạng Kho & Bán" style={{ height: 350 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Statistic title="Trà Sữa Bán ra (Tuần)" value={25} suffix="ly" />
                        <Statistic title="Trà Sữa Tồn kho" value={95} suffix="kg" />
                        <Progress percent={95} status="exception" />
                    </Space>
                </Card>
            </Col>
        </Row>
    </div>
);

export default Dashboard;