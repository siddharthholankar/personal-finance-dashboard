# Quick Start Guide

Get the Personal Finance Dashboard running in 5 minutes!

## Prerequisites
- Node.js v18+
- PostgreSQL running locally

## Quick Setup

### 1. Database Setup (30 seconds)
```bash
# Create database
psql postgres -c "CREATE DATABASE finance_dashboard;"
```

### 2. Backend Setup (1 minute)
```bash
cd backend

# Install dependencies
npm install

# Copy environment file (already created)
# Edit backend/.env if needed to change database credentials

# Initialize database
npm run init-db

# Start backend
npm run dev
```

Backend running at: http://localhost:5000 ✅

### 3. Frontend Setup (1 minute)
Open a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Environment file already configured
# Start frontend
npm run dev
```

Frontend running at: http://localhost:3000 ✅

### 4. Use the App!

1. Go to http://localhost:3000
2. Click "Sign up" 
3. Create your account
4. Start managing your finances!

## Default Configuration

The app is pre-configured with:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Database**: 
  - Host: localhost
  - Port: 5432
  - Name: finance_dashboard
  - User: postgres
  - Password: postgres

## Need to Change Defaults?

**Backend** (`backend/.env`):
- Database credentials: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, etc.
- Server port: `PORT`
- JWT secret: `JWT_SECRET` (IMPORTANT: Change for production!)

**Frontend** (`frontend/.env`):
- Backend API URL: `VITE_API_URL`

## Troubleshooting

**"Database connection failed"**
```bash
# Make sure PostgreSQL is running
pg_isready

# If not, start it:
brew services start postgresql@14  # macOS
sudo systemctl start postgresql    # Linux
```

**"Port already in use"**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will auto-select next available port

**Need more help?**
- See `SETUP_GUIDE.md` for detailed instructions
- Check `README.md` for full documentation

## First Steps After Setup

1. **Create an Account** (Bank or Investment)
   - Dashboard → Quick Actions → Add Transaction
   - Or go to Transactions page

2. **Add a Transaction**
   - Click "Add Transaction"
   - Fill in amount, category, date
   - Save!

3. **Add Portfolio Holdings**
   - Go to Portfolio page
   - Add stocks/crypto with symbol, shares, prices

4. **View Analytics**
   - Go to Analytics page
   - See your spending patterns
   - Export data

## Production Deployment

For production deployment instructions, see `README.md`.

Quick deploy options:
- **Frontend**: Vercel (recommended)
- **Backend**: Railway, Render, or Heroku
- **Database**: ElephantSQL or managed PostgreSQL

---

Enjoy managing your finances! 💰

