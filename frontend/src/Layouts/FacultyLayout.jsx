import React, { useState, useEffect } from "react";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import axios from 'axios';
import FacultyNavigation from "@/components/NavigationSIdeBar/FacultyNavigation";
import TeacherHeader from "@/components/Header/TeacherHeader/TeacherHeader";
import { Footer } from "@/components";
import LoadingPage from "@/pages/LoadingPage";
import "./loading.css";

const FacultyLayout = () => {
  const [facultyData, setFacultyData] = useState({
    name: "",
    email: "",
    employee_code: "",
    department: "",
    avatar: "",
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = sessionStorage.getItem("teacherAccessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          "http://localhost:6005/api/v1/teachers/me",
          { headers }
        );
        console.log("Faculty data fetched:", response.data);

        const data = response.data.data;
        setFacultyData({
          name: data.name || "",
          email: data.email || "",
          employee_code: data.employee_code || "",
          department: data.department || "",
          avatar: data.avatar || "",
        });

        // Check if the user just logged in
        if (location.state && location.state.justLoggedIn) {
          toast({
            title: <h1 className="text-center text-lg">"Welcome back!"</h1>,
            description: (
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarImage src={data.avatar} alt={data.name} />
                  <AvatarFallback className="bg-blue-400 text-white">{data.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="font-semibold text-lg text-gray-800">{data.name}</p>
                  <p className="text-sm text-black">{data.email}</p>
                  <p className="text-sm text-black">Employee Code: {data.employee_code}</p>
                  <p className="text-sm text-black">Department: {data.department}</p>
                </div>
              </div>
            ),
            duration: 5000,
            className: "bg-sky-200 border border-black shadow-lg rounded-lg p-4",
            style: {
              color: 'black',
            },
          });
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };
    fetchProfileData();
  }, [location, toast]);



  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader />
      <main className="flex-1">
        <div className="flex h-full">
          <FacultyNavigation />
          <main className="flex-1 p-4">
            <h1 className="text-xl font-bold text-center">Faculty Portal</h1>
            {navigation.state === "loading" ? <LoadingPage /> : <Outlet />}
          </main>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default FacultyLayout;