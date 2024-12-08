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
import { Download } from "lucide-react";
import axios from "axios";
import AppraisalReportTable from "@/table/Tables/AppraisalReportTable";
import { useParams } from "react-router-dom";

const FacultyAppraisalReport = ({
  facultyName,
  facultyDepartment,
  facultyCode,
}) => {
  const [facultyData, setFacultyData] = useState("");
  const [rank, setRank] = useState(null);
  const [point, setPoint] = useState(null);
  const [performance, setPerformance] = useState(null);

  const reportRef = useRef(null);
  const signatureRef = useRef(null);
  const [appraisalData, setAppraisalData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
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
        // console.log(response.data.data);
        setFacultyData(response.data.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Error fetching teacher data:", errorMessage);
      }
    };

    fetchData();
  }, []);
  const id = facultyData._id;

  useEffect(() => {
    if (!facultyData?._id) return; // Avoid fetching if facultyData is not ready

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
        // "Contribution": `http://localhost:6005/api/v1/points/contribution/${id}`,
        // "Seminar-conducted": `http://localhost:6005/api/v1/points/contribution/${id}`,
        // "Seminar-attented": `http://localhost:6005/api/v1/points/seminar-attended/${id}`,
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
            // console.log(`${key} data:`, response.data);
            return { field: key, ...response.data.data };
          })
        );

        const formattedData = results.map((item) => ({
          field: item.field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
          currentPoints: item.requestedTeacherPoints || 0,
          highestPoints: item.highestPoints || 0,
        }));

        // console.log("Formatted appraisal data:", formattedData);
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

        // console.log("Response data:", response.data);
        const matchingTeacher = response.data?.data?.find(
          (teacher) => teacher.teacherId === id
        );

        // console.log(matchingTeacher);

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
    <div className="container mx-auto p-4 relative">
      <Button onClick={handleDownload} className="absolute top-4 right-4 z-10 text-white">
        <Download className="mr-2 h-4 w-4 text-white" /> Download Report
      </Button>
      <div
        ref={reportRef}
        className="mt-16 border-4 border-gray-300 rounded-lg p-8 bg-white shadow-lg max-w-4xl mx-auto"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            Faculty Appraisal Final Report
          </h1>
          <p className="text-gray-600">Academic Year 2023-2024</p>
          <p>Faculty Name: {facultyData.name}</p>
          <p>Faculty Department: {facultyData.department}</p>
          <p>Faculty Code: {facultyData.employee_code}</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Appraisal Points Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                currentPoints: {
                  label: "Current Faculty Points",
                  color: "hsl(var(--chart-1))",
                },
                highestPoints: {
                  label: "Highest Points Scored",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={appraisalData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="field"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="currentPoints"
                    fill="var(--color-currentPoints)"
                    name="Current Faculty"
                  />
                  <Bar
                    dataKey="highestPoints"
                    fill="var(--color-highestPoints)"
                    name="Highest Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Appraisal Data</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Your custom component will go here */}
            <AppraisalReportTable />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Appraisal Rank</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold mb-2">Rank : {rank}</p>
            <p className="text-xl text-gray-600">Performance : {performance}</p>
            <p className="text-xl text-gray-700 font-semibold">
            Points out of 100: {point != null ? point.toFixed(2) : "0"}

</p>
          </CardContent>
        </Card>
        <div>
          <canvas
            ref={signatureRef}
            width="300"
            height="100"
            style={{ border: "1px solid black" }}
          />
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This report is generated automatically and is valid as of{" "}
            {new Date().toLocaleDateString()}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyAppraisalReport;
