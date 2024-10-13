import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AddEntrySchema } from "../Schema";

export default function NocForm() {

// Initialize RHF with Zod resolver
const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
      // this calls the schema file
    resolver: zodResolver(fireReportSchema),
  });
  

  // Form submission handler
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Handle form submission (e.g., send to server)
  };

return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
    {/* Name Field */}
    <div className="space-y-2">
      <label htmlFor="name" className="block text-sm font-medium">
        Name
      </label>
      <Input
        id="name"
        type="text"
        placeholder="Enter your name"
        {...register("name")}
        className={errors.name ? "border-red-500" : ""}
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}
    </div>

    {/* Email Field */}
    <div className="space-y-2">
      <label htmlFor="email" className="block text-sm font-medium">
        Email
      </label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        {...register("email")}
        className={errors.email ? "border-red-500" : ""}
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}
    </div>

    {/* Report Details Field */}
    <div className="space-y-2">
      <label htmlFor="reportDetails" className="block text-sm font-medium">
        Report Details
      </label>
      <Textarea
        id="reportDetails"
        placeholder="Describe the incident"
        {...register("reportDetails")}
        className={errors.reportDetails ? "border-red-500" : ""}
      />
      {errors.reportDetails && (
        <p className="text-red-500 text-sm">
          {errors.reportDetails.message}
        </p>
      )}
    </div>

    {/* Incident Date Field */}
    <div className="space-y-2">
      <label htmlFor="incidentDate" className="block text-sm font-medium">
        Incident Date
      </label>
      <Input
        id="incidentDate"
        type="date"
        {...register("incidentDate")}
        className={errors.incidentDate ? "border-red-500" : ""}
      />
      {errors.incidentDate && (
        <p className="text-red-500 text-sm">
          {errors.incidentDate.message}
        </p>
      )}
    </div>

    {/* Submit Button */}
    <Button type="submit" className="bg-blue-500 text-white">
      Submit Report
    </Button>
  </form>

);

}