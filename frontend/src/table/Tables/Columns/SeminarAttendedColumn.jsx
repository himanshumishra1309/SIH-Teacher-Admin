import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "topic",
    header: "Topic",
    enableSorting: true,
  },
  {
    accessorKey: "seminarType",
    header: "Type",
    enableSorting: true,
    filterFn: "equals",
    filterElement: ({ column }) => {
      const options =  ['International', 'National', 'State'];
      return (
        <div className="relative z-10">
          <select
            onChange={(e) => {
              console.log("Selected:", e.target.value); // Debugging
              column.setFilterValue(e.target.value || undefined);
            }}
            value={column.getFilterValue() || ""}
            className="p-2 border rounded"
          >
            <option value="" className="text-black">All</option>
            {options.map((option) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    },
    dropdownOptions: ['International', 'National', 'State'], // Dropdown values

  },
  {
    accessorKey: "venue",
    header: "Venue",
    enableSorting: true,
  },
  // {
  //   accessorKey: "duration",
  //   header: "Duration",
  //   enableSorting: true,
  // },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("date");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
    enableSorting: true,
  },
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
