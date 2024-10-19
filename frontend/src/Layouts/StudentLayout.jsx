// src/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header,Footer } from '@/components';
import StudentHeader from '@/components/Header/StudentHeader/StudentHeader';

function StudentLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <StudentHeader/>
      {/* This flex-1 ensures the main content stretches to fill the available space */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default StudentLayout;
