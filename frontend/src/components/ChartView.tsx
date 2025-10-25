import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DataRecord } from '../types';
import { TrendingUp } from 'lucide-react';

interface ChartViewProps {
  data: DataRecord[];
  columns: string[];
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const ChartView = ({ data, columns }: ChartViewProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [xAxis, setXAxis] = useState(columns[0] || '');
  const [yAxis, setYAxis] = useState(columns[1] || '');

  const getNumericColumns = () => {
    if (data.length === 0) return [];
    return columns.filter((col) => typeof data[0][col] === 'number');
  };

  const numericColumns = getNumericColumns();

  const prepareChartData = () => {
    return data.slice(0, 50).map((record) => ({
      name: String(record[xAxis] || ''),
      value: Number(record[yAxis]) || 0,
    }));
  };

  const chartData = prepareChartData();

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" name={yAxis} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} name={yAxis} dot={{ fill: '#2563eb', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelStyle={{ fontSize: '12px', fontWeight: 500 }}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} name={yAxis} />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  if (data.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          No data available
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Upload data to create visualizations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        {/* Chart Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <label className="label">
              Chart Type
            </label>
            <select
              className="input"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
          <div>
            <label className="label">
              X-Axis
            </label>
            <select
              className="input"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">
              Y-Axis (Value)
            </label>
            <select
              className="input"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
            >
              {numericColumns.length > 0 ? (
                numericColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))
              ) : (
                columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="flex items-end">
            <div className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">Data Points</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {chartData.length}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Display */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
          {renderChart()}
        </div>

        {/* Info Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Showing first 50 records
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Total: {data.length} records
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartView;