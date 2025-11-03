import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, transactionsAPI } from '../services/api';
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
      {/* Welcome Banner */}
      <div className="glass rounded-2xl shadow-2xl p-8 fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-600">Here's your financial overview for today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-2xl shadow-xl p-6 card-hover fade-in fade-in-1 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Balance</span>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Wallet className="text-white" size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 count-up">{formatCurrency(totalBalance)}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 pulse-subtle"></div>
            Across all accounts
          </div>
        </div>

        <div className="glass rounded-2xl shadow-xl p-6 card-hover fade-in fade-in-2 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Income</span>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <TrendingUp className="text-white" size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-green-600 count-up">{formatCurrency(monthlyIncome)}</p>
          <div className="mt-2 flex items-center text-xs text-green-600 font-medium">
            <ArrowUpRight size={14} className="mr-1" />
            Last 30 days
          </div>
        </div>

        <div className="glass rounded-2xl shadow-xl p-6 card-hover fade-in fade-in-3 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Expenses</span>
            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
              <TrendingDown className="text-white" size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-red-600 count-up">{formatCurrency(monthlyExpenses)}</p>
          <div className="mt-2 flex items-center text-xs text-red-600 font-medium">
            <ArrowDownRight size={14} className="mr-1" />
            Last 30 days
          </div>
        </div>

        <div className="glass rounded-2xl shadow-xl p-6 card-hover fade-in fade-in-4 border-l-4 border-purple-500 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${portfolioGain >= 0 ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50'} opacity-50`}></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Portfolio Value</span>
              <div className={`p-3 bg-gradient-to-br ${portfolioGain >= 0 ? 'from-green-500 to-emerald-600 glow-green' : 'from-red-500 to-rose-600 glow-red'} rounded-xl shadow-lg`}>
                <TrendingUp className="text-white" size={20} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 count-up">{formatCurrency(portfolioValue)}</p>
            <div className={`mt-2 flex items-center text-sm font-bold ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioGain >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
              {portfolioGain >= 0 ? '+' : ''}{formatCurrency(portfolioGain)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl shadow-xl p-6 fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/transactions"
            className="group relative flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold text-lg">Add Transaction</span>
          </Link>
          <Link
            to="/portfolio"
            className="group relative flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold text-lg">Add Investment</span>
          </Link>
          <Link
            to="/analytics"
            className="group relative flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
            <TrendingUp size={22} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-lg">View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass rounded-2xl shadow-xl p-6 fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></span>
            Recent Transactions
          </h2>
          <Link 
            to="/transactions" 
            className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-gray-400 text-sm mt-1">Start tracking your finances today!</p>
            </div>
          ) : (
            recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`group flex items-center justify-between p-5 bg-gradient-to-r ${
                  transaction.type === 'income' 
                    ? 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100' 
                    : 'from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100'
                } rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl shadow-lg ${
                    transaction.type === 'income' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-br from-red-500 to-rose-600'
                  } transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="text-white" size={20} />
                    ) : (
                      <ArrowDownRight className="text-white" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{transaction.category}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {transaction.description || 'No description'} <span className="text-gray-400">•</span> <span className="font-medium">{formatDate(transaction.date)}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-extrabold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{transaction.account_name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

