import React, { useMemo, useState } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import dataJSON from "./data.json";
import "./table.css";
import DownloadBtn from "@/table/DownloadBtn.jsx";
import DebouncedInput from "@/table/DebouncedInput";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import DrawerComponent from "@/Forms/AddEntry/DrawerComponent.jsx";
import DeleteDialog from "@/table/DeleteDialog";
import ConductedMain from "./ConductedMain.jsx";
import { ConductedColumn } from "./ConductedColumn";

function ConductedTable() {
  // Wrap data in useMemo for avoiding unnecessary re-renders
  const finalColumnDef = useMemo(() => ConductedColumn, []);
  const [data, setData] = useState(dataJSON); // Use dataJSON initially, but update with new entries
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog
  const [rowToEdit, setRowToEdit] = useState(null); // State to hold the row being edited
  const [rowToDelete, setRowToDelete] = useState(null); // State to hold the row being deleted
  const [sorting, setSorting] = useState([{ id: "Date", desc: true }]); // Default sort by Date, descending

  // Function to handle adding a new entry to the table
  const handleAddEntry = (newData) => {
    // Add a new row to the data
    setData((prevData) => [
      ...prevData,
      { ...newData, srNo: prevData.length + 1 }, // Automatically assign the next Sr. No.
    ]);
  };

  // Function to handle editing an existing entry
  const handleEditEntry = (updatedData) => {
    setData(
      (prevData) =>
        prevData.map((row) => (row.id === updatedData.id ? updatedData : row)) // Update entry
    );
  };

  // Function to handle deleting a row
  const handleDeleteRow = () => {
    setData((prevData) => prevData.filter((row) => row.id !== rowToDelete)); // Remove entry
    setDeleteDialogOpen(false); // Close the dialog
    setRowToDelete(null); // Reset the row to delete
  };

  // Setup the table instance with updated data
  const TableInstance = useReactTable({
    columns: finalColumnDef.map((column) => {
      // Enhancing the actions column to include the edit and delete functionality
      if (column.accessorKey === "actions") {
        return {
          ...column,
          cell: ({ row }) => (
            <div className="flex gap-2">
              <Button
                className="cursor-pointer bg-blue-500 text-white"
                onClick={() => {
                  setRowToEdit(row.original); // Set the row data to edit
                  setDrawerOpen(true); // Open the drawer for editing
                }}
              >
                Edit
              </Button>
              <Button
                className="cursor-pointer bg-red-500 text-white"
                onClick={() => {
                  setRowToDelete(row.original.id); // Set the row ID to delete
                  setDeleteDialogOpen(true); // Open delete confirmation dialog
                }}
              >
                Delete
              </Button>
            </div>
          ),
        };
      }
      return column;
    }),
    data: data, // Updated to use dynamic data state
    state: {
      globalFilter,
      sorting, // Add sorting state
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable sorting functionality
  });

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="flex w-full items-center gap-1">
          <SearchIcon />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
            placeholder="Search for all Columns"
          />
        </div>
        <DownloadBtn data={data} fileName="Research" />
      </div>

      {/* Add Entry Button */}
      <div className="flex justify-end m-4">
        <Button onClick={() => setDrawerOpen(true)} className="add-entry-btn">
          Add Entry
        </Button>
      </div>

      {/* Render the table */}
      <table className="m-10 ">
        <thead>
          {TableInstance.getHeaderGroups().map((headerEl) => (
            <tr key={headerEl.id}>
              {headerEl.headers.map((columnEl) => (
                <th
                  key={columnEl.id}
                  colSpan={columnEl.colSpan}
                  onClick={columnEl.column.getToggleSortingHandler()} // Add sorting handler
                  className="cursor-pointer"
                >
                  {flexRender(
                    columnEl.column.columnDef.header,
                    columnEl.getContext()
                  )}
                  {{
                    asc: " 🔼", // Ascending sort indicator
                    desc: " 🔽", // Descending sort indicator
                  }[columnEl.column.getIsSorted()] ?? null}{" "}
                  {/* Show sorting icon */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {TableInstance.getRowModel().rows.map((rowEl) => (
            <tr key={rowEl.id}>
              {rowEl.getVisibleCells().map((cellEl) => (
                <td key={cellEl.id}>
                  {flexRender(
                    cellEl.column.columnDef.cell,
                    cellEl.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Drawer component for adding/editing entry */}
      <DrawerComponent
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={rowToEdit ? handleEditEntry : handleAddEntry} // Use appropriate handler based on context
        columns={finalColumnDef}
        rowData={rowToEdit} // Pass the row data if editing
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteRow}
        rowData={rowToDelete} // Pass the row data to display in dialog
      />

      {/* Pagination controls */}
      <div className="flex items-center justify-end mt-2 gap-2">
        <button
          onClick={() => {
            TableInstance.previousPage();
          }}
          disabled={!TableInstance.getCanPreviousPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            TableInstance.nextPage();
          }}
          disabled={!TableInstance.getCanNextPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {">"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {TableInstance.getState().pagination.pageIndex + 1} of{" "}
            {TableInstance.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to Page:
          <input
            type="number"
            defaultValue={TableInstance.getState().pagination.pageIndex + 1}
            className="border p-1 rounded w-16 bg-transparent"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              TableInstance.setPageIndex(page);
            }}
          />
        </span>
        <span className="font-serif font-semibold">Rows per Page:</span>
        <select
          value={TableInstance.getState().pagination.pageSize}
          onChange={(e) => {
            TableInstance.setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-transparent"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default ConductedTable;
