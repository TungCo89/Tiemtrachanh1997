/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './component/AdminLayout';
import Dashboard from './page/Dashboard';
import Users from './page/Users/DSUsers';
import NhaCungCap from './page/NhaCungCap/DSNhaCungCap';
import Ban from './page/Ban/DSBan';
import LoaiSanPham from './page/LoaiSanPham/DSLoaiSanPham';
import SanPham from './page/SanPham/DSSanPham';
import NguyenLieu from './page/NguyenLieu/DSNguyenLieu';
import HoaDonNhap from './page/HoaDonNhap/DSHoaDonNhap';
import HoaDonBan from './page/HoaDonBan/DSHoaDonBan';
import ThongKeBaoCao from './page/Thongke-BaoCao/thongke-baocao';
import DangNhap from './page/DangKy-DangNhap/DangNhap';
import DangKy from './page/DangKy-DangNhap/DangKy';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/dangnhap" />} />
                <Route path="dangky" element={<DangKy />} />
                <Route path="dangnhap" element={<DangNhap />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="nhacungcap" element={<NhaCungCap />} />
                    <Route path="ban" element={<Ban />} />
                    <Route path="loaisanpham" element={<LoaiSanPham />} />
                    <Route path="sanpham" element={<SanPham />} />
                    <Route path="nguyenlieu" element={<NguyenLieu />} />
                    <Route path="hoadonnhap" element={<HoaDonNhap />} />
                    <Route path="hoadonban" element={<HoaDonBan />} />
                    <Route path="thongke-baocao" element={<ThongKeBaoCao />} />
                </Route>

                <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
            </Routes>
        </BrowserRouter>

    );
};

export default App;