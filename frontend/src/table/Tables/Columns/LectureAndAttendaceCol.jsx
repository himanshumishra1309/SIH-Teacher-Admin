import { useMemo } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Eye, EyeOff } from "lucide-react";

export const columnDef = [
  {
    id: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "attendance",
    header: "View Attendance",
 
  },

];
