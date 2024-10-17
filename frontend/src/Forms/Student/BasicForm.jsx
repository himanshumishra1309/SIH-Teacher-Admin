// BasicForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema } from '../Schema';

const BasicForm = () => {
  // Define your fields dynamically
  const fields = [
    { name: 'username', type: 'string', validation: { minLength: 3, maxLength: 20, nonEmpty: true } },
    { name: 'email', type: 'email', validation: {} },
    { name: 'phone', type: 'phone', validation: {} },
    { name: 'birthdate', type: 'date', validation: {} },
  ];

  // Generate the validation schema
  const validationSchema = Schema(fields);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // Handle the data submission logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 border rounded-md shadow-md">
      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          </label>
          <input
            id={field.name}
            type={field.type === 'date' ? 'date' : 'text'}
            {...register(field.name)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name].message}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white p-2 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default BasicForm;
