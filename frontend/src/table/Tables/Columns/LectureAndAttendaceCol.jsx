import { useMemo } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Eye, EyeOff } from "lucide-react";

export const columnDef = [
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
    header: "Mark Attendance",
 
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
