import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DrawerComponent from "../../../Forms/AddEntry/DrawerComponent.jsx";
import DeleteDialog from "../../DeleteDialog.jsx";
import axios from "axios";
import { CSVLink } from "react-csv";
import { PatentcolumnDef } from "../Columns/PatentColumn.jsx";
import { bookColumnDef } from "../Columns/BookColumn.jsx";
import { JournalColumnDef } from "../Columns/JournalColumn.jsx";
import { conferenceColumnDef } from "../Columns/ConferenceColumn.jsx";
import { chapterColumnDef } from "../Columns/ChapterColumn.jsx";

function ExpandedRowContent({ data2 }) {
  const fieldLabels = {
    TY: "Type",
    T1: "Title",
    A1: "Authors",
    Y1: "Year",
    PB: "Publisher",
    JO: "Journal",
    VL: "Volume",
    IS: "Issue",
    SP: "Start Page",
    EP: "End Page",
    SN: "ISBN/ISSN",
    T2: "Secondary Title",
    UR: "URL",
  };

  const formatValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(data2)
        .filter(([key, value]) => value && value !== "N/A")
        .map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <Label className="font-medium">{fieldLabels[key] || key}</Label>
            <span className="text-sm">{formatValue(key, value)}</span>
          </div>
        ))}
    </div>
  );
}

export default function FacultyResearchTable() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [colu, setColu] = useState(PatentcolumnDef);

  useEffect(() => {
    fetchData();
  }, [typeFilter]);

  const fetchData = async () => {
    const endpointMap = {
      Book: "/api/v1/book/book/",
      BOOK: "/api/v1/book/book/",
      "Book Chapter": "/api/v1/chapter/chapter/",
      "Journal Article": "/api/v1/journals/journal/",
      Patent: "/api/v1/patents/patent/get",
      "Conference Paper": "/api/v1/conferences/conference/get",
    };

    const publicationType = mapPublicationType(typeFilter);

    const endpoint = endpointMap[publicationType];
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.get(`http://localhost:6005${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      setData2(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const mapPublicationType = (type) => {
    const typeMap = {
      Book: "Book",
      "Book Chapter": "Book Chapter",
      "Journal Article": "Journal Article",
      Patent: "Patent",
      "Conference Paper": "Conference Paper",
    };
    return typeMap[type] || "Other";
  };

  const defaultColumn = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row, getValue }) => (
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => row.toggleExpanded()}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="font-medium">{getValue()}</span>
          </div>
        ),
      },
      {
        accessorKey: "authors",
        header: "Author(s)",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "publicationType",
        header: "Publication Type",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "viewUrl",
        header: "View URL",
        cell: ({ getValue }) => {
          const url = getValue();
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setRowToEdit(row.original);
                setDrawerOpen(true);
              }}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setRowToDelete(row.original);
                setDeleteDialogOpen(true);
              }}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const columnMap = {
    Patent: PatentcolumnDef,
    Book: bookColumnDef,
    "Journal Article": JournalColumnDef,
    "Conference Paper": conferenceColumnDef,
    "Book Chapter": chapterColumnDef,
  };

  // Dynamically set column definitions based on typeFilter
  useEffect(() => {
    setColu(columnMap[typeFilter] || []); // Update columnDef based on typeFilter
  }, [typeFilter]); // Triggered when typeFilter changes

  // Fetch data based on typeFilter
  useEffect(() => {
    fetchData();
  }, [typeFilter]); // Re-fetch data whenever typeFilter changes

  // Dynamic table rendering
  const columns = useMemo(() => {
    return colu.map((col) => {
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
  }, [colu]); // Recompute columns whenever colu changes

  // Table configuration
  const table = useReactTable({
    data: data2, // This will update when data2 changes
    columns, // This will update when colu changes
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

  // const filteredRows = React.useMemo(() => {
  //   return table.getRowModel().rows.filter((row) => {
  //     if (typeFilter === "all") return true;
  //     return row.original.type === typeFilter;
  //   });
  // }, [table.getRowModel().rows, typeFilter]);

  const handleAddEntry = async (formData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");

      const type = typeFilter;
      // console.log(type);
      const publicationType = mapPublicationType(type);

      // Determine the API endpoint dynamically]
      // console.log(publicationType);
      const endpointMap = {
        Book: "/api/v1/book/book/add",
        BOOK: "/api/v1/book/book/add",
        "Book Chapter": "/api/v1/chapter/chapter/add",
        "Journal Article": "/api/v1/journals/journal/add",
        Patent: "/api/v1/patents/patent/add",
        "Conference Paper": "/api/v1/conferences/conference/add",
      };

      const endpoint = endpointMap[publicationType];

      // Send the API request to the determined endpoint
      const response = await axios.post(
        `http://localhost:6005${endpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.data);
      setData2((prevData) => [...prevData, response.data.data]);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleEditEntry = async (formData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.patch(
        `http://localhost:6005/api/v1/research-paper/update/${rowToEdit._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData((prevData) =>
        prevData.map((item) =>
          item._id === response.data.data._id ? response.data.data : item
        )
      );
      setDrawerOpen(false);
      setRowToEdit(null);
    } catch (error) {
      console.error("Error editing entry:", error);
    }
  };

  const handleDeleteEntry = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      await axios.delete(
        `http://localhost:6005/api/v1/research-paper/delete/${rowToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) =>
        prevData.filter((item) => item._id !== rowToDelete._id)
      );
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const csvData = useMemo(() => {
    return data2.map((item) => ({
      Title: item.title,
      Authors: item.authors,
      Year: item.year,
      Type: item.type,
      ViewURL: item.viewUrl,
    }));
  }, [data2]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Research Papers</h2>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs"
            placeholder="Search all columns..."
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="type-filter">Filter by Type:</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Book Chapter">Book Chapter</SelectItem>
              <SelectItem value="Journal Article">Journal Article</SelectItem>
              <SelectItem value="Patent">Patent</SelectItem>
              <SelectItem value="Conference Paper">Conference Paper</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".ris"
            onChange={handleRefManUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Upload className="h-4 w-4 mr-2" /> Upload RefMan
          </Button>
          {uploadedFileName && (
            <span className="text-sm text-gray-600">
              Uploaded: {uploadedFileName}
            </span>
          )}
        </div> */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setDrawerOpen(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Entry
          </Button>
          <CSVLink
            data={csvData}
            filename={"research_papers.csv"}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </CSVLink>
        </div>
      </div>

      {/* {data.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              header.column.getIsSorted() === "desc"
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50 border-b border-gray-200">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-3 text-sm text-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="bg-gray-50 border-b"
                      >
                        <ExpandedRowContent data={row.original.allFields} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No data available. Please upload a RefMan file or add entries.
        </div>
      )}

      {data.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {Math.ceil(
                  filteredRows.length / table.getState().pagination.pageSize
                )}
              </strong>
            </span>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )} */}

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
        onSubmit={rowToEdit ? handleEditEntry : handleAddEntry}
        columns={columns}
        rowData={rowToEdit}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteEntry}
      />
    </div>
  );
}
