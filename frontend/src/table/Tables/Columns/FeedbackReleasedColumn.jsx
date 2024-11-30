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
    enableSorting: true,
  },
  {
    accessorKey: "teacherName",
    header: "teacher",
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
    accessorKey: "min_lectures",
    header: "Minimum Lectures",
    enableSorting: true,
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
    enableSorting: true,
  },
];
