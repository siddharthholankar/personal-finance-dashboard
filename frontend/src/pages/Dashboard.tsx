import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, transactionsAPI, portfolioAPI } from '../services/api';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Summary {
  total_balance: string;
  monthly_income: string;
  monthly_expenses: string;
  total_transactions: string;
}

interface PortfolioSummary {
  total_invested: string;
  current_value: string;
  total_gain_loss: string;
}

interface Transaction {
  id: number;
  amount: string;
  type: string;
  category: string;
  description: string;
  date: string;
  account_name: string;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, portfolioRes, transactionsRes] = await Promise.all([
        analyticsAPI.getRecentSummary(),
        analyticsAPI.getPortfolioSummary(),
        transactionsAPI.getAll({ limit: 5 })
      ]);

      setSummary(summaryRes.data);
      setPortfolioSummary(portfolioRes.data);
      setRecentTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const totalBalance = parseFloat(summary?.total_balance || '0');
  const monthlyIncome = parseFloat(summary?.monthly_income || '0');
  const monthlyExpenses = parseFloat(summary?.monthly_expenses || '0');
  const portfolioValue = parseFloat(portfolioSummary?.current_value || '0');
  const portfolioGain = parseFloat(portfolioSummary?.total_gain_loss || '0');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Balance</span>
            <Wallet className="text-primary-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Income</span>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Expenses</span>
            <TrendingDown className="text-red-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(monthlyExpenses)}</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Portfolio Value</span>
            <TrendingUp className="text-primary-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioValue)}</p>
          <p className={`text-xs mt-1 ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolioGain >= 0 ? '+' : ''}{formatCurrency(portfolioGain)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/transactions"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Add Transaction</span>
          </Link>
          <Link
            to="/portfolio"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Add Investment</span>
          </Link>
          <Link
            to="/analytics"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <TrendingUp size={20} />
            <span className="font-medium">View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Link to="/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="text-green-600" size={20} />
                    ) : (
                      <ArrowDownRight className="text-red-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.category}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.description || 'No description'} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

