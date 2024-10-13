import { z } from "zod";

// Reusable function to generate validation schema dynamically
export const Schema = (fields) => {
  const schema = {};

  // Loop through fields and create a dynamic validation schema
  fields.forEach(({ name, type, validation }) => {
    let fieldSchema;

    // Define the schema based on the field type and validations
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
          .nonempty("Date is required") // Non-empty validation
          .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date"); // Date validation
        break;

      // Add more types if needed (number, boolean, etc.)
      default:
        throw new Error(`Unknown field type: ${type}`);
    }

    schema[name] = fieldSchema;
  });

  return z.object(schema);
};

// Dynamic error messages will be handled appropriately based on type
