import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { Input } from '@/components/ui/input'; // ShadCN Input component
import { Button } from '@/components/ui/button'; // ShadCN Button component

const columns = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 90,
    headerClassName: 'custom-header' 
  },
  { 
    field: 'title', 
    headerName: 'Title of Research/Publication', 
    width: 200, 
    headerClassName: 'custom-header' 
  },
  { 
    field: 'type', 
    headerName: 'Type of Publication', 
    width: 150, 
    headerClassName: 'custom-header' 
  },
  { 
    field: 'date', 
    headerName: 'Date', 
    type: 'date', 
    width: 120, 
    headerClassName: 'custom-header',
    valueGetter: (params) => (params.row?.date ? new Date(params.row.date) : ''), 
  },
  {
    field: 'download',
    headerName: 'Download Report',
    width: 200,
    headerClassName: 'custom-header',
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        <Button className="btn">Download</Button>
      </a>
    ),
  },
];

const initialRows = [
  { id: 1, title: 'Research Paper 1', type: 'Journal', date: '2023-09-01', download: '/path/to/report1.pdf' },
  { id: 2, title: 'Research Paper 2', type: 'Conference', date: '2023-08-20', download: '/path/to/report2.pdf' },
];

function ResearchTable() {
  const [rows, setRows] = useState(initialRows);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = rows.filter((row) =>
    row.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1, 
      title: 'New Research Paper',
      type: 'New Type',
      date: new Date().toISOString().split('T')[0],
      download: '#', 
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
    <div className=' m-20'>
      {/* Search Input */}
      <h1 className='text.center font-serif font-semibold'>Enter name of Research/Publication</h1>
      <div className="flex items-center mb-4 ">
        
        <Input
          placeholder="Enter Name Of Research/Publication"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2 border border-gray-300 p-2 rounded-md"
        />
        <Button className="">Search</Button>
      </div>

      {/* DataGrid Table */}
      <div className="bg-white border border-gray-300 rounded-md shadow-md">
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            sortingOrder={['asc', 'desc']}
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e0e0e0', 
              },
              '& .MuiDataGrid-row': {
                borderBottom: '1px solid #e0e0e0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold',
              },
            }}
          />
        </div>
      </div>

      {/* Add Row Button */}
      <Button onClick={handleAddRow} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">
        Add Row
      </Button>
    </div>
  );
}

export default ResearchTable;

