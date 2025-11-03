import { useState, useEffect } from 'react';
import { portfolioAPI, analyticsAPI } from '../services/api';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Holding {
  id: number;
  symbol: string;
  shares: string;
  purchase_price: string;
  current_price: string;
}

interface PortfolioSummary {
  total_invested: string;
  current_value: string;
  total_gain_loss: string;
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    symbol: '',
    shares: '',
    purchasePrice: '',
    currentPrice: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [holdingsRes, summaryRes] = await Promise.all([
        portfolioAPI.getAll(),
        analyticsAPI.getPortfolioSummary(),
      ]);
      setHoldings(holdingsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await portfolioAPI.update(editingId, {
          shares: formData.shares,
          currentPrice: formData.currentPrice,
        });
      } else {
        await portfolioAPI.create(formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving holding:', error);
      alert('Failed to save holding');
    }
  };

  const handleEdit = (holding: Holding) => {
    setEditingId(holding.id);
    setFormData({
      symbol: holding.symbol,
      shares: holding.shares,
      purchasePrice: holding.purchase_price,
      currentPrice: holding.current_price,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this holding?')) return;
    try {
      await portfolioAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting holding:', error);
      alert('Failed to delete holding');
    }
  };

  const resetForm = () => {
    setFormData({
      symbol: '',
      shares: '',
      purchasePrice: '',
      currentPrice: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num || 0);
  };

  const calculateHoldingValue = (shares: string, price: string) => {
    return parseFloat(shares) * parseFloat(price);
  };

  const calculateGainLoss = (shares: string, purchasePrice: string, currentPrice: string) => {
    const invested = parseFloat(shares) * parseFloat(purchasePrice);
    const current = parseFloat(shares) * parseFloat(currentPrice);
    return current - invested;
  };

  const calculateGainLossPercent = (shares: string, purchasePrice: string, currentPrice: string) => {
    const invested = parseFloat(shares) * parseFloat(purchasePrice);
    const gainLoss = calculateGainLoss(shares, purchasePrice, currentPrice);
    return (gainLoss / invested) * 100;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const totalInvested = parseFloat(summary?.total_invested || '0');
  const currentValue = parseFloat(summary?.current_value || '0');
  const totalGainLoss = parseFloat(summary?.total_gain_loss || '0');
  const gainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl shadow-xl p-6 fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Investment Portfolio 📊</h1>
            <p className="text-gray-600 mt-2 text-lg">Track your investment holdings and performance</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold text-lg">Add Holding</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl shadow-xl p-6 card-hover fade-in fade-in-1 border-t-4 border-blue-500">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Total Invested</p>
          <p className="text-4xl font-extrabold text-gray-900 count-up">{formatCurrency(totalInvested)}</p>
          <div className="mt-3 flex items-center text-xs text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 pulse-subtle"></div>
            <span className="font-medium">Initial Capital</span>
          </div>
        </div>
        
        <div className="glass rounded-2xl shadow-xl p-6 card-hover fade-in fade-in-2 border-t-4 border-purple-500">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Current Value</p>
          <p className="text-4xl font-extrabold text-gray-900 count-up">{formatCurrency(currentValue)}</p>
          <div className="mt-3 flex items-center text-xs text-purple-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 pulse-subtle"></div>
            <span className="font-medium">Market Value</span>
          </div>
        </div>
        
        <div className={`glass rounded-2xl shadow-xl p-6 card-hover fade-in fade-in-3 border-t-4 ${totalGainLoss >= 0 ? 'border-green-500 glow-green' : 'border-red-500 glow-red'} relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${totalGainLoss >= 0 ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50'} opacity-50`}></div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Total Gain/Loss</p>
            <p className={`text-4xl font-extrabold count-up ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </p>
            <div className={`mt-3 flex items-center text-sm font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? <TrendingUp size={18} className="mr-1" /> : <TrendingDown size={18} className="mr-1" />}
              {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}% Return
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl shadow-xl p-8 fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
            {editingId ? 'Edit Holding' : 'Add New Holding'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none uppercase"
                placeholder="AAPL"
                required
                disabled={editingId !== null}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shares</label>
              <input
                type="number"
                step="0.0001"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="150.00"
                required
                disabled={editingId !== null}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="175.00"
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-br from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {editingId ? 'Update Holding' : 'Add Holding'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Holdings Table */}
      <div className="glass rounded-2xl shadow-xl overflow-hidden fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/Loss
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No holdings yet. Add your first investment!
                  </td>
                </tr>
              ) : (
                holdings.map((holding) => {
                  const currentValue = calculateHoldingValue(holding.shares, holding.current_price);
                  const gainLoss = calculateGainLoss(holding.shares, holding.purchase_price, holding.current_price);
                  const gainLossPercent = calculateGainLossPercent(holding.shares, holding.purchase_price, holding.current_price);

                  return (
                    <tr key={holding.id} className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border-b border-gray-100 last:border-0">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">
                              {holding.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-900">{holding.symbol}</span>
                            <p className="text-xs text-gray-500 mt-1">Stock</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <span className="text-base font-semibold text-gray-900">
                          {parseFloat(holding.shares).toFixed(4)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <span className="text-base font-medium text-gray-700">
                          {formatCurrency(holding.purchase_price)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <span className="text-base font-semibold text-gray-900">
                          {formatCurrency(holding.current_price)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(currentValue)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className={`inline-flex flex-col items-end ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <div className="flex items-center mb-1">
                            {gainLoss >= 0 ? <TrendingUp size={18} className="mr-1" /> : <TrendingDown size={18} className="mr-1" />}
                            <span className="text-lg font-bold">
                              {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                            </span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${gainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(holding)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 transform hover:scale-110"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(holding.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300 transform hover:scale-110"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

