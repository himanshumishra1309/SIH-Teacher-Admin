import React, { useState, useEffect } from "react";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import axios from "axios";
import FacultyNavigation from "@/components/NavigationSIdeBar/FacultyNavigation";
import TeacherHeader from "@/components/Header/TeacherHeader/TeacherHeader";
import { Footer } from "@/components";
import LoadingPage from "@/pages/LoadingPage";
import "./loading.css";
import AdminHomeNavigation from "@/components/NavigationSIdeBar/AdminHomeNavigation";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";

const AdminHomeLayout = () => {


//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(true);

//   const location = useLocation();
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const accessToken = sessionStorage.getItem("teacherAccessToken");
//         const headers = {
//           Authorization: `Bearer ${accessToken}`,
//         };
//         const response = await axios.get(
//           "https://facultyappraisal.software/api/v1/teachers/me",
//           { headers }
//         );
//         console.log("Faculty data fetched:", response.data);

//         const data = response.data.data;
//         setFacultyData({
//           name: data.name || "",
//           email: data.email || "",
//           employee_code: data.employee_code || "",
//           department: data.department || "",
//           avatar: data.avatar || "",
//         });

//         if (location.state && location.state.justLoggedIn) {
//           toast({
//             title: (
//               <h1 className="text-center text-xl font-semibold text-white mb-2">
//                 Welcome back!
//               </h1>
//             ),
//             description: (
//               <div className="flex items-center space-x-4">
//                 <Avatar className="h-16 w-16 border-2 border-blue-300 shadow-md">
//                   <AvatarImage src={data.avatar} alt={data.name} />
//                   <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
//                     {data.name.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col space-y-1">
//                   <p className="font-semibold text-lg text-white">{data.name}</p>
//                   <p className="text-sm text-blue-100">{data.email}</p>
//                   <p className="text-sm text-blue-100">Employee Code: {data.employee_code}</p>
//                   <p className="text-sm text-blue-100">Department: {data.department}</p>
//                 </div>
//               </div>
//             ),
//             duration: 5000,
//             className: "bg-gradient-to-r from-blue-700 to-blue-900 border border-blue-300 shadow-lg rounded-lg p-6",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching faculty data:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load your profile data. Please try again later.",
//           variant: "destructive",
//           duration: 5000,
//         });
//       }
//     };
//     fetchProfileData();
//   }, [location, toast]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-68 overflow-y-auto">
            <AdminHomeNavigation/>
          </aside>
          <main className="flex-1 flex flex-col overflow-hidden min-h-screen">
            <h1 className="text-xl font-bold text-center p-4">Admin Portal</h1>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              {navigation.state === "loading" ? <LoadingPage /> : <Outlet />}
            </div>
          </main>
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default AdminHomeLayout