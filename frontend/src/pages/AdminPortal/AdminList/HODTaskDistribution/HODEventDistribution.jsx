import React, { useState } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const HODEventDistTable = () => {
  const data = React.useMemo(
    () => [
      {
        id: 1,
        name: "Rakesh Mishra",
        event_name: "AI Conference 2023",
        role: "Speaker",
        event_type: "International",
        date: "2023-09-15",
        report: "https://example.com/report1"
      },
      {
        id: 2,
        name: "Samish Reddy",
        event_name: "National Coding Symposium",
        role: "Judge",
        event_type: "National",
        date: "2023-10-22",
        report: "https://example.com/report2"
      },
      {
        id: 3,
        name: "Sachin Choudhary",
        event_name: "Data Science Workshop",
        role: "Organizer",
        event_type: "College",
        date: "2023-11-05",
        report: "https://example.com/report3"
      }
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Event',
        accessor: 'event_name',
      },
      {
        Header: 'Role',
        accessor: 'role',
        Filter: ({ column }) => {
          const options = ["Organizer", "Speaker", "Judge", "Coordinator", "Volunteer"];
          return (
            <Select
              onChange={(e) => column.setFilter(e.target.value || undefined)}
              value={column.filterValue || ''}
            >
              <option value="">All</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          );
        },
      },
      {
        Header: 'Type',
        accessor: 'event_type',
        Filter: ({ column }) => {
          const options = ["International", "National", "State", "College"];
          return (
            <Select
              onChange={(e) => column.setFilter(e.target.value || undefined)}
              value={column.filterValue || ''}
            >
              <option value="">All</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          );
        },
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'View Report',
        accessor: 'report',
        Cell: ({ value }) => (
          <Button onClick={() => window.open(value, "_blank")}>
            View
          </Button>
        ),
        disableFilters: true,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div className="container mx-auto p-4">
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      
      <div className="pagination mt-4 flex items-center justify-between">
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Button>
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Button>
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>
        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </Button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <Input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <Select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default TeacherEventTable;

