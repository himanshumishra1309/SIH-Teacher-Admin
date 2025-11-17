import React, { useRef, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileText, Award, PenTool } from 'lucide-react';
import axios from "axios";
import AppraisalReportTable from "@/table/Tables/AppraisalReportTable";
import { useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";

const FacultyAppraisalReport = ({
  facultyName,
  facultyDepartment,
  facultyCode,
}) => {
  const [facultyData, setFacultyData] = useState("");
  const [rank, setRank] = useState(null);
  const [point, setPoint] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setIsLoading] = useState(true);

  const reportRef = useRef(null);
  const signatureRef = useRef(null);
  const [appraisalData, setAppraisalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:6005/api/v1/teachers/me",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(
                "teacherAccessToken"
              )}`,
            },
          }
        );
        setFacultyData(response.data.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Error fetching teacher data:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const id = facultyData._id;

  useEffect(() => {
    if (!facultyData?._id) return;

    const fetchAppraisalData = async () => {
      const id = facultyData._id;

      const endpoints = {
        journals: `http://localhost:6005/api/v1/points/journals/${id}`,
        books: `http://localhost:6005/api/v1/points/books/${id}`,
        chapter: `http://localhost:6005/api/v1/points/chapter/${id}`,
        patents: `http://localhost:6005/api/v1/points/patents/${id}`,
        conferences: `http://localhost:6005/api/v1/points/conferences/${id}`,
        projects: `http://localhost:6005/api/v1/points/projects/${id}`,
        events: `http://localhost:6005/api/v1/points/events/${id}`,
        sttp: `http://localhost:6005/api/v1/points/sttp/${id}`,
        "expert-lectures": `http://localhost:6005/api/v1/points/expert-lectures/${id}`,
        "Student-Guide": `http://localhost:6005/api/v1/points/student-guided/${id}`,
        lecture: `http://localhost:6005/api/v1/points/lecture/${id}`,
      };

      try {
        const results = await Promise.all(
          Object.entries(endpoints).map(async ([key, url]) => {
            const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "teacherAccessToken"
                )}`,
              },
            });
            return { field: key, ...response.data.data };
          })
        );

        const formattedData = results.map((item) => ({
          field: item.field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
          currentPoints: item.requestedTeacherPoints || 0,
        }));

        setAppraisalData(formattedData);
      } catch (error) {
        console.error("Error fetching appraisal data:", error.message);
      }
    };

    fetchAppraisalData();
  }, [facultyData]);

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6005/api/v1/points/teacher-ranks",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(
                "teacherAccessToken"
              )}`,
            },
          }
        );
        console.log(response.data.data);

        const matchingTeacher = response.data?.data?.find(
          (teacher) => teacher.teacherId === id
        );

        if (matchingTeacher) {
          setRank(matchingTeacher.rank);
          setPerformance(matchingTeacher.performanceCategory);
          setPoint(matchingTeacher.totalPoints);
        } else {
          console.log("No matching teacher found for the given facultyId");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Error fetching teacher data:", errorMessage);
      }
    };

    fetchRank();
  }, [id]);

  

  const handleDownload = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("faculty-appraisal-report.pdf");
    });
  };

  useEffect(() => {
    const canvas = signatureRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = "#2563EB";
    context.lineWidth = 2;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const draw = (e) => {
      if (!isDrawing) return;
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(e.offsetX, e.offsetY);
      context.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => (isDrawing = false));
    canvas.addEventListener("mouseout", () => (isDrawing = false));

    return () => {
      canvas.removeEventListener("mousedown", () => {});
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", () => {});
      canvas.removeEventListener("mouseout", () => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 relative">
        <Button
          onClick={handleDownload}
          className="fixed top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white mb-10"
        >
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
        <div
          ref={reportRef}
          className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Faculty Appraisal Final Report
              </h1>
              <p className="text-blue-100 mb-6">Academic Year 2023-2024</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <FileText className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-100">Faculty Name</p>
                  <p className="font-semibold">{facultyData.name}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-100">Department</p>
                  <p className="font-semibold">{facultyData.department}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <FileText className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-blue-100">Employee Code</p>
                  <p className="font-semibold">{facultyData.employee_code}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Chart Section */}
            <Card className="mb-8 shadow-md">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-blue-600">
                  Appraisal Points Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    currentPoints: {
                      label: "Current Faculty Points",
                      color: "hsl(217, 91%, 60%)",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={appraisalData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="field"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: "#4B5563" }}
                      />
                      <YAxis tick={{ fill: "#4B5563" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="currentPoints"
                        fill="#2563EB"
                        name="Current Faculty"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Detailed Data Section */}
            <Card className="mb-8 shadow-md">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-blue-600">Detailed Appraisal Data</CardTitle>
              </CardHeader>
              <CardContent>
                <AppraisalReportTable />
              </CardContent>
            </Card>

            {/* Rank Section
            <Card className="mb-8 shadow-md">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-blue-600">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center py-6">
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 mb-2">Current Rank</p>
                    <p className="text-3xl font-bold text-blue-700">{rank || "N/A"}</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 mb-2">Performance Level</p>
                    <p className="text-3xl font-bold text-blue-700">{performance || "N/A"}</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 mb-2">Total Points</p>
                    <p className="text-3xl font-bold text-blue-700">
                      {point != null ? point.toFixed(2) : "0"}/100
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Signature Section */}
            {/* <div className="mb-8">
              <p className="text-sm text-gray-600 mb-2">Faculty Signature:</p>
              <div className="border border-gray-200 rounded-lg p-4">
                <canvas
                  ref={signatureRef}
                  width="800"
                  height="80"
                  className="border border-gray-300 rounded-md w-full touch-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please sign above using your mouse or touch device
                </p>
              </div>
            </div> */}
            <div>
          <canvas
            ref={signatureRef}
            width="300"
            height="100"
            style={{ border: "1px solid black" }}
          />
        </div>


            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-6">
              <p>
                This report was generated automatically on{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAppraisalReport;

