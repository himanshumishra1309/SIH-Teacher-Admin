// dynamicSchema.js
import { z } from "zod";

// Reusable function to generate validation schema dynamically
export const Schema = (fields) => {
  const schema = {};

  fields.forEach(({ name, type, validation }) => {
    if (!name || !type) {
      console.error("Error: Field is missing 'name' or 'type'", { name, type });
      throw new Error(`Field is missing 'name' or 'type'. Received name: ${name}, type: ${type}`);
    }

    let fieldSchema;

    switch (type) {
      case "string":
        fieldSchema = z.string();
        if (validation?.minLength) {
          fieldSchema = fieldSchema.min(
            validation.minLength,
            `${name} must be at least ${validation.minLength} characters`
          );
        }
        if (validation?.maxLength) {
          fieldSchema = fieldSchema.max(
            validation.maxLength,
            `${name} cannot exceed ${validation.maxLength} characters`
          );
        }
        if (validation?.nonEmpty) {
          fieldSchema = fieldSchema.nonempty(`${name} is required`);
        }
        break;

      case "email":
        fieldSchema = z.string().email("Please enter a valid email address");
        break;

      case "phone":
        fieldSchema = z
          .string()
          .min(10, `Phone number must be at least 10 digits`)
          .regex(/^\d+$/, `Phone number must be valid digits only`);
        break;

      case "date":
        fieldSchema = z
          .string()
          .nonempty("Date is required")
          .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date");
        break;

      default:
        throw new Error(`Unknown field type: ${type}`);
    }

    schema[name] = fieldSchema;
  });

  return z.object(schema);
};
