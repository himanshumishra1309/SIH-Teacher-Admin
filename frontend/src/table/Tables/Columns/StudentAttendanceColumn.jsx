export const studentColumnDef = [
  {
    id: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => row.index + 1,
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

