
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columnDef = [

  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },

      {
        accessorKey: "allocated",
        header: "Allocated",
        enableSorting: true,
      },
    
      {
        accessorKey: "h5_index",
        header: "min h5-index",
        enableSorting: true,
      },
      // {
      //   accessorKey: "h5_median",
      //   header: "h5-median",
      //   enableSorting: true,
      // },
      {
        accessorKey: "report",
        header: "View Report",
        cell: ({ row }) => (
          <Button
            onClick={() => window.open(row.getValue("report"), "_blank")}
            className="view-btn"
          >
            View <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
      },
];
























