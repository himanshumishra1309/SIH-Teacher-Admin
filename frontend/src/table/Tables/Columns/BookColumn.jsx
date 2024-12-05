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
    accessorKey: "segregation",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Segregation
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Select
            onValueChange={(value) => {
              column.setFilterValue(value === "all" ? "" : value)
            }}
          >
            <SelectTrigger className="ml-2 w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="National">National</SelectItem>
              <SelectItem value="Regional">Regional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value
    },
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

