// src/components/AdminLayout.tsx
import React, { useState, ReactNode } from 'react';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, ShoppingOutlined, UserOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import { useLocation, useNavigate } from 'react-router-dom';
interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Quản lý Sản phẩm' },
        { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý Người dùng' },
        // ... Các trang khác
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>
                <Content
                    style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}
                >

                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;