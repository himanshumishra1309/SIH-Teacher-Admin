import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columnDef } from "../Columns/FacultyResearchFundingColumn";
import "../../table.css";
import DownloadBtn from "../../DownloadBtn.jsx";
import DebouncedInput from "../../DebouncedInput.jsx";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import LoadingPage from "@/pages/LoadingPage.jsx";
import DrawerComponent from "../../../Forms/AddEntry/DrawerComponent.jsx";
import DeleteDialog from "../../DeleteDialog.jsx";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ColumnVisibilityToggle } from "../ColumnVisiblityToggle";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FacultyResearchFundingTable() {
  const [isActionLoading, setIsActionLoading] = useState(false);
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
  const [researchTypeFilter, setResearchTypeFilter] = useState("all");
  const [fundingFilter, setFundingFilter] = useState("all");

  const { toast } = useToast();

  const fetchResearchFunding = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.get(
        `http://localhost:6005/api/v1/research-funding/all?page=${page}&limit=${pageSize}&researchType=${researchTypeFilter}&fundingAmount=${fundingFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data.researchFunding);
      setTotalPages(response.data.data.pages);
    } catch (error) {
      console.error(
        "An error occurred while fetching research funding data:",
        error
      );
      toast({
        title: "Error",
        description: "Failed to fetch research funding data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, researchTypeFilter, fundingFilter, toast]);

  useEffect(() => {
    fetchResearchFunding();
  }, [fetchResearchFunding]);

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
    setResearchTypeFilter("all");
    setFundingFilter("all");
    table.resetColumnVisibility();
  };

  const handleResearchTypeFilter = useCallback(
    (value) => {
      setResearchTypeFilter(value);
      if (value === "all") {
        table.getColumn("researchType")?.setFilterValue("");
      } else {
        table.getColumn("researchType")?.setFilterValue(value);
      }
    },
    [table]
  );

  const handleFundingFilter = useCallback(
    (value) => {
      setFundingFilter(value);
      if (value === "all") {
        table.getColumn("fundingAmount")?.setFilterValue("");
      } else {
        const [min, max] = value.split("to").map(Number);
        table.getColumn("fundingAmount")?.setFilterValue((fundingAmount) => {
          const amount = parseFloat(fundingAmount);
          if (value === "lessThan5") return amount < 500000;
          if (value === "moreThan100") return amount > 10000000;
          return amount >= min * 100000 && amount <= max * 100000;
        });
      }
    },
    [table]
  );

  const handleAddEntry = async (newData) => {
    try {
      setIsActionLoading(true);
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.post(
        `http://localhost:6005/api/v1/research-funding`,
        newData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) => [...prevData, response.data.data]);
      toast({
        title: "Success",
        description: "New research funding entry added successfully.",
      });
    } catch (error) {
      console.error("Failed to add research funding entry:", error);
      toast({
        title: "Error",
        description: "Failed to add new entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditEntry = async (updatedData) => {
    try {
      setIsActionLoading(true);
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.patch(
        `http://localhost:6005/api/v1/research-funding/${updatedData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData((prevData) =>
        prevData.map((row) =>
          row._id === updatedData._id ? response.data.data : row
        )
      );
      toast({
        title: "Success",
        description: "Research funding entry updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update research funding entry:", error);
      toast({
        title: "Error",
        description: "Failed to update entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteRow = async () => {
    try {
      setIsActionLoading(true);
      const token = sessionStorage.getItem("teacherAccessToken");
      await axios.delete(
        `http://localhost:6005/api/v1/research-funding/${rowToDelete._id}`,
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
      toast({
        title: "Success",
        description: "Research funding entry deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete research funding entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const calculateSummary = () => {
    const summary = {
      totalProjects: data.length,
      totalFunding: data.reduce(
        (sum, project) => sum + parseFloat(project.fundingAmount),
        0
      ),
      projectsByType: {
        international: 0,
        national: 0,
      },
    };

    data.forEach((project) => {
      summary.projectsByType[project.researchType]++;
    });

    return summary;
  };

  const summary = calculateSummary();

  const chartData = {
    labels: Object.keys(summary.projectsByType),
    datasets: [
      {
        label: "Number of Projects",
        data: Object.values(summary.projectsByType),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Projects by Research Type",
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
            <CardTitle>Research Funding Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Projects: {summary.totalProjects}</p>
            <p>
              Total Funding:{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(summary.totalFunding)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects by Research Type</CardTitle>
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
          <Label htmlFor="researchTypeFilter" className="text-sm font-medium">
            Research Type:
          </Label>
          <Select
            id="researchTypeFilter"
            value={researchTypeFilter}
            onValueChange={handleResearchTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="international">International</SelectItem>
              <SelectItem value="national">National</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="fundingFilter" className="text-sm font-medium ml-4">
            Funding Amount:
          </Label>
          <Select
            id="fundingFilter"
            value={fundingFilter}
            onValueChange={handleFundingFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by funding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="lessThan5">Less than 5 Lakhs</SelectItem>
              <SelectItem value="5to10">5 - 10 Lakhs</SelectItem>
              <SelectItem value="10to50">10 - 50 Lakhs</SelectItem>
              <SelectItem value="50to100">50 - 100 Lakhs</SelectItem>
              <SelectItem value="moreThan100">More than 1 Crore</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DownloadBtn data={data} fileName="ResearchFunding" />
      </div>

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setRowToEdit(null);
            setDrawerOpen(true);
          }}
          className="add-entry-btn text-white"
          disabled={isActionLoading}
        >
          {isActionLoading ? "Loading..." : "Add Entry"}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
      <ColumnVisibilityToggle table={table} />
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
              <tr key={row.id}>
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
          setIsActionLoading(true);
          try {
            if (rowToEdit) {
              await handleEditEntry({ ...rowToEdit, ...formData });
            } else {
              await handleAddEntry(formData);
            }
            setDrawerOpen(false);
          } catch (error) {
            console.error("Failed to submit research funding data:", error);
            toast({
              title: "Error",
              description:
                "Failed to submit research funding data. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsActionLoading(false);
          }
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
              const pageNumber = Math.max(
                1,
                Math.min(totalPages, Number(e.target.value))
              );
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
