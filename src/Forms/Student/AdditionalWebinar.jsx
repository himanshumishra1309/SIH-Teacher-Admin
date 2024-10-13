import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Schema} from "../Schema.js"
// Step 1: Create a Zod schema for validation


export default function AdditionalWebinar() {
  // Step 2: Initialize useForm with Zod validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(Schema),  // Use the Zod schema to validate form
  });

  // Step 3: Handle form submission
  const onSubmit = (data) => {
    console.log("Form Submitted", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Step 4: Register inputs with React Hook Form */}
      
      {/* Name Field */}
      <div>
        <label>Name</label>
        <input type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      
      {/* Email Field */}
      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      {/* Age Field */}
      <div>
        <label>Age</label>
        <input type="number" {...register("age")} />
        {errors.age && <span>{errors.age.message}</span>}
      </div>
      
      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
  );
}
