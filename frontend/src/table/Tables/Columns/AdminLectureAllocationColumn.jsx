import { Button } from "@/components/ui/button";
import { ArrowUpDown } from 'lucide-react';

export const columnDef = [
  {
    accessorKey: "subject_name",
    header: "Subject",
    enableSorting: true,
  },
  {
    accessorKey: "subject_code",
    header: "Course Code",
    enableSorting: true,
  },
  {
    accessorKey: "subject_credit",
    header: "Credits",
    enableSorting: true,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    enableSorting: true,
  },
  {
    accessorKey: "year",
    header: "Year",
    enableSorting: true,
  },
  {
    accessorKey: "min_lectures",
    header: "Minimum Lectures",
    enableSorting: true,
  },
    {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
  },
];


// subject_name , subject_code, subject_credit, year, branch, min_lectures