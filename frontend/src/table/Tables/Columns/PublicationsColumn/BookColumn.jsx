import { Button } from "@/components/ui/button"
import { ArrowUpDown, ExternalLink } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const bookColumnDef = [
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
  },
  {
    accessorKey: "authors",
    header: "Authors",
    enableSorting: true,
  },
  {
    accessorKey: "segregation",
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
    cell: ({ row }) => row.getValue("segregation"),
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
      )
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("publicationDate")
      if (dateValue) {
        const date = new Date(dateValue)
        return date.toLocaleDateString()
      }
      return "N/A"
    },
    enableSorting: true,
  },
  
  {
    accessorKey: "volume",
    header: "Volume",
    enableSorting: true,
  },
  {
    accessorKey: "pages",
    header: "Pages",
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    enableSorting: false,
  },
]

