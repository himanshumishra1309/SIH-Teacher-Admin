import React, { useEffect, useState } from "react";
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
import axios from "axios";

// const publicationData = [
//   {
//     name: "Nature",
//     h5Index: 488,
//     h5Median: 745,
//   },
//   {
//     name: "IEEE/CVF Conference on Computer Vision and Pattern Recognition",
//     h5Index: 440,
//     h5Median: 689,
//   },
//   {
//     name: "The New England Journal of Medicine",
//     h5Index: 434,
//     h5Median: 897,
//   },
//   {
//     name: "Science",
//     h5Index: 409,
//     h5Median: 633,
//   },
//   {
//     name: "Nature Communications",
//     h5Index: 375,
//     h5Median: 492,
//   },
//   {
//     name: "The Lancet",
//     h5Index: 368,
//     h5Median: 678,
//   },
//   {
//     name: "Neural Information Processing Systems",
//     h5Index: 337,
//     h5Median: 614,
//   },
//   {
//     name: "Advanced Materials",
//     h5Index: 327,
//     h5Median: 420,
//   },
//   {
//     name: "Cell",
//     h5Index: 320,
//     h5Median: 482,
//   },
//   {
//     name: "International Conference on Learning Representations",
//     h5Index: 304,
//     h5Median: 584,
//   },
//   {
//     name: "JAMA",
//     h5Index: 298,
//     h5Median: 498,
//   },
//   {
//     name: "Science of The Total Environment",
//     h5Index: 297,
//     h5Median: 436,
//   },
//   {
//     name: "IEEE/CVF International Conference on Computer Vision",
//     h5Index: 291,
//     h5Median: 484,
//   },
//   {
//     name: "Angewandte Chemie International Edition",
//     h5Index: 281,
//     h5Median: 361,
//   },
//   {
//     name: "Nature Medicine",
//     h5Index: 274,
//     h5Median: 474,
//   },
//   {
//     name: "Journal of Cleaner Production",
//     h5Index: 272,
//     h5Median: 359,
//   },
//   {
//     name: "International Conference on Machine Learning",
//     h5Index: 268,
//     h5Median: 424,
//   },
//   {
//     name: "Chemical Reviews",
//     h5Index: 267,
//     h5Median: 461,
//   },
//   {
//     name: "Proceedings of the National Academy of Sciences",
//     h5Index: 267,
//     h5Median: 405,
//   },
//   {
//     name: "IEEE Access",
//     h5Index: 266,
//     h5Median: 364,
//   },
// ];

function DrawerComponent({ isOpen, onClose, onSubmit, columns, rowData }) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [publicationData, setPublicationData] = useState([]);
  const [pdata, setPdata] = useState([]);

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
        } else if (
          [
            "volume",
            "issue",
            "dailyDuration",
            "duration",
            "daily_duration",
            "h5_index",
            "h5_median",
          ].includes(col.accessorKey)
        ) {
          schemaFields[col.accessorKey] = z.coerce
            .number()
            .min(1, { message: `${col.header} must be greater than 0` });
        } else if (col.accessorKey === "authors") {
          schemaFields[col.accessorKey] = z
            .string()
            .transform((str) => str.split(",").map((s) => s.trim()))
            .pipe(z.array(z.string().min(1)));
        } else if (col.accessorKey === "journalType") {
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
    const fetchTeacherInfo = async () => {
      try {
        const token = sessionStorage.getItem("teacherAccessToken");
        const response = await axios.get(
          `http://localhost:6005/api/v1/publication/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure you send the token as an Authorization header
            },
          }
        );
        // console.log(response.data.data); // Log the response data
        setPublicationData(response.data.data);
      } catch (error) {
        console.error("An error occurred while fetching teacher info:", error);
      }
    };

    fetchTeacherInfo();
  }, [isOpen]); // Dependency array ensures re-execution when isOpen changes

  useEffect(() => {
    if (isOpen && !rowData) {
      Object.keys(watch()).forEach((key) => setValue(key, ""));
    }
  }, [isOpen, rowData, setValue, watch]);

  const handleFormSubmit = (data) => {
    // console.log(data);
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
      const updatedData = Object.fromEntries(formData);
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handlePublicationChange = (value) => {
    setValue("publication", value);
    if (value) {
      const matches = publicationData.filter((pub) =>
        pub.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(matches);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setValue("publication", suggestion.name);
    setValue("h5_index", suggestion.hindex);
    setValue("h5_median", suggestion.median);
    setFilteredSuggestions([]); // Clear the suggestions
    setSelectedPublication(suggestion);
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
                      {col.accessorKey === "publication" ? (
                        <div className="relative">
                          <Input
                            id={col.accessorKey}
                            {...register(col.accessorKey)}
                            onChange={(e) =>
                              handlePublicationChange(e.target.value)
                            }
                            className={
                              errors[col.accessorKey] ? "border-red-500" : ""
                            }
                          />
                          {filteredSuggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 max-h-40 overflow-y-auto w-full">
                              {filteredSuggestions.map((suggestion) => (
                                <li
                                  key={suggestion.name}
                                  onClick={() =>
                                    handleSuggestionSelect(suggestion)
                                  }
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                  {suggestion.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : col.accessorKey === "h5_index" ||
                        col.accessorKey === "h5_median" ? (
                        <Input
                          id={col.accessorKey}
                          {...register(col.accessorKey)}
                          readOnly
                          className={
                            errors[col.accessorKey] ? "border-red-500" : ""
                          }
                        />
                      ) : col.accessorKey === "journalType" ? (
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
                      ) : col.accessorKey === "mOp" ? (
                        <Select
                          onValueChange={(value) =>
                            setValue(col.accessorKey, value)
                          }
                          value={watch(col.accessorKey) || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select mOp" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Mtech", "PhD"].map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
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
