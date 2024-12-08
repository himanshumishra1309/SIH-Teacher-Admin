import React, { useEffect } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { ExternalLink } from 'lucide-react';

function DrawerComponent({ isOpen, onClose, onSubmit, columns, rowData }) {
  const generateSchema = () => {
    const schemaFields = {};
    columns.forEach((col) => {
      if (
        col.accessorKey &&
        col.accessorKey !== "actions" &&
        col.accessorKey !== "View"
      ) {
        if (
          [
            "Date",
            "startDate",
            "publishedDate",
            "publicationDate",
            "addedOn",
            "date",
            "endDate",
          ].includes(col.accessorKey)
        ) {
          schemaFields[col.accessorKey] = z.date().nullable();
        }
        else if (col.accessorKey === "report") {
          schemaFields[col.accessorKey] = z.union([
            z.instanceof(File),
            z.string().url(),
            z.string().length(0)
          ]).optional();
        }
        else if (["dailyDuration", "duration"].includes(col.accessorKey)) {
          schemaFields[col.accessorKey] = z.coerce
            .number()
            .min(1, { message: `${col.header} must be greater than 0` });
        }
        else {
          schemaFields[col.accessorKey] = z
            .string()
            .min(1, { message: `${col.header} is required` });
        }
      }
    });
    return z.object(schemaFields);
  };

  const schema = generateSchema();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: rowData || {},
  });

  useEffect(() => {
    if (isOpen && rowData) {
      Object.keys(rowData).forEach((key) => {
        if (
          [
            "Date",
            "startDate",
            "publishedDate",
            "publicationDate",
            "addedOn",
            "date",
            "endDate",
          ].includes(key)
        ) {
          setValue(key, rowData[key] ? new Date(rowData[key]) : null);
        } else {
          setValue(key, rowData[key]);
        }
      });
    }
  }, [isOpen, rowData, setValue]);

  useEffect(() => {
    if (isOpen && !rowData) {
      Object.keys(watch()).forEach((key) => setValue(key, ""));
    }
  }, [isOpen, rowData, setValue, watch]);

  const handleFormSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "report") {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string" && value.startsWith("http")) {
          formData.append(key, value);
        }
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    });

    try {
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {rowData ? "Edit Entry" : "Add a New Entry"}
          </h3>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {columns.map((col) => {
                if (
                  col.accessorKey &&
                  col.accessorKey !== "actions" &&
                  col.accessorKey !== "View"
                ) {
                  const headerText = typeof col.header === 'function'
                    ? col.accessorKey
                    : typeof col.header === 'string'
                      ? col.header
                      : col.accessorKey;

                  return (
                    <div key={col.accessorKey}>
                      <label
                        htmlFor={col.accessorKey}
                        className="block text-sm font-medium mb-1"
                      >
                        {headerText}
                      </label>
                      {col.dropdownOptions ? (
                        <Select
                          onValueChange={(value) => setValue(col.accessorKey, value)}
                          value={watch(col.accessorKey) || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Select ${headerText}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {col.dropdownOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : ["Date", "startDate", "publishedDate", "publicationDate", "addedOn", "endDate", "date"].includes(col.accessorKey) ? (
                        <DatePicker
                          selected={watch(col.accessorKey)}
                          onChange={(date) => setValue(col.accessorKey, date)}
                          className={`w-full p-2 border rounded ${
                            errors[col.accessorKey]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      ) : col.accessorKey === "report" ? (
                        <div className="space-y-2">
                          {rowData && rowData.report && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-500">Current file:</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(rowData.report, '_blank')}
                                className="flex items-center gap-2"
                              >
                                View Report <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <input
                            type="file"
                            id={col.accessorKey}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setValue(col.accessorKey, file);
                              }
                            }}
                            className={`w-full p-2 border rounded ${
                              errors[col.accessorKey]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          <p className="text-sm text-gray-500">
                            {rowData?.report ? "Upload new file to replace current one" : "Choose a file"}
                          </p>
                        </div>
                      ) : ["dailyDuration", "duration"].includes(col.accessorKey) ? (
                        <Input
                          id={col.accessorKey}
                          type="number"
                          min="1"
                          {...register(col.accessorKey)}
                          className={errors[col.accessorKey] ? "border-red-500" : ""}
                        />
                      ) : (
                        <Input
                          id={col.accessorKey}
                          {...register(col.accessorKey)}
                          className={errors[col.accessorKey] ? "border-red-500" : ""}
                        />
                      )}
                      {errors[col.accessorKey] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[col.accessorKey].message}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                {rowData ? "Save Changes" : "Add Entry"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;

