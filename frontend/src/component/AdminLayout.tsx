// src/components/AdminLayout.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, ShoppingOutlined, UserOutlined, TableOutlined, PlusOutlined, SettingOutlined, BarChartOutlined, LineChartOutlined, DatabaseOutlined, DollarCircleOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
        // ---  NHÓM NGƯỜI DÙNG (SubMenu) ---
        { key: '/admin/users', icon: <UserOutlined />, label: 'Danh sách Người dùng' },

        // ---  NHÓM NHÀ CUNG CẤP (SubMenu) ---
        { key: '/admin/nhacungcap', icon: <UserOutlined />, label: 'Danh sách Nhà cung cấp' },

        // ---  NHÓM BỐ CỤC BÀN (SubMenu) ---
        { key: '/admin/ban', icon: <SettingOutlined />, label: 'Quản lý Bàn' },

        // ---  NHÓM HÀNG HÓA (SubMenu) ---
        {
            key: 'sub-hanghoa',
            icon: <ShoppingOutlined />,
            label: 'Sản Phẩm & Nguyên Liệu',
            children: [
                // Mục con 1: Quản lý Loại Sản phẩm
                { key: '/admin/loaisanpham', icon: <TableOutlined />, label: 'Danh mục Loại SP' },
                // Mục con 2: Quản lý Sản phẩm
                { key: '/admin/sanpham', icon: <TableOutlined />, label: 'Quản lý Sản phẩm' },
                // Mục con 3: Quản lý Nguyên liệu
                { key: '/admin/nguyenlieu', icon: <TableOutlined />, label: 'Quản lý Nguyên liệu' },
            ],
        },

        // ---  NHÓM HÓA ĐƠN (SubMenu) ---
        {
            key: 'sub-hoadon',
            icon: <SettingOutlined />,
            label: 'Quản Lý Hóa Đơn',
            children: [
                // Mục con 1: Hóa đơn nhập
                { key: '/admin/hoadonnhap', icon: <TableOutlined />, label: 'Hóa đơn Nhập' },

                // Mục con 2: Hóa đơn bán
                { key: '/admin/hoadonban', icon: <TableOutlined />, label: 'Hóa đơn Bán' },

            ],
        },
        // ---  NHÓM BÁO CÁO - THỐNG KÊ (SubMenu) ---
        {
            key: 'sub-baocao',
            icon: <BarChartOutlined />, // Icon Biểu đồ/Thống kê
            label: 'Thống Kê & Báo Cáo',
            children: [
                { key: '/admin/reports/sales', icon: <LineChartOutlined />, label: 'Báo cáo Doanh thu' },
                { key: '/admin/reports/inventory', icon: <DatabaseOutlined />, label: 'Báo cáo Tồn kho' },
                { key: '/admin/reports/profit', icon: <DollarCircleOutlined />, label: 'Báo cáo Lợi nhuận' },
            ],
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250} collapsedWidth={80}>
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
                    {/* THÊM <Outlet /> ĐỂ HIỂN THỊ NỘI DUNG ROUTE CON */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;