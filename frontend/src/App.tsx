import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './component/AdminLayout';
import Dashboard from './page/Dashboard';
import SanPham from './page/SanPham';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/admin" />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<SanPham />} />
                    {/* <Route path="users" element={<UserManagement />} />  */}
                </Route>
                <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
            </Routes>
        </BrowserRouter>

    );
};

export default App;