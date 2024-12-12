import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const columnDef = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "subject_name",
    header: "Subject",
    enableSorting: false,
  },
  {
    accessorKey: "teacherName",
    header: "teacher",
    enableSorting: false,
  },
  {
    accessorKey: "subject_code",
    header: "Course Code",
    enableSorting: false,
  },
  {
    accessorKey: "subject_credit",
    header: "Credits",
    enableSorting: false,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    enableSorting: false,
  },
  {
    accessorKey: "year",
    header: "Year",
    enableSorting: false,
  },
  {
    accessorKey: "min_lectures",
    header: "Minimum Lectures",
    enableSorting: false,
  },
  {
    accessorKey: "activeUntil",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Active Until
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("startDate");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
    enableSorting: false,
  },
];
