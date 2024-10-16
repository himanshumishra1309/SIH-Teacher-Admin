import { useEffect } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Schema } from '../Schema';

function DrawerComponent({ isOpen, onClose, onSubmit, columns, rowData }) {
  // Dynamically generate Zod schema based on columns
  const AddEntrySchema = Schema(
    columns.map((col) => ({
      name: col.accessorKey,
      type: col.type || 'string', // Fallback to string if type is not provided
      validation: col.validation || {}, // Use default validation object if not provided
    }))
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddEntrySchema),
    defaultValues: rowData || {}, // Set default values from rowData if editing
  });

  // Handle form population when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (!rowData) {
        setValue('Date', new Date()); // Set current date as default
      } else {
        columns.forEach((col) => {
          if (col.accessorKey) {
            setValue(col.accessorKey, rowData[col.accessorKey] || '');
          }
        });
      }
    }
  }, [isOpen, columns, rowData, setValue]);

  const handleFormSubmit = (data) => {
    console.log('Form Data:', data);
    onSubmit({ ...data, Date: data.Date }); // Map entryDate to Date for submission
    onClose(); // Close the drawer after submission
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="p-4">
          <h3>{rowData ? 'Edit Entry' : 'Add a New Entry'}</h3>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {columns.map((col) => (
              col.accessorKey && col.accessorKey !== 'actions' && col.accessorKey !== 'View' && (
                <div key={col.accessorKey}>
                  {col.accessorKey === 'Date' ? (
                    <>
                      <label htmlFor="Date" className="block text-sm font-medium">
                        Date
                      </label>
                      <DatePicker
                        id="entryDate"
                        selected={watch('entryDate') ? new Date(watch('entryDate')) : null}
                        onChange={(date) => {
                          setValue('entryDate', date); // Update the form state with the selected date
                        }}
                        className={`border ${errors.entryDate ? 'border-red-500' : ''} p-2 rounded`}
                        placeholderText="Select a date"
                        dateFormat="dd/MM/yyyy"
                        filterDate={(date) => date <= new Date()} // Disable future dates
                      />
                      {errors.entryDate && (
                        <p className="text-red-500 text-sm">{errors.entryDate.message}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <label htmlFor={col.accessorKey} className="block text-sm font-medium">
                        {col.header || col.accessorKey}
                      </label>
                      <Input
                        name={col.accessorKey}
                        placeholder={col.header || col.accessorKey}
                        {...register(col.accessorKey)}
                        className={errors[col.accessorKey] ? 'border-red-500' : ''}
                      />
                      {errors[col.accessorKey] && (
                        <p className="text-red-500 text-sm">{errors[col.accessorKey]?.message}</p>
                      )}
                    </>
                  )}
                </div>
              )
            ))}

            <div className="flex justify-end mt-4">
              <Button onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;
