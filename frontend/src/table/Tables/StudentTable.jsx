import React, { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import { studentColumnDef } from "./Columns/StudentTableColumn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ColumnVisibilityToggle } from "./ColumnVisiblityToggle"
import { Checkbox } from "@/components/ui/checkbox"

export function StudentTable({ data, setSelectedStudents }) {
  const columns = useMemo(() => studentColumnDef, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: {},
    },
  })

  const handleSelectAll = (checked) => {
    const allRows = table.getRowModel().rows
    const selectedIds = checked ? allRows.map(row => row.original._id) : []
    const selectedRows = checked ? allRows : []
    setSelectedStudents(selectedRows)
    allRows.forEach(row => row.toggleSelected(checked))
  }

  const handleSelectRow = (row, checked) => {
    row.toggleSelected(checked)
    const selectedRows = table.getRowModel().rows.filter(r => r.getIsSelected())
    setSelectedStudents(selectedRows)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter students..."
            value={(table.getColumn("name")?.getFilterValue()) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all"
              onCheckedChange={handleSelectAll}
              checked={table.getIsAllRowsSelected()}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All Students
            </label>
          </div>
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
                    onCheckedChange={(checked) => handleSelectRow(row, checked)}
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
      <div className="flex items-center justify-end space-x-2">
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
  )
}

