# 💰 Personal Finance Dashboard & Market Analysis Platform

A professional-grade full-stack financial analysis platform with **TradingView integration**, real-time market data, and advanced portfolio management capabilities.

![Dashboard Preview](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![TradingView](https://img.shields.io/badge/TradingView-131722?logo=tradingview&logoColor=white)

## 🌟 Overview

A comprehensive financial management and market analysis platform that combines:
- 📊 **Professional Market Analysis** with TradingView charts
- 💼 **Investment Portfolio Management** with real-time tracking
- 💰 **Personal Finance** tracking across multiple accounts
- 📈 **Advanced Analytics** with interactive visualizations
- 🎯 **Technical & Fundamental Analysis** tools

**Perfect for**: Financial Analysts, Traders, Investors, and Personal Finance Enthusiasts

## ✨ Features

### 🚀 Market Analysis (NEW!)
- **TradingView Professional Charts** - Full-featured charting with 100+ technical indicators
- **Real-Time Market Data** - Live prices for stocks, crypto, forex, and commodities
- **Technical Analysis Tools** - RSI, MACD, Moving Averages, Bollinger Bands, Volume Analysis
- **Market Overview Dashboard** - Track global indices, futures, and trending assets
- **Multi-Asset Support** - Stocks (NASDAQ, NYSE), Cryptocurrencies, Forex, Futures
- **Interactive Charts** - Drawing tools, timeframe selection, and indicator customization

### 💼 Portfolio Management
- **Multi-Asset Portfolio** - Track stocks, crypto, ETFs, and other investments
- **Real-Time Valuation** - Current prices and portfolio value calculation
- **Performance Metrics** - ROI, gain/loss ($ and %), total returns
- **Position Tracking** - Shares, purchase price, current price, and profit/loss
- **Portfolio Analytics** - Total invested, current value, unrealized gains
- **Visual Performance** - Color-coded gains and losses with trending indicators

### 💰 Personal Finance
- **Transaction Management** - Track income and expenses with categories
- **Multiple Accounts** - Manage bank and investment accounts separately
- **Budget Tracking** - Monitor spending patterns and monthly trends
- **Category Analysis** - Visualize spending by category
- **Cash Flow** - Income vs. expense tracking

### 📊 Advanced Analytics
- **Interactive Charts** - Recharts-powered visualizations
- **Monthly Trends** - Income and expense analysis over time
- **Category Breakdown** - Pie charts for spending distribution
- **Recent Activity** - Quick summary of latest transactions
- **Portfolio Performance** - Investment returns and growth
- **Export Capabilities** - Download data for external analysis

### 🔧 Technical Features
- **RESTful API** - Clean, documented endpoints
- **PostgreSQL Database** - Optimized queries and indexing
- **JWT Authentication** - Secure token-based auth (can be disabled for demo)
- **TypeScript** - Type-safe frontend and strong typing
- **Responsive Design** - Mobile-first, works on all devices
- **Real-Time Updates** - Dynamic data refreshing
- **Error Handling** - Comprehensive validation and error messages
- **Production Ready** - Environment configuration and build optimization

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Project Structure

```
Portfolio/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.tsx          # Root component
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Utility scripts
│   │   └── server.js        # Server entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Portfolio
```

2. **Set up the backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials and JWT secret
npm run init-db
npm run dev
```

3. **Set up the frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend API URL
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE finance_dashboard;
```

3. Update the `.env` file in the backend directory with your database credentials

4. Initialize the database tables:
```bash
cd backend
npm run init-db
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts/:id` - Get account by ID

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Portfolio
- `GET /api/portfolio` - Get all holdings
- `POST /api/portfolio` - Add holding
- `PUT /api/portfolio/:id` - Update holding
- `DELETE /api/portfolio/:id` - Delete holding

### Analytics
- `GET /api/analytics/monthly-summary` - Monthly income/expense summary
- `GET /api/analytics/category-breakdown` - Spending by category
- `GET /api/analytics/recent-summary` - Recent activity summary
- `GET /api/analytics/portfolio-summary` - Portfolio performance

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `frontend`
4. Add environment variable: `VITE_API_URL`
5. Deploy

### Backend (Railway/Render/Heroku)

1. Create a new project
2. Connect your repository
3. Set environment variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_dashboard
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Security Considerations

- Passwords are hashed using bcryptjs with salt rounds
- JWT tokens expire after 7 days
- SQL injection protection with parameterized queries
- CORS configured for specific origins in production
- Input validation on all API endpoints
- Error messages don't expose sensitive information

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or open an issue in the repository.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

## 🎯 Market Analysis Features

### What Makes This Special?

This dashboard integrates **TradingView** - the world's most popular charting platform used by 50+ million traders and investors. Features include:

- **100+ Technical Indicators**: RSI, MACD, Bollinger Bands, Ichimoku, Fibonacci, and more
- **Drawing Tools**: Trend lines, support/resistance, patterns, and annotations
- **Multiple Timeframes**: From 1-minute to monthly charts
- **Real-Time Data**: Live prices and market updates
- **Global Markets**: Stocks, crypto, forex, commodities, bonds, and indices
- **Professional Grade**: Same tools used by institutional traders

### Investment Analysis Capabilities

1. **Technical Analysis**
   - Momentum indicators (RSI, Stochastic)
   - Trend indicators (Moving Averages, MACD)
   - Volatility indicators (Bollinger Bands, ATR)
   - Volume analysis

2. **Market Overview**
   - Major indices (S&P 500, NASDAQ, Dow Jones)
   - Global markets (Asia, Europe, Americas)
   - Cryptocurrency markets
   - Commodities and forex

3. **Portfolio Metrics**
   - Return on Investment (ROI)
   - Gain/Loss calculation
   - Performance tracking
   - Asset allocation

## 📸 Screenshots

> **Market Analysis Dashboard**
> Professional TradingView charts with real-time data and technical indicators

> **Portfolio Management**
> Track your investments with detailed performance metrics

> **Analytics Dashboard**
> Visualize your financial data with interactive charts

## 🚀 Roadmap

### ✅ Completed
- [x] TradingView integration
- [x] Real-time market data
- [x] Portfolio management
- [x] Transaction tracking
- [x] Advanced analytics
- [x] Technical analysis tools
- [x] Multi-asset support

### 🔜 Coming Soon
- [ ] Real-time stock price API (Alpha Vantage/Yahoo Finance)
- [ ] Options trading analysis (Greeks, IV)
- [ ] Backtesting engine for strategies
- [ ] AI-powered investment recommendations
- [ ] Budget planning and alerts
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Bank account integration (Plaid)
- [ ] Tax reporting and optimization
- [ ] Social features (share portfolios)

## 🎓 Skills Demonstrated

This project showcases expertise in:

### Financial Analysis
- Portfolio management and optimization
- Technical analysis and chart interpretation
- Fundamental analysis principles
- Risk management strategies
- Performance attribution
- Asset allocation

### Software Development
- Full-stack web development
- RESTful API design
- Database design and optimization
- TypeScript/JavaScript
- React and modern frontend
- Node.js backend development

### FinTech
- Real-time data integration
- Financial calculations and metrics
- Data visualization
- Trading platform integration
- Market data processing

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with 💰 by Siddharth Holankar**

Demonstrating expertise in Financial Analysis, Data Visualization, and Full-Stack Development

*Perfect for roles in: Financial Analysis, Quantitative Analysis, FinTech Development, Data Analysis, Full-Stack Development*

