import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

export const columnDef = [
  {
    accessorKey: "name",
    header: "Project Name",
    type: "text",
  },
  {
    accessorKey: "researchType",
    header: "Research Type",
    type: "select",
    options: [
      { value: "international", label: "International" },
      { value: "national", label: "National" },
    ],
  },
  {
    accessorKey: "fundingAmount",
    header: "Funding Amount",
    type: "number",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("fundingAmount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "fundingAgency",
    header: "Funding Agency",
    type: "text",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    type: "date",
    cell: ({ row }) => {
      const dateValue = row.getValue("startDate");
      if (dateValue) {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      }
      return "N/A";
    },
  },
  {
    accessorKey: "duration",
    header: "Duration (months)",
    type: "number",
  },
  {
    accessorKey: "status",
    header: "Project Status",
    type: "select",
    options: [
      { value: "ongoing", label: "Ongoing" },
      { value: "completed", label: "Completed" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    accessorKey: "coInvestigators",
    header: "Co-Investigators",
    type: "text",
  },
  {
    accessorKey: "score",
    header: "Score",
    type: "number",
  },
  {
    accessorKey: "viewUrl",
    header: "View Report",
    cell: ({ row }) => (
      <Button
        onClick={() => window.open(row.getValue("viewUrl"), "_blank")}
        className="view-btn text-white"
      >
        View <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];

