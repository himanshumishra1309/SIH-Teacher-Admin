import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "topic",
    header: "Topic",
    enableSorting: true,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    enableSorting: true,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("date");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
    enableSorting: true,
  },
  {
    accessorKey: "level",
    header: "Level",
    enableSorting: true,
  },
  {
    accessorKey: "venue",
    header: "Venue",
    enableSorting: true,
  },
  {
    accessorKey: "report",
    header: "View Report",
    cell: ({ row }) => (
      <Button
        onClick={() => window.open(row.getValue("report"), "_blank")}
        className="view-btn"
      >
        View <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
  },
];
