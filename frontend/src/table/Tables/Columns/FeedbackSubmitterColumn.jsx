import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
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

