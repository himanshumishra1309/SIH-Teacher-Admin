import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from 'lucide-react';

export const columnDef = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          onClick={() => {
            // Edit logic will be handled in the parent component
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            // Delete logic will be handled in the parent component
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];

