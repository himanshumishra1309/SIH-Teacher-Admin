// src/Layouts/FacultyLayout.jsx

import { useParams , Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import FacultyNavigation from '@/components/NavigationSIdeBar/FacultyNavigation';
import TeacherHeader from '@/components/TeacherHeader/TeacherHeader';
import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for navigation links
import { Footer } from '@/components';

import "./loading.css"

// ShadCN card components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar component


// Dummy JSON data (assuming the JSON file is placed correctly)
import facultyData from "../pages/FacultyList/facultyData.json" // Adjust the path as needed

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
    <div className="faculty-layout ">
<TeacherHeader />
      {/* Faculty Information Card */}
      <div className="faculty-card p-6  mx-auto">
  <Card className="w-full shadow-lg rounded-lg overflow-hidden">
    <CardHeader className="bg-gray-100 p-4">
      <div className="flex items-center space-x-6">
        {/* Avatar on the left, Name and Department on the right */}
        <Avatar className="w-24 h-24 border-2 border-blue-500 shadow-lg transition-transform transform hover:scale-105 rounded-full">
          <AvatarImage src={facultyInfo.avatarUrl} alt={`${facultyInfo.name}'s Avatar`} />
          <AvatarFallback>{facultyInfo.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-xl font-semibold text-gray-900">{facultyInfo.name}</CardTitle>
          <p className="text-sm text-gray-500">{facultyInfo.department}</p>
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-4">
      <p className="text-gray-700">
        <strong className="text-gray-800">Employee Code:</strong> {facultyInfo.employeeCode}
      </p>
      <p className="text-gray-700">
        <strong className="text-gray-800">Email:</strong> {facultyInfo.email}
      </p>
      <p className="text-gray-700">
        <strong className="text-gray-800">Phone:</strong> {facultyInfo.phone}
      </p>
    </CardContent>

    <CardFooter className="bg-gray-50 p-1 flex justify-end">
      <button className="bg-blue-500 text-white px-4 py-2 m-2 rounded-md hover:bg-blue-600 transition duration-200">
        View Profile
      </button>
    </CardFooter>
  </Card>
</div>



      <main className="flex-1">
    <div className="flex h-full"> {/* Flex container for layout */}
       {/* Sidebar Navigation */}
 <FacultyNavigation/>
      {/* Main Content Area */}
      <main className="flex-1 p-4"> {/* Adjust padding and flex-grow here */}
        <h1 className="text-xl font-bold">Faculty Portal</h1>
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
