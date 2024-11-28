import React, { useEffect } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function DrawerComponent({ isOpen, onClose, onSubmit, columns, rowData, calculateScore }) {
  const generateSchema = () => {
    const schemaFields = {};
    columns.forEach((column) => {
      if (column.accessorKey !== "actions" && column.accessorKey !== "score") {
        if (column.type === "date") {
          schemaFields[column.accessorKey] = z.date().nullable();
        } else if (column.type === "number") {
          schemaFields[column.accessorKey] = z.number().nullable();
        } else if (column.type === "select") {
          schemaFields[column.accessorKey] = z.enum(column.options.map(option => option.value));
        } else {
          schemaFields[column.accessorKey] = z.string().min(1, { message: `${column.header} is required` });
        }
      }
    });
    return z.object(schemaFields);
  };

  const schema = generateSchema();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (isOpen) {
      if (rowData) {
        Object.keys(rowData).forEach((key) => {
          if (key === "startDate") {
            setValue(key, rowData[key] ? new Date(rowData[key]) : null);
          } else {
            setValue(key, rowData[key]);
          }
        });
      } else {
        reset({});
      }
    }
  }, [isOpen, rowData, setValue, reset]);

  const handleFormSubmit = (data) => {
    const score = calculateScore(data);
    onSubmit({ ...data, score });
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">
            {rowData ? "Edit Entry" : "Add a New Entry"}
          </h3>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {columns.map((column, index) => {
                if (column.accessorKey !== "actions" && column.accessorKey !== "score") {
                  return (
                    <div key={column.accessorKey} className={index % 2 === 0 ? "col-span-1" : "col-span-1"}>
                      <Label htmlFor={column.accessorKey} className="mb-2 block">
                        {column.header}
                      </Label>
                      {column.type === "date" ? (
                        <Controller
                          name={column.accessorKey}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              selected={field.value}
                              onChange={(date) => field.onChange(date)}
                              placeholderText={`Select ${column.header.toLowerCase()}`}
                              className="w-full p-2 border rounded"
                            />
                          )}
                        />
                      ) : column.type === "select" ? (
                        <Controller
                          name={column.accessorKey}
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`Select ${column.header.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {column.options.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      ) : (
                        <Input
                          id={column.accessorKey}
                          type={column.type || "text"}
                          {...register(column.accessorKey, { valueAsNumber: column.type === "number" })}
                          className="w-full"
                        />
                      )}
                      {errors[column.accessorKey] && (
                        <p className="text-red-500 text-sm mt-1">{errors[column.accessorKey].message}</p>
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
              <Button type="submit">{rowData ? "Save Changes" : "Add Entry"}</Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;

