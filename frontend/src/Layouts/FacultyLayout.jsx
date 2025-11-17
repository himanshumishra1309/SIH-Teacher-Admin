import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import axios from "axios";
import FacultyNavigation from "@/components/NavigationSIdeBar/FacultyNavigation";
import TeacherHeader from "@/components/Header/TeacherHeader/TeacherHeader";
import { Footer } from "@/components";
import LoadingPage from "@/pages/LoadingPage";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./loading.css";
import { getAllTables } from "../components/tableUtils";

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
  const [isNavigationFixed, setIsNavigationFixed] = useState(false);
  const [extraTables, setExtraTables] = useState([]); // State to store fetched extra tables

  const location = useLocation();
  const navigation = useNavigation();
  const mainContentRef = useRef(null);
  const navigationRef = useRef(null);

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

        const data = response.data.data;
        setFacultyData({
          name: data.name || "",
          email: data.email || "",
          employee_code: data.employee_code || "",
          department: data.department || "",
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
                  <p className="font-semibold text-lg text-white">{data.name}</p>
                  <p className="text-sm text-blue-100">{data.email}</p>
                  <p className="text-sm text-blue-100">Employee Code: {data.employee_code}</p>
                  <p className="text-sm text-blue-100">Department: {data.department}</p>
                </div>
              </div>
            ),
            duration: 5000,
            className: "bg-gradient-to-r from-blue-700 to-blue-900 border border-blue-300 shadow-lg rounded-lg p-6",
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
        console.error("Error fetching faculty data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [location, toast]);

  // Fetch additional tables for the report
  const fetchAdditionalTables = async () => {
    try {
      const accessToken = sessionStorage.getItem("teacherAccessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get("http://localhost:6005/api/v1/teachers/extraTables", { headers });
      setExtraTables(response.data.tables || []);
    } catch (error) {
      console.error("Error fetching additional tables:", error);
    }
  };

  useEffect(() => {
    fetchAdditionalTables();
  }, []);

  // Function to download tables as a PDF
  const handleDownloadPDF = async () => {
    const pdf = new jsPDF();
    let isFirstPage = true;

    // Get all tables from the current view and additional fetched tables
    const allTables = await getAllTables(extraTables);

    for (const table of allTables) {
      const canvas = await html2canvas(table, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190; // A4 size width in mm (approx)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (!isFirstPage) pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      isFirstPage = false;
    }

    pdf.save("Faculty_Detailed_Report.pdf");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <TeacherHeader />
        <div className="flex flex-1 overflow-hidden">
          <aside
            ref={navigationRef}
            className={`w-68 ${
              isNavigationFixed
                ? "fixed top-0 bottom-0 overflow-y-auto"
                : "relative overflow-y-auto"
            }`}
          >
            <FacultyNavigation />
          </aside>
          <main
            ref={mainContentRef}
            className="flex-1 flex flex-col overflow-hidden min-h-screen ml-68"
          >
            <div className="flex justify-between items-center p-4">
              <h1 className="text-xl font-bold">Faculty Portal</h1>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition"
              >
                Download Detailed Report
              </button>
            </div>
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

export default FacultyLayout;

