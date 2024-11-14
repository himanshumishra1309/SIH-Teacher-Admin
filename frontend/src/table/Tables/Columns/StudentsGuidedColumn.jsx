import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "student_name",
    header: "Student Name",
    enableSorting: true,
  },
  {
    accessorKey: "topic",
    header: "Topic",
    enableSorting: true,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    enableSorting: true,
  },
  {
    accessorKey: "roll_no",
    header: "Roll No",
    enableSorting: true,
  },
  {
    accessorKey: "mOp",
    header: "Mop",
    enableSorting: true,
  },
  {
    accessorKey: "academic_year",
    header: "academic_year",
    enableSorting: true,
  },
  {
    accessorKey: "addedOn",
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
      const dateValue = row.getValue("addedOn");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
    enableSorting: true,
  },
  // {
  //   accessorKey: "report",
  //   header: "View Report",
  //   cell: ({ row }) => (
  //     <Button
  //       onClick={() => window.open(row.getValue("URL"), "_blank")}
  //       className="view-btn"
  //     >
  //       View <ExternalLink className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   enableSorting: false,
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
  },
];
