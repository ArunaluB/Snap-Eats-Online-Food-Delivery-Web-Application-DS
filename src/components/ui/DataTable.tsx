import React, { useState } from 'react';

interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  className = '',
}: DataTableProps<T>) {
  const [sortedField, setSortedField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getCellValue = (item: T, accessor: keyof T | ((item: T) => React.ReactNode)) => {
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    return item[accessor];
  };

  const handleSort = (accessor: keyof T | ((item: T) => React.ReactNode)) => {
    if (typeof accessor === 'function') return;
    
    if (sortedField === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedField(accessor);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortedField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortedField];
      const bValue = b[sortedField];

      if (aValue === bValue) return 0;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      return sortDirection === 'asc' 
        ? (aValue < bValue ? -1 : 1) 
        : (aValue < bValue ? 1 : -1);
    });
  }, [data, sortedField, sortDirection]);

  return (
    <div className={`overflow-x-auto relative rounded-lg ${className}`}>
      <table className="w-full text-sm text-left text-gray-800">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                scope="col" 
                className={`px-6 py-3 ${column.className || ''} ${
                  typeof column.accessor !== 'function' ? 'cursor-pointer select-none' : ''
                }`}
                onClick={() => typeof column.accessor !== 'function' && handleSort(column.accessor)}
              >
                <div className="flex items-center justify-between">
                  {column.header}
                  {sortedField === column.accessor && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <tr 
                key={keyExtractor(item)} 
                className="bg-white border-b hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, columnIndex) => (
                  <td 
                    key={columnIndex} 
                    className={`px-6 py-4 ${column.className || ''}`}
                  >
                    {getCellValue(item, column.accessor)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}