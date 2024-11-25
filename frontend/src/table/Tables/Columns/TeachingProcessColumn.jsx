import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "semester",
    header: "semester",
    enableSorting: true,
  },
  {
    accessorKey: "courseCode",
    header: "COurse Code",
    enableSorting: true,
  },
  {
    accessorKey: "lectureScheduled",
    header: "No.of Scheduled Lectures",
    enableSorting: true,
  },
  {
    accessorKey: "heldLecture",
    header: "No.of Lectures held",
    enableSorting: true,
  },
  {
    accessorKey: "points",
    header: "Points earned",
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
