import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function ColumnVisibilityToggle({ table }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleVisibility = (column, value) => {
    column.toggleVisibility(!!value); // Toggle column visibility
  };

  const handleCheckboxClick = (e) => {
    e.preventDefault(); // Prevent the dropdown from closing
    e.stopPropagation(); // Stop the click from bubbling to other elements
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={(state) => setIsOpen(state)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {table.getAllLeafColumns().map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => handleToggleVisibility(column, value)}
            onClick={handleCheckboxClick} // Keep the dropdown open
          >
            {column.columnDef.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
