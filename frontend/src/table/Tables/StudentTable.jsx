"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { studentColumnDef } from "./Columns/StudentTableColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnVisibilityToggle } from "./ColumnVisiblityToggle";
import { Checkbox } from "@/components/ui/checkbox";

export function StudentTable({ data, setSelectedStudents }) {
  const [rowSelection, setRowSelection] = useState({});

  const columns = React.useMemo(() => studentColumnDef, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  // Sync selected rows data to `setSelectedStudents`
  React.useEffect(() => {
    const selectedRows = table
      .getRowModel()
      .rows.filter((row) => rowSelection[row.id]) // Check if the row is selected
      .map((row) => row.original); // Get the original data of the row
    setSelectedStudents(selectedRows);
  }, [rowSelection, setSelectedStudents, table]);

  const handleSelectAll = React.useCallback(() => {
    table.toggleAllRowsSelected(!table.getIsAllRowsSelected());
  }, [table]);

  useEffect(() => {
    console.log(rowSelection);
  }, [rowSelection]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter students..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
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
        <ColumnVisibilityToggle table={table} />
      </div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                  Select
                </th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-slate-500"
                  >
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
              <tr
                key={row.id}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={`Select ${row.original.name}`}
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-slate-700"
                  >
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
          {Object.keys(rowSelection).length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <div className="flex items-center space-x-2">
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
