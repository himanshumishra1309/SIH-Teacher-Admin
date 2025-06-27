import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button.jsx";
import "../../../table/table.css";

export default function AdminFacultyWeightageTable() {
  // Hardcoded data
  const [data, setData] = useState([
    { _id: 1, domain: "Research", weightage: 30 },
    { _id: 2, domain: "Academic", weightage: 60 },
    { _id: 3, domain: "Other", weightage: 10 },
  ]);

  // Update weightage in the local state
  const updatePoints = (rowId, newPoints) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === rowId ? { ...item, weightage: newPoints } : item
      )
    );
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "domain",
        header: "Category",
        cell: ({ getValue }) => (
          <strong className="text-gray-800">{getValue()}</strong>
        ),
      },
      {
        accessorKey: "weightage",
        header: "Weightage(in %)",
        cell: ({ row, getValue }) => {
          const [isEditing, setIsEditing] = useState(false);
          const [newPoints, setNewPoints] = useState(getValue());

          const handleSave = () => {
            updatePoints(row.original._id, newPoints);
            setIsEditing(false);
          };

          return isEditing ? (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="border rounded px-2 py-1 w-20 text-center"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                min={0}
              />
              <Button
                onClick={handleSave}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{getValue()}</span>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </Button>
            </div>
          );
        },
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Faculty Weightage Distribution
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
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
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          <strong>{table.getPageCount()}</strong>
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
