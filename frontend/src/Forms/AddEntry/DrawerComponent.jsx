import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";

function DrawerComponent({ isOpen, onClose, onSubmit, columns, rowData }) {
  const [formData, setFormData] = useState({
    name: "",
    publication: "",
    publishedDate: null,
    viewUrl: "",
  });

  const generateSchema = () => {
    const schemaFields = {};
    columns.forEach((col) => {
      if (col.accessorKey && col.accessorKey !== "actions") {
        if (col.accessorKey === "Date") {
          schemaFields[col.accessorKey] = z
            .date()
            .max(new Date(), { message: "Date cannot be in the future" });
        } else if (col.accessorKey === "URL") {
          schemaFields[col.accessorKey] = z
            .string()
            .url({ message: "Invalid URL" });
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
        setValue(key, rowData[key]);
        // -----------------
        setFormData((prev) => ({
          ...prev,
          [key]: rowData[key], // Sync state with incoming data
        }));
      });
    }
  }, [isOpen, rowData, setValue]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (data) => {
    // Prepare data to send to backend
    const newData = {
      name: formData.name,
      publication: formData.publication,
      publishedDate: formData.publishedDate
        ? formData.publishedDate.toISOString()
        : undefined,
      viewUrl: formData.viewUrl,
    };

    try {
      // Retrieve the teacher access token from session storage
      const token = sessionStorage.getItem("teacherAccessToken");

      // Replace '/your-endpoint' with your actual endpoint
      await axios.post(
        "http://localhost:6005/api/v1/research-paper/papers",
        newData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      onClose(); // Close the drawer after submission
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle the error appropriately (e.g., show an error message)
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
              if (col.accessorKey && col.accessorKey !== "actions") {
                return (
                  <div key={col.accessorKey}>
                    <label
                      htmlFor={col.accessorKey}
                      className="block text-sm font-medium mb-1"
                    >
                      {col.header || col.accessorKey}
                    </label>
                    {col.accessorKey === "Date" ? (
                      <DatePicker   
                        selected={watch("Date")}
                        onChange={(date) => {
                          setValue("Date", date);
                          setFormData((prev) => ({
                            ...prev,
                            publishedDate: date,
                          }));
                        }}
                        maxDate={new Date()}
                        className={`w-full p-2 border rounded ${
                          errors.Date ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholderText="Select a date"
                      />
                    ) : (
                      <Input
                        id={col.accessorKey}
                        name={col.accessorKey}
                        {...register(col.accessorKey)}
                        value={formData[col.accessorKey] || ""}
                        onChange={handleInputChange} // Update the state when input changes
                        className={
                          errors[col.accessorKey] ? "border-red-500" : ""
                        }
                        placeholder={`Enter ${col.header || col.accessorKey}`}
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
