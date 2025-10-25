import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  columns: string[];
  filters: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
}

const FilterPanel = ({ columns, filters, onFilterChange }: FilterPanelProps) => {
  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  const clearAllFilters = () => {
    columns.forEach(col => onFilterChange(col, ''));
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="badge badge-primary">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {columns.slice(0, 8).map((column) => (
          <div key={column}>
            <label className="label truncate" title={column}>
              {column}
            </label>
            <div className="relative">
              <input
                type="text"
                className={`input pr-8 ${filters[column] ? 'border-blue-500 dark:border-blue-400' : ''}`}
                placeholder={`Filter by ${column}`}
                value={filters[column] || ''}
                onChange={(e) => onFilterChange(column, e.target.value)}
              />
              {filters[column] && (
                <button
                  onClick={() => onFilterChange(column, '')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  aria-label="Clear filter"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {columns.length > 8 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            Showing 8 of {columns.length} available columns
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;