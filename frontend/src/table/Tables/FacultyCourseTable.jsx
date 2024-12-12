import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ExternalLink, SearchIcon } from 'lucide-react';
import axios from "axios";
import FacultyFeedbackView from "@/pages/FacultyFeedbackView";
import { columnDef } from "./Columns/FacultyCourseColumn";
import LoadingPage from "@/pages/LoadingPage";

export default function FacultyCourseTable() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state


  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = sessionStorage.getItem("teacherAccessToken");
        const response = await axios.get(
          `http://localhost:6005/api/v1/allocated-subjects/subjects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourseData(response.data.data.subjects || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }finally {
        setIsLoading(false); // End loading
      }
    };
    fetchSubjects();
  }, [id]);

  const columns = useMemo(() => {
    return columnDef.map((col) => {
      if (col.accessorKey === "feedbackForm") {
        return {
          ...col,
          cell: ({ row }) => (
            <Button
              onClick={() => {
                setSelectedFeedback(row.original);
                setFeedbackOpen(true);
              }}
              className="view-btn"
            >
              View <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          ),
        };
      }
      return col;
    });
  }, []);

  const table = useReactTable({
    data: courseData,
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

  if (isLoading) {
    return <LoadingPage />; // Display loading component while fetching data
  }

  return (
    <div className="container mx-auto p-4 border rounded-md shadow-lg">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <SearchIcon className="text-gray-400" />
          <Input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-2 bg-transparent outline-none border-b-2 w-64 focus:w-96 duration-300 border-gray-300 focus:border-blue-500"
            placeholder="Search all columns..."
          />
        </div>
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

      <div className="flex items-center justify-end mt-4 gap-2">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
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
          <Input
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
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {isFeedbackOpen && (
        <FacultyFeedbackView
          feedback={selectedFeedback}
          subjectId = {selectedFeedback._id}
          onClose={() => setFeedbackOpen(false)}
          isOpen={isFeedbackOpen}
        />
      )}
    </div>
  );
}







// import React, { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { columnDef } from "./Columns/FacultyCourseColumn";
// import FacultyFeedbackView from "./FacultyFeedbackView"; // Import the modal
// import { useReactTable } from "@tanstack/react-table";
// import axios from "axios";

// export default function FacultyCourseTable() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [courseData, setCourseData] = useState([]);
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [isFeedbackOpen, setFeedbackOpen] = useState(false);

//   // Fetching course data (similar to your existing code)
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const token = sessionStorage.getItem("teacherAccessToken");
//         const response = await axios.get(
//           `http://localhost:6005/api/v1/allocated-subjects/subjects/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setCourseData(response.data.data.subjects || []);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//       }
//     };
//     fetchSubjects();
//   }, [id]);

//   const columns = useMemo(() => {
//     return columnDef.map((col) => {
//       if (col.accessorKey === "feedbackForm") {
//         return {
//           ...col,
//           cell: ({ row }) => {
//             const feedback = row.original.feedback; // Assuming feedback is part of the row data
//             return (
//               <Button
//                 onClick={() => {
//                   setSelectedFeedback(feedback);
//                   setFeedbackOpen(true);
//                 }}
//                 className="view-btn"
//               >
//                 View <ExternalLink className="ml-2 h-4 w-4" />
//               </Button>
//             );
//           },
//         };
//       }
//       return col;
//     });
//   }, [courseData]);

//   const table = useReactTable({
//     data: courseData,
//     columns,
//   });

//   return (
//     <div className="container mx-auto p-4">
//       {/* Table rendering */}
//       <div className="table-container">
//         <table className="w-full">
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th key={header.id} className="px-4 py-2">
//                     {header.isPlaceholder
//                       ? null
//                       : header.render('Header')}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} className="px-4 py-2">
//                     {cell.render('Cell')}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Feedback Modal */}
//       {isFeedbackOpen && (
//         <FacultyFeedbackView
//           feedback={selectedFeedback}
//           onClose={() => setFeedbackOpen(false)}
//         />
//       )}
//     </div>
//   );
// }


















// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, Outlet } from "react-router-dom";

// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import { columnDef } from "./Columns/FacultyCourseColumn";
// import "../table.css";
// import DownloadBtn from "../DownloadBtn.jsx";
// import DebouncedInput from "../DebouncedInput.jsx";
// import { SearchIcon, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button.jsx";
// import { Checkbox } from "@/components/ui/checkbox.jsx";
// import DrawerComponent from "../../Forms/AddEntry/DrawerComponent.jsx";
// import DeleteDialog from "../DeleteDialog.jsx";
// import axios from "axios";

// export default function FacultyCourseTable() {
//   const { id } = useParams();
//   // console.log(id);
//   const [data, setData] = useState("");
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [isDrawerOpen, setDrawerOpen] = useState(false);
//   const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [rowToEdit, setRowToEdit] = useState(null);
//   const [rowToDelete, setRowToDelete] = useState(null);
//   const [sorting, setSorting] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});

//   // data of the teacher email wegera
//   // useEffect(() => {
//   //   const fetchTeacherInfo = async () => {
//   //     try {
//   //       // Retrieve the token from session storage
//   //       const token = sessionStorage.getItem("adminAccessToken"); // Adjust this if using cookies

//   //       const response = await axios.get(
//   //         `http://localhost:6005/api/v1/admins/teachers/${id}`, // Adjust URL to your API endpoint
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${token}`, // Set the Authorization header
//   //           },
//   //         }
//   //       );
//   //       console.log(response.data.data.teacher);
//   //       setTeacherInfo(response.data.data);
//   //     } catch (error) {
//   //       console.log("An error occurred while fetching teacher info.");
//   //     }
//   //   };

//   //   fetchTeacherInfo();
//   // }, [id]); // Runs when 'id' changes

//   // dtaa of the reaserch paper of the teacher aditi sharma

//   const [courseData, setCourseData] = useState("");
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const token = sessionStorage.getItem("teacherAccessToken");
//         const response = await axios.get(
//           `http://localhost:6005/api/v1/allocated-subjects/subjects/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         // console.log(response.data.data);

//         setCourseData(response.data.data.subjects || []);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//       }
//     };
//     fetchSubjects();
//   }, [id]);
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const token = sessionStorage.getItem("adminAccessToken");

//         const response = await axios.get(
//           `http://localhost:6005/api/v1/admins/teachers/${id}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Faculty Course Data", response.data.data.subjects);
//         setData(response.data.data);
//       } catch (error) {
//         console.log("An error occurred while fetching course info.");
//       }
//     };

//     fetchSubjects();
//   }, []);

//   const columns = useMemo(() => {
//     return columnDef.map((col) => {
//       if (col.accessorKey === "actions") {
//         return {
//           ...col,
//           cell: ({ row }) => (
//             <div className="flex gap-2">
//               <Button
//                 onClick={() => {
//                   setRowToEdit(row.original);
//                   setDrawerOpen(true);
//                 }}
//                 className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
//               >
//                 Edit
//               </Button>
//               <Button
//                 onClick={() => {
//                   setRowToDelete(row.original);
//                   setDeleteDialogOpen(true);
//                 }}
//                 className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
//               >
//                 Delete
//               </Button>
//             </div>
//           ),
//         };
//       }
//       return col;
//     });
//   }, []);

//   const table = useReactTable({
//     data : courseData ,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       sorting,
//       globalFilter,
//       columnVisibility,
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnVisibilityChange: setColumnVisibility,
//   });

//   const resetFilters = () => {
//     setGlobalFilter("");
//     setSorting([]);
//     table.resetColumnVisibility();
//   };

//   const handleAddEntry = (newData) => {
//     setData((prevData) => [...prevData, { ...newData, id: Date.now() }]);
//   };

//   const handleEditEntry = (updatedData) => {
//     setData((prevData) =>
//       prevData.map((row) => (row.id === updatedData.id ? updatedData : row))
//     );
//   };

//   const handleDeleteRow = () => {
//     setData((prevData) => prevData.filter((row) => row.id !== rowToDelete.id));
//     setDeleteDialogOpen(false);
//     setRowToDelete(null);
//   };

//   return (
//     <div className="container mx-auto p-4 border rounded-md shadow-lg">
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <SearchIcon className="text-gray-400" />
//           <DebouncedInput
//             value={globalFilter ?? ""}
//             onChange={(value) => setGlobalFilter(String(value))}
//             className="p-2 bg-transparent outline-none border-b-2 w-64 focus:w-96 duration-300 border-gray-300 focus:border-blue-500"
//             placeholder="Search all columns..."
//           />
//         </div>
//         <DownloadBtn data={data} fileName="Research" />
//       </div>

//       <div className="mb-4 flex flex-wrap gap-2">
//         {table.getAllLeafColumns().map((column) => (
//           <div key={column.id} className="flex items-center">
//             <Checkbox
//               checked={column.getIsVisible()}
//               onCheckedChange={(value) => column.toggleVisibility(!!value)}
//               id={column.id}
//             />
//             <label htmlFor={column.id} className="ml-2 text-sm font-medium">
//               {column.id}
//             </label>
//           </div>
//         ))}
//         <Button
//           onClick={resetFilters}
//           variant="outline"
//           size="sm"
//           className="ml-2 text-grey"
//         >
//           Reset Filters
//         </Button>
//       </div>

//       <div className="table-container">
//         <table className="w-full">
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers
//                   .filter((header) => header.column.id !== "actions") // Filter out the actions column
//                   .map((header) => (
//                     <th key={header.id} className="px-4 py-2">
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </th>
//                   ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id}>
//                 {row
//                   .getVisibleCells()
//                   .filter((cell) => cell.column.id !== "actions") // Filter out the actions cell
//                   .map((cell) => (
//                     <td key={cell.id} className="px-4 py-2">
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </td>
//                   ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <DrawerComponent
//         isOpen={isDrawerOpen}
//         onClose={() => {
//           setDrawerOpen(false);
//           setRowToEdit(null);
//         }}
//         onSubmit={rowToEdit ? handleEditEntry : handleAddEntry}
//         columns={columns}
//         rowData={rowToEdit}
//       />

//       <DeleteDialog
//         isOpen={isDeleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         onConfirm={handleDeleteRow}
//         rowData={rowToDelete}
//       />

//       <div className="flex items-center justify-end mt-4 gap-2">
//         <Button
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//         <span className="flex items-center gap-1">
//           <div>Page</div>
//           <strong>
//             {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount()}
//           </strong>
//         </span>
//         <span className="flex items-center gap-1">
//           | Go to page:
//           <input
//             type="number"
//             defaultValue={table.getState().pagination.pageIndex + 1}
//             onChange={(e) => {
//               const page = e.target.value ? Number(e.target.value) - 1 : 0;
//               table.setPageIndex(page);
//             }}
//             className="border p-1 rounded w-16"
//           />
//         </span>
//         <select
//           value={table.getState().pagination.pageSize}
//           onChange={(e) => {
//             table.setPageSize(Number(e.target.value));
//           }}
//         >
//           {[10, 20, 30, 40, 50].map((pageSize) => (
//             <option key={pageSize} value={pageSize}>
//               Show {pageSize}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
