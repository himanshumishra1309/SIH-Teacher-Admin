import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import { columnDef } from "../../../table/Tables/Columns/AdminHodColumn.jsx"
import "../../../table/table.css"
import DownloadBtn from "../../../table/DownloadBtn.jsx"
import DebouncedInput from "../../../table/DebouncedInput.jsx"
import { SearchIcon, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"
import DrawerComponent from "../../../Forms/AddEntry/DrawerComponent.jsx"
import DeleteDialog from "../../../table/DeleteDialog.jsx"
import LoadingPage from "@/pages/LoadingPage.jsx"
import axios from "axios"
import AdminHOD1Appraisal from "../../../table/Tables/Admin/AdminHOD1Appraisal.jsx"
import { TargetSettingModal } from "./TargetSettingModal.jsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/hooks/use-toast.js"

function HODAppraisal() {
  const { id } = useParams()
  const [data, setData] = useState([
    {
      id: 1,
      name: "Dr. John Doe",
      department: "Computer Science",
      points: 85,
      lastUpdated: "2024-12-01",
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      department: "Electrical Engineering",
      points: 92,
      lastUpdated: "2024-12-05",
    },
    {
      id: 3,
      name: "Dr. Mark Johnson",
      department: "Mechanical Engineering",
      points: 76,
      lastUpdated: "2024-11-28",
    },
  ])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)
  const [rowToDelete, setRowToDelete] = useState(null)
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedHOD, setSelectedHOD] = useState(null)
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedHODName, setSelectedHODName] = useState("")

  const columns = useMemo(() => {
    return columnDef.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedHOD(row.original.id)
                  }}
                >
                  View Appraisal Report
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedDepartment(row.original.department)
                    setSelectedHODName(row.original.name)
                    setIsTargetModalOpen(true)
                  }}
                >
                  Set Targets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        }
      }
      return col
    })
  }, [])

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
  })

  const handleSaveTargets = (targets, year) => {
    console.log("Saving targets for department:", selectedDepartment);
    console.log("HOD:", selectedHODName);
    console.log("Year:", year);
    console.log("Targets:", targets);
    // Here you would typically update the state or make an API call
    // For now, we'll just log the data and show a toast notification
    toast({
      title: "Targets Saved",
      description: `Targets for ${selectedDepartment} department have been saved for the year ${year}.`,
    })
  };

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">HOD Appraisal System</h1>
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
        {/* <DownloadBtn data={data} fileName="HOD_Appraisals" /> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-500 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-blue-500 text-white"
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-blue-500 text-white"
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
        </div>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="p-2 border rounded"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <TargetSettingModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        department={selectedDepartment}
        hodName={selectedHODName}
        onSaveTargets={handleSaveTargets}
      />

      {selectedHOD && (
        <AdminHOD1Appraisal
          hodId={selectedHOD}
          onClose={() => setSelectedHOD(null)}
        />
      )}
    </div>
  )
}

export default HODAppraisal

