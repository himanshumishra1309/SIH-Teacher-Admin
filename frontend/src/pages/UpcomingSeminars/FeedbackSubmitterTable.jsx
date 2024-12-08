import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "../../table/Tables/Columns/FeedbackSubmitterColumn";
import { Button } from "@/components/ui/button";
import axios from "axios";

const FeedbackSubmitterTable = ({
  feedback,
  // students = [],
  // setData = () => {},
}) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const updatePost = async () => {
      try {
        // console.log(feedback);
        console.log(feedback.subject_name);
        const teacherAccessToken = sessionStorage.getItem("teacherAccessToken");
        const response = await axios.post(
          `http://localhost:6005/api/v1/lec-feedback/submitters`,
          {
            subject_name: feedback.subject_name,
            subject_code: feedback.subject_code,
            subject_credit: feedback.subject_credit,
            year: feedback.year,
            branch: feedback.branch,
            teacherId: feedback.teacher,
          },
          {
            headers: {
              Authorization: `Bearer ${teacherAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        setData(response.data.data);
      } catch (error) {
        console.error("Error updating the post:", error);
      }
    };
    updatePost();
  }, []);

  const table = useReactTable({
    data,
    columns: columnDef,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: false, // Disable row selection
  });

  useEffect(() => {
    if (setData) {
      const selectedRows = table.getRowModel().rows.map((row) => row.original); // No filtering for selection
      setData(selectedRows);
    }
  }, []);

  const handleSelectAll = () => {
    const isAllSelected = table.getIsAllRowsSelected();
    table.toggleAllRowsSelected(!isAllSelected);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"></div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
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
          {Object.keys(rowSelection).length} of {data?.length || 0} row(s)
          available
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
            onChange={(e) => table.setPageSize(Number(e.target.value))}
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

export default FeedbackSubmitterTable;
