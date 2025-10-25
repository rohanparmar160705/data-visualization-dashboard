import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { datasetAPI } from '../services/api';
import { Dataset, DataRecord, PaginationInfo } from '../types';
import DataTable from '../components/DataTable';
import ChartView from '../components/ChartView';
import FilterPanel from '../components/FilterPanel';
import { BarChart3, Table, Search, Loader2, Database } from 'lucide-react';

const DatasetView = () => {
  const { id } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    fetchDataset();
  }, [id]);

  useEffect(() => {
    fetchRecords();
  }, [id, pagination.page, search, sortBy, sortOrder, filters]);

  const fetchDataset = async () => {
    try {
      const response = await datasetAPI.getOne(id!);
      setDataset(response.data.dataset);
    } catch (err) {
      console.error('Failed to fetch dataset');
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await datasetAPI.getData(id!, {
        page: pagination.page,
        limit: pagination.limit,
        search,
        sortBy,
        sortOrder,
      });
      setRecords(response.data.records);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilters({ ...filters, [column]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const getFilteredRecords = () => {
    if (Object.keys(filters).length === 0) return records;

    return records.filter((record) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const recordValue = String(record[key] || '').toLowerCase();
        return recordValue.includes(value.toLowerCase());
      });
    });
  };

  if (!dataset) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading dataset...</p>
        </div>
      </div>
    );
  }

  const filteredRecords = getFilteredRecords();

  return (
    <div className="page-container">
      {/* Dataset Header */}
      <div className="section">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 break-words">
              {dataset.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Database className="w-4 h-4" />
                <span className="font-medium">{dataset.rowCount.toLocaleString()}</span>
                <span>rows</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-medium">{dataset.columnNames.length}</span>
                <span>columns</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all columns..."
              className="input pl-10 w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setView('table')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'table'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setView('chart')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'chart'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {view === 'table' ? (
        <>
          <FilterPanel
            columns={dataset.columnNames}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <DataTable
            columns={dataset.columnNames}
            data={filteredRecords}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          
          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-medium text-slate-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium text-slate-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium text-slate-900 dark:text-white">{pagination.total}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {pagination.page}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">of</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {pagination.totalPages}
                </span>
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <ChartView data={filteredRecords} columns={dataset.columnNames} />
      )}
    </div>
  );
};

export default DatasetView;