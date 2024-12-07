import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ColumnDef } from "./DomainPointsColumn";
import "../../../table.css";
import { Button } from "@/components/ui/button.jsx";
import axios from "axios";

export default function ConferencesDomainTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicationData = async () => {
      try {
        const token = sessionStorage.getItem("adminAccessToken");

        const response = await axios.get(
          `http://localhost:6005/api/v1/domain-points/admin/all-event-points`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch publications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicationData();
  }, []);

  const updatePoints = async (id, newPoints) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");

      const response = await axios.patch(
        `http://localhost:6005/api/v1/publications/${id}`,
        { points: newPoints },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, points: newPoints } : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to update points:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "domain",
        header: "Domain",
        cell: ({ getValue }) => (
          <strong className="text-gray-800">{getValue()}</strong>
        ),
      },
      {
        accessorKey: "points",
        header: "Points",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Publication Points Table
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-semibold text-white"
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
