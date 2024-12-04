import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  // {
  //   accessorKey: "subject_name",
  //   header: "Subject Name",
  //   enableSorting: true,
  // },
  {
    accessorKey: "topic",
    header: "Lecture Topic",
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
          Lecture Date
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
  // {
  //   accessorKey: "actions",
  //   header: "Actions",
  //   enableSorting: false,
  // },
];
