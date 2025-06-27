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
    cell: ({ getValue }) => {
      const rawDate = getValue();
      return rawDate ? rawDate.split("T")[0] : "N/A";
    },
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "attendance",
    Header: "View Attendance",
    cell: ({ row }) => (
      <Button
        onClick={() => {
          setViewAttendanceDialogOpen(true);
          setSelectedLecture(row.original);
        }}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View Attendance
      </Button>
    ),
  },
  // {
  //   accessorKey: "actions",
  //   header: "Actions",
  //   enableSorting: false,
  // },
];
