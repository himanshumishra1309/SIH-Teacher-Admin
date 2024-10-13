
// src/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../components';
import AdminSideBar from '@/components/NavigationSIdeBar/AdminNavigation';

function AdminLayout() {
  return (
    <div className="flex h-full"> {/* Flex container for layout */}
      {/* Sidebar Navigation */}
<AdminSideBar/>
      {/* Main Content Area */}
      <main className="flex-1 p-4"> {/* Adjust padding and flex-grow here */}
        <h1 className="text-xl font-bold">Admin Portal</h1>
        <Outlet /> {/* Render the BasicTable here */}
      </main>
    </div>
  );
}

export default AdminLayout;
