import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { datasetAPI } from '../services/api';
import { Dataset } from '../types';
import { Upload, Trash2, Eye, Database, FileText, Calendar, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await datasetAPI.getAll();
      setDatasets(response.data.datasets);
    } catch (err: any) {
      setError('Failed to fetch datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    setUploading(true);
    setError('');

    try {
      await datasetAPI.upload(formData);
      await fetchDatasets();
      e.target.value = '';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;

    try {
      await datasetAPI.delete(id);
      await fetchDatasets();
    } catch (err: any) {
      setError('Failed to delete dataset');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading your datasets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Datasets
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Upload and manage your data files
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {datasets.length}
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {datasets.length === 1 ? 'Dataset' : 'Datasets'}
            </span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="card">
          <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 group">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center px-4">
                <p className="text-base font-medium text-slate-900 dark:text-white mb-1">
                  <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  CSV or Excel files (MAX. 10MB)
                </p>
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          {uploading && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">Uploading your file...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 alert alert-error">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Datasets Grid */}
      {datasets.length === 0 ? (
        <div className="card text-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
              <Database className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No datasets yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Upload your first dataset to get started with data visualization and analysis
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid-responsive">
          {datasets.map((dataset) => (
            <div 
              key={dataset.id} 
              className="card card-hover group animate-fadeIn"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {dataset.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{dataset.filename}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4 py-4 border-y border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Rows</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {dataset.rowCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Columns</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {dataset.columnNames.length}
                  </span>
                </div>
                {dataset.user && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Uploaded by</span>
                    <span className="font-medium text-slate-900 dark:text-white truncate ml-2 max-w-[150px]">
                      {dataset.user.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => navigate(`/dataset/${dataset.id}`)}
                  className="flex-1 btn btn-primary btn-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDelete(dataset.id)}
                  className="btn btn-danger btn-sm px-3"
                  aria-label="Delete dataset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;