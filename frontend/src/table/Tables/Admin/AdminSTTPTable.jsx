import React, { useEffect, useMemo, useState } from "react";
import { useParams, Outlet } from "react-router-dom";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "../Columns/STTPColumn.jsx";
import "../../table.css";
import DownloadBtn from "../../DownloadBtn.jsx";
import DebouncedInput from "../../DebouncedInput.jsx";
import { SearchIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import DrawerComponent from "../../../Forms/AddEntry/DrawerComponent.jsx";
import DeleteDialog from "../../DeleteDialog.jsx";
import axios from "axios";

export default function AdminSTTPTable() {
  const { id } = useParams();
  // console.log(id);
  const [data, setData] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  // data of the teacher email wegera
  // useEffect(() => {
  //   const fetchTeacherInfo = async () => {
  //     try {
  //       // Retrieve the token from session storage
  //       const token = sessionStorage.getItem("adminAccessToken"); // Adjust this if using cookies

  //       const response = await axios.get(
  //         `http://localhost:6005/api/v1/admins/teachers/${id}`, // Adjust URL to your API endpoint
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Set the Authorization header
  //           },
  //         }
  //       );
  //       console.log(response.data.data.teacher);
  //       setTeacherInfo(response.data.data);
  //     } catch (error) {
  //       console.log("An error occurred while fetching teacher info.");
  //     }
  //   };

  //   fetchTeacherInfo();
  // }, [id]); // Runs when 'id' changes

  // dtaa of the reaserch paper of the teacher aditi sharma

  const [expertLectureData, setExpertLectureData] = useState("");
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const token = sessionStorage.getItem("adminAccessToken");

        const response = await axios.get(
          `http://localhost:6005/api/v1/admins/teachers/${id}/expert-lectures`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Expert LEcture DATA Is", response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.log("An error occurred while fetching teacher info.");
      }
    };

    fetchTeacherInfo();
  }, []);

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
    data,
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
        <DownloadBtn data={data} fileName="Research" />
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setDrawerOpen(true)} className="add-entry-btn">
          Add Entry
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {table.getAllLeafColumns().map((column) => (
          <div key={column.id} className="flex items-center">
            <Checkbox
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              id={column.id}
            />
            <label htmlFor={column.id} className="ml-2 text-sm font-medium">
              {column.id}
            </label>
          </div>
        ))}
        <Button
          onClick={resetFilters}
          variant="outline"
          size="sm"
          className="ml-2"
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

      <DrawerComponent
        isOpen={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setRowToEdit(null);
        }}
        onSubmit={rowToEdit ? handleEditEntry : handleAddEntry}
        columns={columns}
        rowData={rowToEdit}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRow}
        rowData={rowToDelete}
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
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}