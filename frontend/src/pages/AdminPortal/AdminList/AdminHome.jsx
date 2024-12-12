import React, { useState, useEffect } from "react";
import { useNavigation, useLocation } from "react-router-dom";
import axios from "axios";

import { Footer } from "@/components";
import FacultyCards from "./FacultyCards";
import { Toaster } from "../../../components/ui/toaster";
import { useToast } from "../../../components/ui/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";
import LoadingPage from "@/pages/LoadingPage";

export default function AdminHome() {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    designation: "",
    avatar: "",
  });

  const { toast } = useToast();
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = sessionStorage.getItem("adminAccessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          "http://localhost:6005/api/v1/admins/me",
          { headers }
        );
        // console.log("Admin data fetched:", response.data);

        const data = response.data.data;
        setAdminData({
          name: data.name || "",
          email: data.email || "",
          designation: data.designation || "",
          avatar: data.avatar || "",
        });

        if (location.state && location.state.justLoggedIn) {
          toast({
            title: (
              <h1 className="text-center text-xl font-semibold text-white mb-2">
                Welcome back!
              </h1>
            ),
            description: (
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-blue-300 shadow-md">
                  <AvatarImage src={data.avatar} alt={data.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                    {data.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="font-semibold text-lg text-white">
                    {data.name}
                  </p>
                  <p className="text-sm text-blue-100">{data.email}</p>
                  <p className="text-sm text-blue-100">
                    Employee Code: {data.employee_code}
                  </p>
                  <p className="text-sm text-blue-100">
                    Department: {data.department}
                  </p>
                </div>
              </div>
            ),
            duration: 5000,
            className:
              "bg-gradient-to-r from-blue-700 to-blue-900 border border-blue-300 shadow-lg rounded-lg p-6",
            action: (
              <button
                className="absolute top-2 right-2 text-white hover:text-gray-300"
                onClick={() => toast.dismiss()}
              >
                ✕
              </button>
            ),
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast({
          title: "Error",
          description:
            "Failed to load your profile data. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };
    fetchProfileData();
  }, [location.state, toast]);

  return (
    <div className="m-2">
      {navigation.state === "loading" ? <LoadingPage /> : <FacultyCards />}
    </div>
  );
}
