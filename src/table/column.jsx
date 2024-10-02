
import { Button } from "@/components/ui/button";

export const columnDef = [ 
    // {
    // accessorKey : "id",
    // Header: "Id",
    // //footer groups
    //  },

    {
      // Sr. No. Column
      Header: "Sr. No.",
      accessorFn: (row, index) => index + 1, // Dynamically generate Sr. No.
      id: "srNo", // Unique ID for the column
    },
    
     {
        accessorKey : "Title",
        Header: "Title of Research/Publication",
     },
     {
        accessorKey : "Type",
        Header: "Type",
     },
     {
        accessorKey : "Date",
        Header: "Date",
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
    },
];