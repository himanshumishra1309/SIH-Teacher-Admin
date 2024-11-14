import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "subject_name",
    header: "Subject",
    enableSorting: true,
  },
  {
    accessorKey: "subject_code",
    header: "Course Code",
    enableSorting: true,
  },
  {
    accessorKey: "subject_credit",
    header: "Credits",
    enableSorting: true,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    enableSorting: true,
  },
  {
    accessorKey: "year",
    header: "Year",
    enableSorting: true,
  },
  {
    accessorKey: "feedbackForm",
    header: "View Feedback",
    cell: ({ row }) => (
      <Button
        onClick={() => window.open(row.getValue("URL"), "_blank")}
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
