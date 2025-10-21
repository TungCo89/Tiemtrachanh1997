import React from 'react';
import { Card, Statistic, Row, Col, Space, Progress, Button } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => (
    <div style={{ padding: 24, background: '#f0f2f5' }}>
        <h1 style={{ marginBottom: 24 }}>Dashboard Tổng quan bán hàng 📈</h1>

        {/* -------------------- 1. KHU VỰC KPI CHÍNH (KEY METRICS) -------------------- */}
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

            {/* KPI 3: Lợi nhuận gộp (Ví dụ) */}
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
            {/* Col 1: Biểu đồ Doanh thu (Placeholder) */}
            <Col xs={24} lg={16}>
                <Card title="Doanh thu 7 ngày gần nhất" style={{ height: 350 }}>
                    {/* THỰC TẾ: Đặt Biểu đồ (Chart) tại đây */}
                    <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
                        [Placeholder: Biểu đồ đường Doanh thu]
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