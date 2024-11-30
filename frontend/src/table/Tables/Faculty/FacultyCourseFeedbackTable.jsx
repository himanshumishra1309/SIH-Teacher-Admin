import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "../Columns/FeedbackReleasedColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import LoadingPage from "@/pages/LoadingPage";
import "../../table.css";
export default function FacultyCourseFeedbackTable({ setSelectedCourses }) {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(() => columnDef, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = sessionStorage.getItem("adminAccessToken");

        // Step 1: Fetch all subjects
        const response = await axios.get(
          "http://localhost:6005/api/v1/admins/subjects/allSubjects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currData = response.data.data;
        console.log(response.data.data);

        const updatedData = await Promise.all(
          currData.map(async (subject) => {
            // console.log(subject)
            try {
              const teacherResponse = await axios.get(
                `http://localhost:6005/api/v1/admins/teacher/${subject.teacher}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              // console.log(teacherResponse.data.data.name)
              return {
                ...subject,
                teacherName: teacherResponse.data.data.name,
              };
            } catch (error) {
              console.error(
                `Failed to fetch teacher name for ID: ${subject.teacher}`,
                error
              );
              return {
                ...subject,
                teacherName: "Unknown Teacher",
              };
            }
          })
        );

        // console.log(updatedData)
        setData(updatedData);
      } catch (error) {
        console.error("An error occurred while fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    const selectedData = Object.keys(rowSelection)
      .map((rowId) => {
        const row = table.getRowModel().rows[rowId]?.original;
        if (row) {
          return {
            subjectId: row._id,
            teacherId: row.teacher,
          };
        }
        return null;
      })
      .filter(Boolean);

    console.log(selectedData);
    setSelectedCourses(selectedData);
  }, [rowSelection, setSelectedCourses, table]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
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
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
