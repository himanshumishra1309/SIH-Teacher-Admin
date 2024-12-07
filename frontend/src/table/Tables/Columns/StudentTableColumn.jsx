import { Checkbox } from "@/components/ui/checkbox";

export const studentColumnDef = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "roll_no",
    header: "Roll No",
  },
  // {
  //   accessorKey: "actions",
  //   header: "Actions",
  //   enableSorting
  // },
];
