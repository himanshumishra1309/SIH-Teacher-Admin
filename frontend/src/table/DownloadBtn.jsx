import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import * as XLSX from 'xlsx/xlsx.mjs';

function DownloadBtn({ data = [], fileName = 'data' }) {
  return (
    <Button 
    className='download-btn text-white'
    onClick={() => {
    console.log('Data being passed:', data); // Check if data is being passed correctly
        const sheetData = data.length ? data : []; // Use a different variable name
        const sheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`); // No need for the check here
      }}
    >
      <DownloadIcon />
      Download
    </Button>
  );
}

export default DownloadBtn;
