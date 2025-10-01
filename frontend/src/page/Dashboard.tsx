import React from 'react';
import { Card, Statistic, Row, Col } from 'antd'; // Ant Design components
const Dashboard = () => (
    <div>
        <h2>Dashboard Tổng quan</h2>
        <Row gutter={16}>
            <Col span={8}>
                <Card bordered={false}>
                    <Statistic title="Tổng Sản phẩm" value={1128} suffix="món" />
                </Card>
            </Col>
            {/* ...Các Card khác */}
        </Row>
    </div>
);
export default Dashboard;