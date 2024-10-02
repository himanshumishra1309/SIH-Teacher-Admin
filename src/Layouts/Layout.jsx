// src/Layout.jsx
import React from 'react';
import { Header, Footer } from '../components';
import Home from '@/pages/Home/Home';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* This flex-1 ensures the main content stretches to fill the available space */}
      <main className="flex-1">
        <Home/>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
