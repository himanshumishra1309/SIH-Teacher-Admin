import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export const columnDef = [
  
  {
    accessorKey: "student_name",
    header: "Student Name",
    enableSorting: true,
  },
  {
    accessorKey: "topic",
    header: "Topic",
    enableSorting: true,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    enableSorting: true,
  },
  {
    accessorKey: "roll_no",
    header: "Roll No",
    enableSorting: true,
  },
// {
//       accessorKey: "mOp",
//     header: "mOp",
//     enableSorting: true,
// },
  {
    accessorKey: "mOp",
    header: "mOp",
    enableSorting: true,
    filterFn: "equals",
    filterElement: ({ column }) => {
      const options = ['Mtech', 'PhD'];
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
    dropdownOptions: ['Mtech', 'PhD'], // Dropdown values

  },
  // {
  //   accessorKey: "mOp",
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex flex-col items-start">
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //           className="px-0 font-bold"
  //         >
  //           Segregation
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //         <Select
  //         className="text-black"
  //           onValueChange={(value) => {
  //             column.setFilterValue(value === "all" ? "" : value)
  //           }}
  //         >
  //           <SelectTrigger className="w-[150px] mt-2 bg-white text-black">
  //             <SelectValue placeholder="All"/>
  //           </SelectTrigger>
  //           <SelectContent className="text-black">
  //             <SelectItem value="all">All</SelectItem>
  //             <SelectItem value="International">Mtech</SelectItem>
  //             <SelectItem value="National">PhD</SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </div>
  //     )
  //   },
  //   cell: ({ row }) => row.getValue("mOp"),
  //   enableSorting: true,
  //   filterFn: (row, id, value) => {
  //     return value === "" || row.getValue(id) === value
      
  //   },
  //   dropdownOptions: ["International", "National", "Regional"], // Dropdown values

  // },
  {
    accessorKey: "academic_year",
    header: "academic_year",
    enableSorting: true,
  },
  {
    accessorKey: "addedOn",
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
      const dateValue = row.getValue("addedOn");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
    enableSorting: true,
  },
  // {
  //   accessorKey: "report",
  //   header: "View Report",
  //   cell: ({ row }) => (
  //     <Button
  //       onClick={() => window.open(row.getValue("URL"), "_blank")}
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
