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
        accessorKey: "submitter",
        header: "Student Name",
        enableSorting: true,
      },
      {
        accessorKey: "rollNumber",
        header: "Roll No",
        enableSorting: true,
      },
 
];

