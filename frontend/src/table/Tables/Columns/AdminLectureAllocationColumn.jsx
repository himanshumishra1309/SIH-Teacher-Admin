import { Button } from "@/components/ui/button";
import { ArrowUpDown } from 'lucide-react';

export const columnDef = [
  {
    accessorKey: "teacher",
    header: "Teacher",
    enableSorting: true,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    enableSorting: true,
  },
  {
    accessorKey: "class",
    header: "Class",
    enableSorting: true,
  },
  {
    accessorKey: "lectures",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. of Lectures
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "day",
    header: "Day",
    enableSorting: true,
  },
  {
    accessorKey: "time",
    header: "Time",
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
  },
];