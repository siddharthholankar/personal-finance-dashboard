import { useState } from 'react';
import TradingViewWidget from '../components/TradingViewWidget';
import MarketOverview from '../components/MarketOverview';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

export default function MarketAnalysis() {
  const [selectedSymbol, setSelectedSymbol] = useState('NASDAQ:AAPL');
  const [selectedTab, setSelectedTab] = useState<'chart' | 'overview' | 'analysis'>('chart');

  const popularStocks = [
    { symbol: 'NASDAQ:AAPL', name: 'Apple Inc.' },
    { symbol: 'NASDAQ:MSFT', name: 'Microsoft' },
    { symbol: 'NASDAQ:GOOGL', name: 'Google' },
    { symbol: 'NASDAQ:TSLA', name: 'Tesla' },
    { symbol: 'NASDAQ:NVDA', name: 'NVIDIA' },
    { symbol: 'NASDAQ:AMZN', name: 'Amazon' },
    { symbol: 'NYSE:JPM', name: 'JPMorgan' },
    { symbol: 'NYSE:V', name: 'Visa' },
    { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin' },
    { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Analysis</h1>
          <p className="text-gray-600 mt-1">Real-time market data and technical analysis</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab('chart')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'chart'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={18} />
            <span>Advanced Chart</span>
          </button>
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'overview'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PieChart size={18} />
            <span>Market Overview</span>
          </button>
          <button
            onClick={() => setSelectedTab('analysis')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'analysis'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity size={18} />
            <span>Technical Analysis</span>
          </button>
        </div>
      </div>

      {/* Quick Symbol Selection */}
      {selectedTab === 'chart' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Stocks & Crypto</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {popularStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedSymbol(stock.symbol)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedSymbol === stock.symbol
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">
                  {stock.symbol.split(':')[1]}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stock.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Based on Selected Tab */}
      {selectedTab === 'chart' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Live Chart: {selectedSymbol}
            </h3>
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <TradingViewWidget symbol={selectedSymbol} height={600} type="chart" />
          <p className="text-xs text-gray-500 mt-2">
            * Chart powered by TradingView with real-time data, technical indicators (RSI, Moving Averages), 
            and advanced charting tools for comprehensive market analysis.
          </p>
        </div>
      )}

      {selectedTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Global Market Overview</h3>
            <p className="text-sm text-gray-600 mt-1">
              Track major indices, futures, stocks, and cryptocurrencies in real-time
            </p>
          </div>
          <MarketOverview height={600} />
        </div>
      )}

      {selectedTab === 'analysis' && (
        <div className="space-y-6">
          {/* Key Financial Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Analysis Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">RSI Analysis</p>
                    <p className="text-lg font-bold text-gray-900">Momentum</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Moving Averages</p>
                    <p className="text-lg font-bold text-gray-900">Trends</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Volatility</p>
                    <p className="text-lg font-bold text-gray-900">Risk</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <PieChart className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Volume</p>
                    <p className="text-lg font-bold text-gray-900">Liquidity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Analysis Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📊 Technical Indicators</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Relative Strength Index (RSI) - Momentum oscillator</li>
                  <li>• Moving Averages (SMA/EMA) - Trend identification</li>
                  <li>• MACD - Trend and momentum indicator</li>
                  <li>• Bollinger Bands - Volatility and price levels</li>
                  <li>• Volume Analysis - Trading activity measurement</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">💰 Fundamental Analysis</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• P/E Ratio - Valuation metric</li>
                  <li>• Market Capitalization - Company size</li>
                  <li>• Dividend Yield - Income generation</li>
                  <li>• Revenue Growth - Business expansion</li>
                  <li>• Profit Margins - Operational efficiency</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📈 Portfolio Metrics</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Return on Investment (ROI)</li>
                  <li>• Internal Rate of Return (IRR)</li>
                  <li>• Sharpe Ratio - Risk-adjusted returns</li>
                  <li>• Beta - Market correlation</li>
                  <li>• Alpha - Excess returns</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🎯 Risk Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Value at Risk (VaR)</li>
                  <li>• Standard Deviation - Volatility measure</li>
                  <li>• Correlation Analysis - Portfolio diversification</li>
                  <li>• Drawdown Analysis - Risk exposure</li>
                  <li>• Position Sizing - Capital allocation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mini Chart Example */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Price Chart</h3>
            <TradingViewWidget symbol={selectedSymbol} height={300} type="mini" />
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
        <div className="flex items-start space-x-3">
          <TrendingUp className="text-primary-600 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Professional Market Analysis</h4>
            <p className="text-sm text-gray-700">
              This dashboard integrates <strong>TradingView's professional-grade charting tools</strong> used by traders worldwide. 
              Features include real-time data, 100+ technical indicators, drawing tools, and multi-timeframe analysis.
              Perfect for fundamental and technical analysis of stocks, cryptocurrencies, forex, and commodities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

