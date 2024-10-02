
// src/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../components';
import AdminSideBar from '@/components/AdminSideBar/AdminSideBar';

function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      {/* This flex-1 ensures the main content stretches to fill the available space */}
      <main className="flex-1">
        <AdminSideBar />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AdminLayout;
