import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export const PatentcolumnDef = [
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
  },

  {
    accessorKey: "inventors",
    header: "Inventors",
    enableSorting: true,
  },
  {
    accessorKey: "patentType",
    header: ({ column }) => {
      return (
        <div className="flex flex-col items-start">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-bold"
          >
            Segregation
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Select
          className="text-black"
            onValueChange={(value) => {
              column.setFilterValue(value === "all" ? "" : value)
            }}
          >
            <SelectTrigger className="w-[150px] mt-2 bg-white text-black">
              <SelectValue placeholder="All"/>
            </SelectTrigger>
            <SelectContent className="text-black">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="National">National</SelectItem>
              <SelectItem value="Regional">Regional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    cell: ({ row }) => row.getValue("patentType"),
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value
    },
    dropdownOptions: ["International", "National", "Regional"], // Dropdown values

  },
 {
    accessorKey: "publicationDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          publicationDate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("publicationDate");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
    enableSorting: true,
  },
  {
    accessorKey: "patentOffice",
    header: "Patent Office",
    enableSorting: true,
  },
  {
    accessorKey: "patentNumber",
    header: "Patent Number",
    enableSorting: true,
  },
  {
    accessorKey: "applicationNumber",
    header: "Application Number",
    enableSorting: true,
  }, 
  // {
  //   accessorKey: "report",
  //   header: "View Report",
  //   cell: ({ row }) => (
  //     <Button
  //       onClick={() => window.open(row.getValue("report"), "_blank")}
  //       className="view-btn"
  //     >
  //       View <ExternalLink className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   enableSorting: false,
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
  },
];
