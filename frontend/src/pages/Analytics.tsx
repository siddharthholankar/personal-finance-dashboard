import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';

interface MonthlySummary {
  month: string;
  total_income: string;
  total_expenses: string;
  net: string;
}

interface CategoryBreakdown {
  category: string;
  total: string;
  count: string;
}

export default function Analytics() {
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');

  const COLORS = [
    '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#ef4444', '#6366f1', '#14b8a6', '#f97316', '#84cc16'
  ];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchCategoryBreakdown();
  }, [selectedType]);

  const fetchAnalytics = async () => {
    try {
      const summaryRes = await analyticsAPI.getMonthlySummary();
      setMonthlySummary(summaryRes.data.reverse());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryBreakdown = async () => {
    try {
      const breakdownRes = await analyticsAPI.getCategoryBreakdown({ type: selectedType });
      setCategoryBreakdown(breakdownRes.data);
    } catch (error) {
      console.error('Error fetching category breakdown:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const exportData = () => {
    const csvContent = [
      ['Month', 'Income', 'Expenses', 'Net'],
      ...monthlySummary.map(item => [
        item.month,
        item.total_income,
        item.total_expenses,
        item.net
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const monthlyChartData = monthlySummary.map(item => ({
    month: item.month.substring(5),
    Income: parseFloat(item.total_income) || 0,
    Expenses: parseFloat(item.total_expenses) || 0,
  }));

  const pieChartData = categoryBreakdown.map(item => ({
    name: item.category,
    value: parseFloat(item.total),
  }));

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Visualize your financial data</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download size={20} />
          <span>Export Data</span>
        </button>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Income vs Expenses</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>Last 12 months</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Income"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Income vs Expenses Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'expense'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'income'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              {pieChartData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((item, index) => {
                const total = parseFloat(item.total);
                const maxTotal = Math.max(...categoryBreakdown.map(i => parseFloat(i.total)));
                const percentage = (total / maxTotal) * 100;

                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-xs text-gray-500">({item.count} transactions)</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(total)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 text-center py-8">No categories found</div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {monthlySummary.slice(0, 1).map(item => {
          const income = parseFloat(item.total_income) || 0;
          const net = parseFloat(item.net) || 0;
          const savingsRate = income > 0 ? (net / income) * 100 : 0;

          return (
            <div key={item.month} className="contents">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-2">Latest Month Net</p>
                <p className={`text-2xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(net)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.month}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-2">Savings Rate</p>
                <p className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {savingsRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Of monthly income</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-2">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categoryBreakdown.length}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedType} categories</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

