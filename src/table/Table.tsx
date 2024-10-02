import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Define your data type
type Reseacrh = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;

};

// Sample data
const defaultData: Research[] = [
  { firstName: 'John', lastName: 'Doe', age: 28, visits: 120,  },
  { firstName: 'Jane', lastName: 'Smith', age: 34, visits: 60,  },
  { firstName: 'Bob', lastName: 'Johnson', age: 45, visits: 30, },
];

// Create column helper for defining columns
const columnHelper = createColumnHelper<Research>();

// Define table columns
const columns = [
  columnHelper.accessor('firstName', {
    header: 'Title of Research/Publication',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Type of Publication',
    cell: info => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor('age', {
    header: 'Date',
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('visits', {
    header: 'Download Report',
  }),
];

const Table: React.FC = () => {
  const [data] = React.useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>

  );
};

export default Table;
