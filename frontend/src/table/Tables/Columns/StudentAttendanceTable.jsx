import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { studentColumnDef } from "../Columns/StudentAttendanceColumn";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const StudentAttendanceTable = ({ students, selectedStudents, setData }) => {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: students,
    columns: studentColumnDef,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  React.useEffect(() => {
    const selectedRows = table
      .getRowModel()
      .rows.filter((row) => rowSelection[row.id]) // Check if the row is selected
      .map((row) => row.original); // Get the original data of the row
    setData(selectedRows);
  }, [rowSelection, setData, table]);

  const handleSelectAll = () => {
    const isAllSelected = table.getIsAllRowsSelected();
    table.toggleAllRowsSelected(!isAllSelected);
  };

  const handleCheckboxChange = (value, row) => {
    const updatedSelection = { ...rowSelection, [row.id]: value };
    setRowSelection(updatedSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="ml-4"
        >
          {table.getIsAllRowsSelected() ? "Deselect All" : "Select All"}{" "}
          Students
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="px-4 py-2 text-left border-b">Select</th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left border-b">
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
              <tr key={row.id} className="border-b">
                <td className="px-4 py-2">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                      handleCheckboxChange(value, row);
                    }}
                    aria-label={`Select ${row.original.name}`}
                  />
                </td>
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
      <div className="flex items-center justify-between">
        <div>
          {Object.keys(rowSelection).length} of {students.length} row(s)
          selected
        </div>
        <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default StudentAttendanceTable;
