import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";

export const columnDef = [
  {
    accessorKey: "event_name",
    header: "Event",
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: "Type",
    enableSorting: true,
    filterFn: "equals",
    filterElement: ({ column }) => {
      const options =  [
        "Organizer",
        "Speaker",
        "Judge",
        "Coordinator",
        "Volunteer",
        "Evaluator",
        "Panelist",
        "Mentor",
        "Session Chair",
        "Reviewer",
      ];
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
    dropdownOptions:  [
      "Organizer",
      "Speaker",
      "Judge",
      "Coordinator",
      "Volunteer",
      "Evaluator",
      "Panelist",
      "Mentor",
      "Session Chair",
      "Reviewer",
    ], // Dropdown values

  },
  {
    accessorKey: "event_type",
    header: "Type",
    enableSorting: true,
    filterFn: "equals",
    filterElement: ({ column }) => {
      const options = ["National", "International", "State", "College"];
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
    dropdownOptions: ["International", "National", "Regional"], // Dropdown values

  },
  
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
