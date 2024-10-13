import { useEffect } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema } from '../Schema';
import { columnDef } from '@/table/Research/ResearchColumn';
import DatePicker from 'react-datepicker'; // Ensure this import is correct
import 'react-datepicker/dist/react-datepicker.css'; // Ensure this import is correct

const AddEntrySchema = Schema(columnDef);

function DrawerComponent({ isOpen, onClose, onSubmit, columns, rowData }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddEntrySchema),
  });

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
  dateFormat="dd/MM/yyyy" // Customize your date format here
  filterDate={(date) => date <= new Date()} // Disable future dates
/>
                      {errors.entryDate && (
                        <p className="text-red-500 text-sm">{errors.Date.message}</p>
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
                        <p className="text-red-500 text-sm">{errors[col.accessorKey].message}</p>
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
