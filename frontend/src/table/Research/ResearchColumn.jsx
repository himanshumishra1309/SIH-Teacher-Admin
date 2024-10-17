import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columnDef = [
  {
    header: "Sr. No.",
    accessorKey: "srNo",
    cell: ({ row }) => row.index + 1,
    enableSorting: false
  },
  {
    accessorKey: "Title",
    header: "Title of Research/Publication",
    enableSorting: true
  },
  {
    accessorKey: "Type",
    header: "Type",
    enableSorting: true
  },
  {
    accessorKey: "Date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("Date");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
    enableSorting: true,
  },
  {
    accessorKey: "View",
    header: "View Report",
    cell: ({ row }) => (
      <Button
        onClick={() => window.open(row.original.View, '_blank')}
        className="view-btn"
      >
        View
      </Button>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          onClick={() => row.original.onEdit(row.original)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          <Edit size={16} />
        </Button>
        <Button
          onClick={() => row.original.onDelete(row.original)}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ),
  },
];