import { z } from 'zod';

// Dynamically create Zod schema from the column definitions
export const Schema = (columns) => {
  const schemaObject = {};

  columns.forEach((column) => {
    const { accessorKey, validation } = column;

    if (validation && validation.type === 'string') {
      let fieldSchema = z.string();
      if (validation.min) {
        fieldSchema = fieldSchema.min(validation.min, validation.errorMessage || 'Too short');
      }
      if (validation.optional) {
        fieldSchema = fieldSchema.optional();
      } else {
        fieldSchema = fieldSchema.nonempty('This field is required');
      }
      schemaObject[accessorKey] = fieldSchema;
    } else if (validation && validation.type === 'date') {
      let fieldSchema = z.date();
      if (validation.optional) {
        fieldSchema = fieldSchema.optional();
      }
      schemaObject[accessorKey] = fieldSchema;
    }
  });

  return z.object(schemaObject);
};
