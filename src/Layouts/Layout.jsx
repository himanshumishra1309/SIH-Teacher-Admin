// src/Layouts/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation for current path checking
import { Header, Footer } from '../components';
import Home from '@/pages/Home/Home';

function Layout() {
  const location = useLocation(); // Get the current location

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* This flex-1 ensures the main content stretches to fill the available space */}
      <main className="flex-1">
        {location.pathname === '/' ? <Home /> : <Outlet />} {/* Render Home only at '/' */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
