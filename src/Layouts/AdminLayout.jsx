
// src/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from '@/components/NavigationSIdeBar/AdminNavigation';
import "./loading.css"
import { Footer } from '@/components';
import { useState, useEffect } from 'react';
import AdminHeader from '@/components/Header/AdminHeader/AdminHeader';


  function AdminLayout() {
    // const [adminInfo, setAdminInfo] = useState(null);
    // const [isLoading, setIsLoading] = useState(true); // Loading state
  
  
    // useEffect(() => {
    //   // Assume you're fetching the faculty data from an API or local storage for a specific user
    //   const admin = adminData[0]; // For now, get the first faculty as an example
    //   if (admin) {
    //     setAdminInfo(admin);
    //   }
    // }, []);
  
    // if(!facultyInfo) {
    //   return (
    //     <div className="spinner-container">
    //       <div className="loading-spinner"></div>
    //     </div>
    //   );
    // }


  return (

    <div className="flex flex-col min-h-screen"> {/* Flex container for layout */}
<AdminHeader/>


    <main className="flex-1">
    <div className="flex h-full"> {/* Flex container for layout */}
       {/* Sidebar Navigation */}
  <AdminNavigation />
      {/* Main Content Area */}
      <main className="flex-1 p-4"> {/* Adjust padding and flex-grow here */}
        <h1 className="text-xl font-bold">Admin Portal</h1>
        <Outlet /> {/* Render the BasicTable here */}
      </main>
    </div>
    </main>


        {/* Footer content */}
        <Footer />

        </div>
  );
}

export default AdminLayout;
