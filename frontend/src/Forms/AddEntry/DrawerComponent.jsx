import React, { useEffect } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";

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
          // Assuming the key for report is 'reportFile'
          schemaFields[col.accessorKey] = z.instanceof(File).optional();
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
      console.log("Resetting form for Add Entry");
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

    // for (const [key, value] of formData.entries()) {
    //   console.log(`FormData entry - Key: ${key}, Value:`, value);
    // }

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
            {columns.map((col) => {
              if (
                col.accessorKey &&
                col.accessorKey !== "actions" &&
                col.accessorKey !== "View"
              ) {
                return (
                  <div key={col.accessorKey}>
                    <label
                      htmlFor={col.accessorKey}
                      className="block text-sm font-medium mb-1"
                    >
                      {col.header || col.accessorKey}
                    </label>
                    {col.accessorKey === "Date" ||
                    col.accessorKey === "startDate" ||
                    col.accessorKey === "publishedDate" ||
                    col.accessorKey === "publicationDate" ||
                    col.accessorKey === "addedOn" ||
                    col.accessorKey === "endDate" ||
                    col.accessorKey === "date" ? (
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
                      <input
                        type="file"
                        id={col.accessorKey}
                        onChange={(e) =>
                          setValue(col.accessorKey, e.target.files[0] || null)
                        }
                        className={`w-full p-2 border rounded ${
                          errors[col.accessorKey]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
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
