import React, { useEffect } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { ExternalLink } from "lucide-react";

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
        } else if (col.accessorKey === "report") {
          schemaFields[col.accessorKey] = z
            .union([z.instanceof(File), z.string().url(), z.string().length(0)])
            .optional();
        }
        // Handle numeric fields
        else if (
          [
            "volume",
            "issue",
            "dailyDuration",
            "duration",
            "daily_duration",
          ].includes(col.accessorKey)
        ) {
          schemaFields[col.accessorKey] = z.coerce
            .number()
            .min(1, { message: `${col.header} must be greater than 0` });
        }
        // Handle authors array
        else if (col.accessorKey === "authors") {
          schemaFields[col.accessorKey] = z
            .string()
            .transform((str) => str.split(",").map((s) => s.trim()))
            .pipe(z.array(z.string().min(1)));
        }
        // Handle journal type enum
        else if (col.accessorKey === "journalType") {
          schemaFields[col.accessorKey] = z.enum([
            "International",
            "National",
            "Regional",
          ]);
        } else if (col.accessorKey === "branch_name") {
          schemaFields[col.accessorKey] = z.enum([
            "CSE",
            "IT",
            "ECE",
            "EEE",
            "MECH",
            "CIVIL",
          ]);
        } else if (col.accessorKey === "projectType") {
          schemaFields[col.accessorKey] = z.enum(["Major", "Minor"]);
        } else {
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
    defaultValues: rowData
      ? {
          ...rowData,
          authors: Array.isArray(rowData.authors)
            ? rowData.authors.join(", ")
            : rowData.authors,
        }
      : {},
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
        } else if (key === "authors") {
          setValue(
            key,
            Array.isArray(rowData[key]) ? rowData[key].join(", ") : rowData[key]
          );
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
    console.log(data);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "report") {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string" && value.startsWith("http")) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value);
      }
    });

    console.log("Editing the data:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Pass the updated report URL back to the parent component
      const updatedData = Object.fromEntries(formData);
      // console.log(updatedData);

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
                  const headerText =
                    typeof col.header === "function"
                      ? col.accessorKey
                      : typeof col.header === "string"
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
                      {col.accessorKey === "journalType" ? (
                        <Select
                          onValueChange={(value) =>
                            setValue(col.accessorKey, value)
                          }
                          value={watch(col.accessorKey) || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select journal type" />
                          </SelectTrigger>
                          <SelectContent>
                            {["International", "National", "Regional"].map(
                              (type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : [
                          "Date",
                          "startDate",
                          "publishedDate",
                          "publicationDate",
                          "addedOn",
                          "endDate",
                          "date",
                        ].includes(col.accessorKey) ? (
                        <DatePicker
                          selected={watch(col.accessorKey)}
                          onChange={(date) => setValue(col.accessorKey, date)}
                          className={`w-full p-2 border rounded ${
                            errors[col.accessorKey]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      ) : [
                          "volume",
                          "issue",
                          "dailyDuration",
                          "duration",
                          "daily_duration",
                        ].includes(col.accessorKey) ? (
                        <Input
                          id={col.accessorKey}
                          type="number"
                          min="1"
                          {...register(col.accessorKey)}
                          className={
                            errors[col.accessorKey] ? "border-red-500" : ""
                          }
                        />
                      ) : col.accessorKey === "authors" ? (
                        <div>
                          <Input
                            id={col.accessorKey}
                            {...register(col.accessorKey)}
                            className={
                              errors[col.accessorKey] ? "border-red-500" : ""
                            }
                            placeholder="Enter authors separated by commas"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Separate multiple authors with commas
                          </p>
                        </div>
                      ) : col.accessorKey === "branch_name" ? (
                        <Select
                          onValueChange={(value) =>
                            setValue(col.accessorKey, value)
                          }
                          value={watch(col.accessorKey) || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select branch name" />
                          </SelectTrigger>
                          <SelectContent>
                            {["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"].map(
                              (type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : col.accessorKey === "projectType" ? (
                        <Select
                          onValueChange={(value) =>
                            setValue(col.accessorKey, value)
                          }
                          value={watch(col.accessorKey) || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Major", "Minor"].map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : col.accessorKey === "report" ? (
                        <div className="space-y-2">
                          {/* {rowData && rowData.report && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">
                                Current file:
                              </span>
                              <a
                                href={rowData.report}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-2"
                              >
                                {rowData.report}
                              </a>
                            </div>
                          )} */}
                          <input
                            type="file"
                            id={col.accessorKey}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setValue(
                                col.accessorKey,
                                file || rowData?.report || ""
                              );
                            }}
                            className={`w-full p-2 border rounded ${
                              errors[col.accessorKey]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          <p className="text-sm text-gray-500">
                            {rowData?.report
                              ? "Choose a file to replace the current report"
                              : "Choose a file"}
                          </p>
                        </div>
                      ) : (
                        <Input
                          id={col.accessorKey}
                          {...register(col.accessorKey)}
                          className={
                            errors[col.accessorKey] ? "border-red-500" : ""
                          }
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
