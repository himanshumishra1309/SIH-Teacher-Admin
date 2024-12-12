import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "field",
    header: "Fields",
    enableSorting: true,
  },
  {
    accessorKey: "currentPoints",
    header: "Faculty Points",
    enableSorting: true,
  },
  {
    accessorKey: "highestPoints",
    header: "Highest Points",
    enableSorting: true,
  },
  // {
  //   accessorKey: "rank",
  //   header: "Rank",
  //   enableSorting: true,
  // },
];
