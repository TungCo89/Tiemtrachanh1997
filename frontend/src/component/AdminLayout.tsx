import React, { useEffect, useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, ShoppingOutlined, UserOutlined, TableOutlined, SettingOutlined, BarChartOutlined, LogoutOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, MenuProps, Dropdown, Avatar, Space } from 'antd';

const { Header, Sider, Content } = Layout;

const ROLE_ADMIN = 1;
const ROLE_STAFF = 2;

interface CustomMenuItem {
    key: string;
    icon?: React.ReactNode;
    label: string;
    requiredRole: number[];
    children?: CustomMenuItem[];
}

interface UserInfo {
    id_vai_tro: number;
    ten_dang_nhap: string;
}

type MenuItem = NonNullable<MenuProps['items']>[number];

// Hàm tiện ích để đọc thông tin người dùng từ Local Storage
const getUserInfoFromStorage = (): UserInfo => {
    try {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            return {
                id_vai_tro: userInfo.id_vai_tro || ROLE_STAFF,
                ten_dang_nhap: userInfo.ten_dang_nhap || 'Người dùng',
            }; 
        }
    } catch (e) {
        console.error("Lỗi khi đọc Local Storage:", e);
    }
    return { id_vai_tro: ROLE_STAFF, ten_dang_nhap: 'Nhân viên' }; 
};

const filterMenuItems = (items: CustomMenuItem[], roleId: number): CustomMenuItem[] => {
    const accessibleItems = items.filter(item => item.requiredRole.includes(roleId));

    return accessibleItems.map(item => {
        if (item.children) {
            const filteredChildren = item.children.filter(child => child.requiredRole.includes(roleId));
            return { ...item, children: filteredChildren };
        }
        return item;
    });
};

const mapCustomToAntdMenu = (customItems: CustomMenuItem[]): MenuItem[] => {
    return customItems.map(item => {
        const antdItem: MenuItem = {
            key: item.key,
            icon: item.icon,
            label: item.label,
        } as MenuItem;

        if (item.children && item.children.length > 0) {
            (antdItem as any).children = mapCustomToAntdMenu(item.children);
        }
        
        return antdItem;
    }).filter((item): item is MenuItem => !!item);
};

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState<UserInfo>({ id_vai_tro: ROLE_STAFF, ten_dang_nhap: 'Nhân viên' });

    useEffect(() => {
        const info = getUserInfoFromStorage();
        setUserInfo(info);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/dangnhap');
    };
    
    // Menu Dropdown cho Avatar
    const profileMenuItems: MenuProps['items'] = [
        // {
        //     key: '1',
        //     label: 'Thông tin tài khoản',
        //     icon: <InfoCircleOutlined />,
        //     onClick: () => {
        //         navigate('/admin/profile');
        //     },
        // },
        {
            key: '2',
            danger: true,
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    const menuItems: CustomMenuItem[] = [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard', requiredRole: [ROLE_ADMIN, ROLE_STAFF] },
        
        { key: '/admin/users', icon: <UserOutlined />, label: 'Danh sách Người dùng', requiredRole: [ROLE_ADMIN] },

        { key: '/admin/nhacungcap', icon: <UserOutlined />, label: 'Danh sách Nhà cung cấp', requiredRole: [ROLE_ADMIN] },

        { key: '/admin/ban', icon: <SettingOutlined />, label: 'Quản lý Bàn' , requiredRole: [ROLE_ADMIN, ROLE_STAFF] },

        {
            key: 'sub-hanghoa',
            icon: <ShoppingOutlined />,
            label: 'Sản Phẩm & Nguyên Liệu',
            requiredRole: [ROLE_ADMIN, ROLE_STAFF], 
            children: [
                { key: '/admin/loaisanpham', icon: <TableOutlined />, label: 'Danh mục Loại SP', requiredRole: [ROLE_ADMIN] },
                { key: '/admin/sanpham', icon: <TableOutlined />, label: 'Quản lý Sản phẩm', requiredRole: [ROLE_ADMIN, ROLE_STAFF] },
                { key: '/admin/nguyenlieu', icon: <TableOutlined />, label: 'Quản lý Nguyên liệu', requiredRole: [ROLE_ADMIN] },
            ],
        },

        {
            key: 'sub-hoadon',
            icon: <SettingOutlined />,
            label: 'Quản Lý Hóa Đơn',
            requiredRole: [ROLE_ADMIN, ROLE_STAFF], 
            children: [
                { key: '/admin/hoadonnhap', icon: <TableOutlined />, label: 'Hóa đơn Nhập',requiredRole: [ROLE_ADMIN] },

                { key: '/admin/hoadonban', icon: <TableOutlined />, label: 'Hóa đơn Bán', requiredRole: [ROLE_ADMIN, ROLE_STAFF] },

            ],
        },
        { key: '/admin/thongke-baocao', icon: <BarChartOutlined />, label: 'Thống Kê & Báo Cáo', requiredRole: [ROLE_ADMIN, ROLE_STAFF] },
    ];
    
    const filteredMenuItems = filterMenuItems(menuItems, userInfo.id_vai_tro);
    const finalMenuItems = mapCustomToAntdMenu(filteredMenuItems);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250} collapsedWidth={80}>
                <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={finalMenuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
                    {/* Nút Toggle Sidebar */}
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    
                    {/* Tên người dùng và Dropdown Profile */}
                    <Dropdown menu={{ items: profileMenuItems }} trigger={['click']} placement="bottomRight">
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Space size="middle">
                                {/* Hiển thị tên người dùng */}
                                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                    {userInfo.ten_dang_nhap}
                                </span>
                                {/* Avatar người dùng */}
                                <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            </Space>
                        </div>
                    </Dropdown>
                </Header>
                <Content
                    style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
