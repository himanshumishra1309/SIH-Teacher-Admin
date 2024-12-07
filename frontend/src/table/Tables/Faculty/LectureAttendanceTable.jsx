import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "../Columns/LectureAndAttendaceCol"; // Adjust path as necessary
import "../../table.css";
import { Button } from "@/components/ui/button.jsx";
import axios from "axios";
import StudentAttendanceDialog from "@/Forms/Student/StudentAttendanceDialog"; // Adjust path as necessary
import LectureAttendanceDrawer from "@/components/Drawer/LectureAttendanceDrawer";

export default function LectureAndAttendanceTable({ teacherId, subjectId }) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isAttendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [students, setStudents] = useState([]);
const [selectedStudents, setSelectedStudents] = useState([]);
const [isDrawerOpen, setDrawerOpen] = useState(false);



const handleAddLecture = async (lectureData) => {
  try {
    const token = sessionStorage.getItem("teacherAccessToken");
    const response = await axios.post(
      `http://localhost:6005/api/v1/lecture`,
      lectureData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Lecture Added:", response.data);
    setData((prev) => [...prev, response.data]); // Update table data
    setSelectedLecture(response.data); // Store the added lecture for attendance
  } catch (error) {
    console.error("Failed to add lecture:", error);
  }
};


  const handleAttendanceSubmit = async (attendanceData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      await axios.post(
        `http://localhost:6005/api/v1/attendance/${selectedLecture._id}`,
        { attendanceData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Attendance submitted successfully");
      setAttendanceDialogOpen(false);
    } catch (error) {
      console.error("Failed to submit attendance:", error);
    }
  };

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const token = sessionStorage.getItem("teacherAccessToken");

        const response = await axios.get(
          `http://localhost:6005/api/v1/lecture/${subjectId}/${teacherId}/lectures`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("An error occurred while fetching lectures.");
      }
    };

    fetchLecture();
  }, [subjectId, teacherId]);

  useEffect(() => {
    if (selectedLecture) {
      const fetchStudents = async () => {
        try {
          const token = sessionStorage.getItem("teacherAccessToken");
          const response = await axios.get(
            `http://localhost:6005/api/v1/students/${selectedLecture._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStudents(response.data.data);
          setSelectedStudents([]); // Reset selected students
        } catch (error) {
          console.error("Failed to fetch students:", error);
        }
      };
      fetchStudents();
    }
  }, [selectedLecture]);


  const columns = useMemo(() => {
    return columnDef.map((col) => {
      if (col.accessorKey === "attendance") {
        return {
          ...col,
          cell: ({ row }) => (
            <Button
              onClick={() => {
                setSelectedLecture(row.original); // Set lecture for viewing attendance
                setAttendanceDialogOpen(true); // Open the dialog
              }}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Attendance
            </Button>
          ),
        };
      }
      return col;
    });
  }, [columnDef, setSelectedLecture, setAttendanceDialogOpen]);
  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setDrawerOpen(true)}>Add Entry</Button>
      </div>
      <div className="table-container">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LectureAttendanceDrawer
  isOpen={isDrawerOpen}
  onClose={() => setDrawerOpen(false)}
  onSubmit={handleAddLecture}
  selectedLecture={selectedLecture} // Pass the selected lecture
  setAttendanceDialogOpen={setAttendanceDialogOpen} // Pass dialog state handler
/>

    
    <StudentAttendanceDialog
        isOpen={isAttendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
        students={students}
        selectedStudents={selectedStudents}
        setSelectedStudents={setSelectedStudents}
        lectureId={selectedLecture?._id}
        handleMarkAttendance={() => console.log("Attendance marked!")} // Handle attendance submission
      />



    </div>
  );
}
