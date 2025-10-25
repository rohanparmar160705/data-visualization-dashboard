import { DataRecord } from '../types';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

interface DataTableProps {
  columns: string[];
  data: DataRecord[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const DataTable = ({ columns, data, loading, sortBy, sortOrder, onSort }: DataTableProps) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            No data found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => onSort(column)}
                  className="table-header-cell cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="truncate">{column}</span>
                    {sortBy === column && (
                      <span className="flex-shrink-0">
                        {sortOrder === 'asc' ? (
                          <ArrowUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-blue-600" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="table-row">
                {columns.map((column) => (
                  <td
                    key={column}
                    className="table-cell whitespace-nowrap"
                  >
                    <span className="block max-w-xs truncate" title={String(row[column] || '-')}>
                      {row[column] !== null && row[column] !== undefined
                        ? String(row[column])
                        : '-'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;