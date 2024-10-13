
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"


export const columnDef = [ 
    // {
    // accessorKey : "id",
    // Header: "Id",
    // //footer groups
    //  },
    {
      Header: "Sr. No.",
      id: "srNo", // Unique ID for the column
      cell: (info) => {
        const rowIndex = info.row.index;  // Use the row index from the sorted model
        return rowIndex + 1;  // Start from 1 instead of 0
      },
      enableSorting: false  // Disable sorting for this column
    },
    
    
     {
        accessorKey : "Title",
        Header: "Title of Research/Publication",
        "validation": {
        "type": "string",
        "min": 1,
        "errorMessage": "Research Title is required"
    },
    enableSorting: false

     },
     {
        accessorKey : "Type",
        Header: "Type",
        "validation": {
      "type": "string",
      "min": 1,
      "errorMessage": "Type is required" 
    },
    enableSorting: false
     },
     {
      header: 'Date',
      // accessorKey: 'entryDate', // or 'Date' based on your data structure
      // header: ({ column }) => {
      //   return (
      //     <Button
      //       variant="ghost"
      //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //     >
      //       Email
      //       <ArrowUpDown className="ml-2 h-4 w-4" />
      //     </Button>
      //   )
      // },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    
      enableSorting: true,
    },

     {
        accessorKey : "View",
        Header: "View Report",
        cell: ({ row }) => {
         const viewUrl = row.original.View; // Access the 'View' field from the row data
         return (
           <Button
             onClick={() => window.open(viewUrl, '_blank')} // Opens the URL in a new tab
             className="view-btn"
           >
             View
           </Button>
         );
       },
       enableSorting: false,

     },

     {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              onClick={() => row.original.onEdit(row.original)} // Pass original row data
            />
            <Button
              className="cursor-pointer"
              onClick={() => row.original.onDelete(row.original)} // Pass original row data
            />
          </div>
        );
      },
      enableSorting: false,

    },
];