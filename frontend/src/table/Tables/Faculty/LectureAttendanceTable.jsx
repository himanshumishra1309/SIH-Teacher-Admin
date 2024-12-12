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
import StudentAttendanceDialog from "@/Forms/Student/StudentAttendanceDialog"; // For marking attendance
import LectureAttendanceDrawer from "@/components/Drawer/LectureAttendanceDrawer";
import ViewAttendanceDialog from "@/pages/ViewAttendanceDialog";
import DeleteDialog from "@/table/DeleteDialog";

export default function LectureAndAttendanceTable({ teacherId, subjectId }) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isMarkAttendanceDialogOpen, setMarkAttendanceDialogOpen] =
    useState(false); // For "Mark Attendance"
  const [isViewAttendanceDialogOpen, setViewAttendanceDialogOpen] =
    useState(false); // Placeholder for "View Attendance"
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [one, setOne] = useState();

  // Fetch lectures
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
        console.log(response.data);
        setData(response.data.data);
      } catch (error) {
        console.error("An error occurred while fetching lectures.");
      }
    };

    fetchLecture();
  }, [subjectId, teacherId, one]);

  useEffect(() => {
    if (selectedLecture && isMarkAttendanceDialogOpen) {
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
          console.log(response.data);
          setStudents(response.data.data);
          setSelectedStudents([]);
        } catch (error) {
          console.error("Failed to fetch students:", error);
        }
      };
      fetchStudents();
    }
  }, [selectedLecture, isMarkAttendanceDialogOpen]);

  const handleEdit = (row) => {
    setRowToEdit(row);
    setDrawerOpen(true);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  // Memoize columns
  const columns = useMemo(() => {
    return columnDef.map((col) => {
      if (col.accessorKey === "attendance") {
        // Modify the "attendance" column
        return {
          ...col,
          cell: ({ row }) => (
            <Button
              onClick={() => {
                setSelectedLecture(row.original); // Set lecture for viewing attendance
                setViewAttendanceDialogOpen(true); // Open the view attendance dialog
              }}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Attendance
            </Button>
          ),
        };
      }

      if (col.accessorKey === "actions") {
        // Add "Edit" and "Delete" buttons to the existing "actions" column
        return {
          ...col,
          cell: ({ row }) => (
            <div className="flex space-x-2">
              <Button
                onClick={() => handleEdit(row.original)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(row.original)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </Button>
            </div>
          ),
        };
      }

      return col;
    });
  }, [columnDef, setSelectedLecture, setViewAttendanceDialogOpen]);

  // Initialize the table object
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleEditEntry = async (updatedData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.patch(
        `https://facultyappraisal.software/api/v1/lecture/${lectureId}/${teacherId}/lectures`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      setData((prevData) =>
        prevData.map((row) =>
          row._id === updatedData._id ? response.data.data : row
        )
      );
      setDrawerOpen(false);
      setRowToEdit(null);
    } catch (error) {
      console.error("Failed to edit lecture:", error);
    }
  };

  const handleDeleteRow = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      await axios.delete(
        `https://facultyappraisal.software/api/v1/lecture/${subjectId}/${teacherId}/lectures/${rowToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData((prevData) =>
        prevData.filter((row) => row._id !== rowToDelete._id)
      );
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Failed to delete lecture:", error);
    }
  };

  // Add new lecture
  const handleAddLecture = async (lectureData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.post(
        `http://localhost:6005/api/v1/lecture/${subjectId}/${teacherId}/lectures`,
        lectureData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newLecture = response.data;
      setOne(newLecture);
      setSelectedLecture(newLecture);
    } catch (error) {
      console.error("Failed to add lecture:", error);
    }
  };

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ViewAttendanceDialog
        isOpen={isViewAttendanceDialogOpen}
        onClose={() => setViewAttendanceDialogOpen(false)}
        lectureData={selectedLecture}
      />

      <div className="flex items-center justify-end mt-4 gap-2">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Drawer for Adding or Editing Lectures */}
      <LectureAttendanceDrawer
        onClose={() => {
          setDrawerOpen(false);
          setRowToEdit(null);
        }}
        onSubmit={(formData) => {
          if (rowToEdit) {
            handleEditEntry(formData);
          } else {
            handleAddLecture(formData);
          }
        }}
        isOpen={isDrawerOpen}
        selectedLecture={rowToEdit || selectedLecture}
        setAttendanceDialogOpen={setMarkAttendanceDialogOpen}
      />

      {/* Mark Attendance Dialog */}
      <StudentAttendanceDialog
        isOpen={isMarkAttendanceDialogOpen}
        onClose={() => setMarkAttendanceDialogOpen(false)}
        students={students}
        selectedStudents={selectedStudents}
        setSelectedStudents={setSelectedStudents}
        lectureId={selectedLecture?._id}
        handleMarkAttendance={() => console.log("Attendance marked!")} // Handle attendance submission
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRow}
      />

      {/* View Attendance Dialog (Placeholder) */}
      {isViewAttendanceDialogOpen && (
        <div>
          {/* Create your ViewAttendanceDialog component here */}
          <p>View Attendance Dialog (To Be Implemented)</p>
        </div>
      )}
    </div>
  );
}
