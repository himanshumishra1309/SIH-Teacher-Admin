// src/Layouts/FacultyLayout.jsx

import { useParams , Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import FacultyNavigation from '@/components/NavigationSIdeBar/FacultyNavigation';
import TeacherHeader from '@/components/Header/TeacherHeader/TeacherHeader';
import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for navigation links
import { Footer } from '@/components';

import "./loading.css"

// ShadCN card components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar component


// Dummy JSON data (assuming the JSON file is placed correctly)
import facultyData from "../pages/FacultyPortal/FacultyList/facultyData.json" // Adjust the path as needed

const FacultyLayout = () => {
  
  const [facultyInfo, setFacultyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state


  useEffect(() => {
    // Assume you're fetching the faculty data from an API or local storage for a specific user
    const faculty = facultyData[0]; // For now, get the first faculty as an example
    if (faculty) {
      setFacultyInfo(faculty);
    }
  }, []);

  if(!facultyInfo) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    


<div className="flex flex-col min-h-screen"> {/* Flex container for layout */}

<TeacherHeader />
      {/* Faculty Information Card */}

      <main className="flex-1">
    <div className="flex h-full"> {/* Flex container for layout */}
       {/* Sidebar Navigation */}
 <FacultyNavigation/>
      {/* Main Content Area */}
      <main className="flex-1 p-4"> {/* Adjust padding and flex-grow here */}
        <h1 className="text-xl font-bold text-center">Faculty Portal</h1>
        <Outlet /> {/* Render the BasicTable here */}
      </main>
    </div>
    </main>

        {/* Footer content */}
      <Footer />
    </div>

  );
};

export default FacultyLayout;




// import FacultyNavigation from '@/components/FacultySidebar/FacultyNavigation';
// import TeacherHeader from '@/components/TeacherHeader/TeacherHeader';
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { NavLink } from 'react-router-dom'; // Use NavLink for navigation links
// import { Footer } from '@/components';

// function FacultyLayout() {
//   return (

//     <div className="flex flex-col min-h-screen">
//     <TeacherHeader />
//     {/* This flex-1 ensures the main content stretches to fill the available space */}
//     <main className="flex-1">
//     <div className="flex h-full"> {/* Flex container for layout */}
//       {/* Sidebar Navigation */}
// <FacultyNavigation/>
//       {/* Main Content Area */}
//       <main className="flex-1 p-4"> {/* Adjust padding and flex-grow here */}
//         <h1 className="text-xl font-bold">Faculty Portal</h1>
//         <Outlet /> {/* Render the BasicTable here */}
//       </main>
//     </div>
//     </main>
//     <Footer />
//   </div>


//   );
// }

// export default FacultyLayout;
