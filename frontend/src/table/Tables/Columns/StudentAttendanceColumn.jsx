// StudentAttendanceColumn.jsx
import { Checkbox } from "@/components/ui/checkbox";

export const studentColumnDef = [
    {
        id: "srNo", // Unique ID for the column
        header: "Sr. No.",
        cell: ({ row }) => row.index + 1, // Automatically calculate the serial number
        enableSorting: false, // Disable sorting for this column
        enableHiding: false, // Prevent hiding
      },
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
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "roll_no",
    header: "Roll No",
    enableSorting: true,
  },
];

export default studentColumnDef;
