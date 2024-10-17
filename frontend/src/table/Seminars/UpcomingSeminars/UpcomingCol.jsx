
import { Button } from "@/components/ui/button";

export const UpcomingCol = [ 
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
      cell: ({ row }) => row.index + 1, // Correct Sr. No. after sorting/filtering
    },
    
     {
        accessorKey : "Title",
        Header: "Upcoming Seminars",
        "validation": {
        "type": "string",
        "min": 1,
        "errorMessage": "Seminar Title is required"
        
    }
     },
     {
        accessorKey : "Type",
        Header: "Type",
        "validation": {
      "type": "string",
      "min": 1,
      "errorMessage": "Type is required"
    }
     },
     {
      accessorKey : "Duration",
      Header: "Duration",
      "validation": {
    "type": "string",
    "min": 1,
    "errorMessage": "Duration is required"
  }
   },
     {
        accessorKey : "Date",
        Header: "Date",
        "validation": {
        "type": "date",
        "errorMessage": "Date is required"

    }
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