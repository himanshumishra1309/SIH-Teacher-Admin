import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "domain",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "weightage",
    header: "Weightage(in %)",
    enableSorting: true,
  }
];
