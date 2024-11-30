import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "../Columns/ResearchColumn.jsx";
import "../../table.css";
import DownloadBtn from "../../DownloadBtn.jsx";
import DebouncedInput from "../../DebouncedInput.jsx";
import { SearchIcon, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import LoadingPage from "@/pages/LoadingPage.jsx";
import DrawerComponent from "../../../Forms/AddEntry/DrawerComponent.jsx";
import DeleteDialog from "../../DeleteDialog.jsx";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FacultyResearchTable() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [publicationTypeFilter, setPublicationTypeFilter] = useState("all");

  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        const token = sessionStorage.getItem("teacherAccessToken");
        const response = await axios.get(
          `http://localhost:6005/api/v1/research-paper/allPapers?page=${page}&limit=${pageSize}&publicationType=${publicationTypeFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data.researchPapers);
        setTotalPages(response.data.data.pages);
      } catch (error) {
        console.error("An error occurred while fetching research papers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearchPapers();
  }, [id, page, pageSize, publicationTypeFilter]);

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
    setPublicationTypeFilter("all");
    table.resetColumnVisibility();
  };

  const handleAddEntry = (newData) => {
    setData((prevData) => [...prevData, { ...newData, id: Date.now() }]);
  };

  const handleEditEntry = (updatedData) => {
    setData((prevData) =>
      prevData.map((row) => (row._id === updatedData._id ? updatedData : row))
    );
  };

  const handleDeleteRow = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      await axios.delete(
        `http://localhost:6005/api/v1/research-paper/paper/${rowToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) =>
        prevData.filter((row) => row._id !== rowToDelete._id)
      );
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Failed to delete research paper:", error);
    }
  };

  const calculateSummary = () => {
    const summary = {
      totalPublications: data.length,
      totalUnitPoints: data.reduce((sum, paper) => sum + paper.unitPoints, 0),
      publicationsByType: {
        international: 0,
        national: 0,
        patent: 0,
        book: 0,
        bookChapter: 0,
      },
    };

    data.forEach((paper) => {
      summary.publicationsByType[paper.publicationType]++;
    });

    return summary;
  };

  const summary = calculateSummary();

  const chartData = {
    labels: Object.keys(summary.publicationsByType),
    datasets: [
      {
        label: 'Number of Publications',
        data: Object.values(summary.publicationsByType),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Publications by Type',
      },
    },
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Research Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Publications: {summary.totalPublications}</p>
            <p>Total Unit Points: {summary.totalUnitPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Publications by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={chartData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

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
        <div className="flex items-center gap-2">
          <Label htmlFor="publicationTypeFilter" className="text-sm font-medium">
            Filter by Type:
          </Label>
          <Select
            id="publicationTypeFilter"
            value={publicationTypeFilter}
            onValueChange={setPublicationTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="international">International</SelectItem>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="patent">Patent</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="bookChapter">Book Chapter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DownloadBtn data={data} fileName="Research" />
      </div>

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setRowToEdit(null);
            setDrawerOpen(true);
          }}
          className="add-entry-btn text-white"
        >
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
                {headerGroup.headers.map((header) => (
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
              <tr key={row.original._id}>
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

      <DrawerComponent
        isOpen={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setRowToEdit(null);
        }}
        onSubmit={async (formData) => {
          const token = sessionStorage.getItem("teacherAccessToken");

          try {
            if (rowToEdit) {
              const response = await axios.patch(
                `http://localhost:6005/api/v1/research-paper/paper/${rowToEdit._id}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              handleEditEntry(response.data.data);
            } else {
              const response = await axios.post(
                `http://localhost:6005/api/v1/research-paper/papers`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              handleAddEntry(response.data.data);
            }
          } catch (error) {
            console.error("Failed to submit research data:", error);
          }

          setDrawerOpen(false);
        }}
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
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {page} of {totalPages}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            value={page}
            onChange={(e) => {
              const pageNumber = Math.max(1, Math.min(totalPages, Number(e.target.value)));
              setPage(pageNumber);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <Label htmlFor="pageSize" className="text-sm font-medium">
          Show:
        </Label>
        <Select
          id="pageSize"
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

