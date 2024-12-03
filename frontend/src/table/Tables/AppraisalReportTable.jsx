import React, { useEffect, useMemo, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { ColumnVisibilityToggle } from "./ColumnVisiblityToggle";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "./Columns/AppraisalReportColumn";
import "../table.css";
import DebouncedInput from "../DebouncedInput.jsx";
import { SearchIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import axios from "axios";

export default function AppraisalReportTable() {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [appraisalData, setAppraisalData] = useState([]);

  const endpoints = {
    journals: "http://localhost:6005/api/v1/points/journals",
    books: "http://localhost:6005/api/v1/points/books",
    patents: "http://localhost:6005/api/v1/points/patents",
    // sttp: "http://localhost:6005/api/v1/points/sttp",
    conferences: "http://localhost:6005/api/v1/points/conferences",
    // seminarsConducted: "http://localhost:6005/api/v1/points/seminars-conducted",
    // seminarsAttended: "http://localhost:6005/api/v1/points/seminar-attended",
    // projects: "http://localhost:6005/api/v1/points/projects",
  };

  const [seminarData, setSeminarData] = useState("");
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const token = sessionStorage.getItem("adminAccessToken");

        const response = await axios.get(
          `http://localhost:6005/api/v1/admins/teachers/${id}/seminars/conducted`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Tecaher Seminar Data", response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.log("An error occurred while fetching teacher info.");
      }
    };

    // fetchTeacherInfo();
    fetchAppraisalData();
  }, []);

  const fetchAppraisalData = async () => {
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
          console.log(response);
          return { field: key, ...response.data.data };
        })
      );

      console.log("results", results);

      const formattedData = results.map((item) => ({
        field: item.field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        currentPoints: item.requestedTeacherPoints || 0,
        highestPoints: item.highestPoints || 0,
        rank: item.requestedTeacherRank || 0,
      }));

      console.log("formattedData", formattedData);

      setAppraisalData(formattedData);
    } catch (error) {
      console.error("Error fetching appraisal data:", error.message);
    }
  };

  const columns = useMemo(() => {
    return columnDef.map((col) => {
      if (col.accessorKey === "actions") {
        return {
          ...col,
          cell: ({ row }) => (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setRowToEdit(row.original);
                  setDrawerOpen(true);
                }}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setRowToDelete(row.original);
                  setDeleteDialogOpen(true);
                }}
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
  }, []);

  const table = useReactTable({
    data : appraisalData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const resetFilters = () => {
    setGlobalFilter("");
    setSorting([]);
    table.resetColumnVisibility();
  };

  const handleAddEntry = (newData) => {
    setData((prevData) => [...prevData, { ...newData, id: Date.now() }]);
  };

  const handleEditEntry = (updatedData) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === updatedData.id ? updatedData : row))
    );
  };

  const handleDeleteRow = () => {
    setData((prevData) => prevData.filter((row) => row.id !== rowToDelete.id));
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <SearchIcon className="text-gray-400" />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-64 focus:w-96 duration-300 border-gray-300 focus:border-blue-500"
            placeholder="Search all columns..."
          />
        </div>
        <ColumnVisibilityToggle table={table} />
        <Button
          onClick={resetFilters}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          Reset Filters
        </Button>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers
                  .filter((header) => header.column.id !== "actions") // Filter out the actions column
                  .map((header) => (
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
                {row
                  .getVisibleCells()
                  .filter((cell) => cell.column.id !== "actions") // Filter out the actions cell
                  .map((cell) => (
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

      {/* <div className="flex items-center justify-end mt-4 gap-2">
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
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  );
}
