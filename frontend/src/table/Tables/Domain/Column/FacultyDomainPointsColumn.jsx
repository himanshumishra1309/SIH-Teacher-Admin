import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const ColumnDef = [
  {
    accessorKey: "domain",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Domain
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "points",
    header: "Points",
    enableSorting: true,
  }
];
