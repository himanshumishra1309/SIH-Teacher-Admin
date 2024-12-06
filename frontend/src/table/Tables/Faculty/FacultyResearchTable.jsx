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
import { ChevronDown, ChevronRight, ChevronLeft, Search, Plus, Edit, Trash2, Download } from 'lucide-react';
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
import { ResearchInstructionMessage } from "@/components/ResearchInstructionMessage.jsx";

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
  const [typeFilter, setTypeFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  
  const [colu, setColu] = useState(PatentcolumnDef);

  useEffect(() => {
    fetchData();
  }, [typeFilter]);

  const fetchData = async () => {
    if (typeFilter === "") {
      setData2([]);
      return;
    }

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

  const columnMap = {
    Patent: PatentcolumnDef,
    "Book": bookColumnDef,
    "Journal Article": JournalColumnDef,
    "Conference Paper": conferenceColumnDef,
    "Book Chapter": chapterColumnDef,
  };

  useEffect(() => {
    setColu(columnMap[typeFilter] || []);
  }, [typeFilter]);

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
  }, [colu]);

  const table = useReactTable({
    data: data2,
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

  const handleAddEntry = async (formData) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const type = typeFilter;
      const publicationType = mapPublicationType(type);
      const endpointMap = {
        Book: "/api/v1/book/book/add",
        BOOK: "/api/v1/book/book/add",
        "Book Chapter": "/api/v1/chapter/chapter/add",
        "Journal Article": "/api/v1/journals/journal/add",
        Patent: "/api/v1/patents/patent/add",
        "Conference Paper": "/api/v1/conferences/conference/add",
      };
      const endpoint = endpointMap[publicationType];
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
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Book Chapter">Book Chapter</SelectItem>
              <SelectItem value="Journal Article">Journal Article</SelectItem>
              <SelectItem value="Patent">Patent</SelectItem>
              <SelectItem value="Conference Paper">Conference Paper</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

      {data2.length === 0 ? (
        <ResearchInstructionMessage />
      ) : (
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
      )}

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

