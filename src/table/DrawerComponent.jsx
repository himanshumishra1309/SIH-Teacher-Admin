import { useState, useEffect } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react'; 
import { DatePicker } from '@/components/ui/DatePicker';

function DrawerComponent({ isOpen, onClose, onSubmit, columns, rowData }) {
  const [formData, setFormData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date

  // Reset formData when drawer is opened
  useEffect(() => {
    if (isOpen) {
      const initialFormState = {};
      columns.forEach((col) => {
        if (col.accessorKey) {
          // If rowData is provided, use it to populate formData; otherwise, set to empty string
          initialFormState[col.accessorKey] = rowData ? rowData[col.accessorKey] : '';
        }
      });
      setFormData(initialFormState);

      // Set selected date to rowData date if editing, otherwise keep current date
      setSelectedDate(rowData?.Date ? new Date(rowData.Date) : new Date());
    }
  }, [isOpen, columns, rowData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Format selectedDate to dd-MM-yyyy
    const formattedDate = selectedDate ? format(selectedDate, 'dd-MM-yyyy') : ''; // Ensure it matches your desired format
  
    const finalData = {
      ...formData,
      Date: formattedDate, // Add the formatted date to formData
    };
  
    onSubmit(finalData); // Call the onSubmit function (either handleAddEntry or handleEditEntry)
    onClose(); // Close the drawer
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="p-4">
          <h3>{rowData ? 'Edit Entry' : 'Add a New Entry'}</h3>

          {/* Loop through column definitions to generate dynamic form fields */}
          {columns.map((col) => (
            col.accessorKey &&
            col.accessorKey !== 'actions' &&
            col.accessorKey !== 'Date' && (
              <Input
                key={col.accessorKey}
                name={col.accessorKey}
                placeholder={col.header || col.accessorKey}
                value={formData[col.accessorKey] || ''}
                onChange={handleChange}
              />
            )
          ))}

          {/* Date Picker for "Date" field */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              renderTrigger={({ ref, onClick }) => (
                <Button ref={ref} onClick={onClick} className="w-full mt-2">
                  <CalendarIcon className="mr-2" />
                  {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Pick a Date'}
                </Button>
              )}
            />
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex justify-end mt-4">
            <Button onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-500">
              Submit
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;
