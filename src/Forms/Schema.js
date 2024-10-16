import { z } from "zod";

// Reusable function to generate a validation schema dynamically
export const Schema = (fields) => {
  const schema = {};

  // Loop through fields and create dynamic validation schema
  fields.forEach(({ name, type, validation }) => {
    let fieldSchema;

    // Define the schema based on field type and validations
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
          .regex(/^\d+$/, `Phone number must contain valid digits only`);
        break;

      case "number":
        fieldSchema = z.number();
        if (validation?.min) {
          fieldSchema = fieldSchema.min(
            validation.min,
            `${name} must be at least ${validation.min}`
          );
        }
        if (validation?.max) {
          fieldSchema = fieldSchema.max(
            validation.max,
            `${name} must not exceed ${validation.max}`
          );
        }
        break;

      case "boolean":
        fieldSchema = z.boolean();
        break;

      case "date":
        fieldSchema = z
          .string()
          .nonempty("Date is required")
          .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date");
        break;

      case "stars":
        fieldSchema = z
          .number()
          .min(1, "Rating must be between 1 and 5")
          .max(5, "Rating must be between 1 and 5");
        break;

      default:
        throw new Error(`Unknown field type: ${type}`);
    }

    // Handle required or optional fields
    if (validation?.required === false) {
      fieldSchema = fieldSchema.optional();
    }

    schema[name] = fieldSchema;
  });

  return z.object(schema);
};

// Define your feedback form fields


// Generate the feedback schema dynamically