// src/Layouts/FacultyLayout.jsx
import FacultyNavigation from '@/components/FacultySidebar/FacultyNavigation';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom'; // Use NavLink for navigation links

function FacultyLayout() {
  return (
    <div className="flex h-full"> {/* Flex container for layout */}
      {/* Sidebar Navigation */}
<FacultyNavigation/>
      {/* Main Content Area */}
      <main className="flex-1 p-4"> {/* Adjust padding and flex-grow here */}
        <h1 className="text-xl font-bold">Admin Portal</h1>
        <Outlet /> {/* Render the BasicTable here */}
      </main>
    </div>
  );
}

export default FacultyLayout;
