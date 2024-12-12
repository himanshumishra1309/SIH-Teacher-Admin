import { Button } from "@/components/ui/button"

export const columnDef = [
  {
    id: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button 
          onClick={() => row.toggleExpanded()} 
          variant="outline"
        >
          {row.getIsExpanded() ? 'Hide Details' : 'View Details'}
        </Button>
        <Button 
          onClick={() => row.original.onSetTargets(row.original)}
          variant="secondary"
        >
          Set Targets
        </Button>
      </div>
    ),
  },
]

