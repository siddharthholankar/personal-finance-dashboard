# Personal Finance Dashboard - Setup Guide

Complete step-by-step guide to get your Personal Finance Dashboard up and running.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or install via Homebrew (Mac): `brew install postgresql@14`
   - Verify installation: `psql --version`

3. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

## Step 1: Database Setup

### Option A: Local PostgreSQL

1. **Start PostgreSQL service**
   ```bash
   # macOS (Homebrew)
   brew services start postgresql@14
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows
   # Start from Services or PostgreSQL application
   ```

2. **Create database**
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE finance_dashboard;
   
   # Exit
   \q
   ```

### Option B: Cloud Database (Optional)

You can use cloud providers like:
- **ElephantSQL** (Free tier available)
- **Heroku Postgres**
- **AWS RDS**
- **DigitalOcean Managed Databases**

## Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env` file already exists, but you should update it:
   ```bash
   # Open .env file and update these values:
   DB_HOST=localhost          # Your database host
   DB_PORT=5432              # PostgreSQL port
   DB_NAME=finance_dashboard  # Database name
   DB_USER=postgres          # Your PostgreSQL username
   DB_PASSWORD=postgres      # Your PostgreSQL password
   JWT_SECRET=your_very_secret_key_change_this  # Change this!
   ```

4. **Initialize database tables**
   ```bash
   npm run init-db
   ```
   
   You should see: "Database tables created successfully!"

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   Server should start on: http://localhost:5000

## Step 3: Frontend Setup

1. **Open a new terminal** (keep backend running)

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   
   The `.env` file already exists with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
   
   Only change this if your backend is on a different URL.

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   
   App should start on: http://localhost:3000

## Step 4: Access the Application

1. **Open your browser** and go to: http://localhost:3000

2. **Create an account**
   - Click "Sign up"
   - Enter your name, email, and password (min 6 characters)
   - Click "Create Account"

3. **You're in!** Start using the dashboard:
   - Add accounts (bank or investment)
   - Create transactions
   - Add portfolio holdings
   - View analytics

## Troubleshooting

### Backend Issues

**Error: "Connection refused" or "Database connection failed"**
- Ensure PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Verify database exists: `psql -l`

**Error: "Port 5000 already in use"**
- Change PORT in `.env` file
- Kill the process using port 5000:
  ```bash
  # macOS/Linux
  lsof -ti:5000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

**Error: "JWT_SECRET is not defined"**
- Ensure `.env` file exists in backend directory
- Check JWT_SECRET is set in `.env`

### Frontend Issues

**Error: "Failed to fetch"**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend `.env`
- Check browser console for CORS errors

**Port 3000 already in use**
- Vite will automatically try port 3001, 3002, etc.
- Or manually specify: `vite --port 3001`

**Blank page after login**
- Check browser console for errors
- Verify token is stored in localStorage
- Try logging out and back in

### Database Issues

**Tables not created**
- Run `npm run init-db` again from backend directory
- Check PostgreSQL logs for errors
- Manually verify tables:
  ```bash
  psql finance_dashboard
  \dt
  ```

**Cannot connect to database**
- Check PostgreSQL is running: `pg_isready`
- Verify credentials: `psql -U postgres -d finance_dashboard`
- Check pg_hba.conf for connection permissions

## Production Deployment

### Backend Deployment (Railway Example)

1. Create account on Railway.app
2. Create new project
3. Connect GitHub repository
4. Set environment variables:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Deploy

### Frontend Deployment (Vercel)

1. Create account on Vercel.com
2. Import GitHub repository
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL` (your backend URL)
5. Deploy

## Next Steps

1. **Customize the app**
   - Modify colors in `tailwind.config.js`
   - Add new categories
   - Adjust date formats

2. **Add sample data**
   - Create a few accounts
   - Add some transactions
   - Add portfolio holdings
   - View the analytics page

3. **Explore features**
   - Try filtering transactions
   - Update portfolio prices
   - Export data to CSV
   - Check monthly summaries

## Support

If you encounter issues:

1. Check this guide again
2. Review error messages in terminal/browser console
3. Check the main README.md
4. Look at the code comments
5. Search for similar issues online

## Security Reminders

- Change JWT_SECRET in production
- Use strong database passwords
- Never commit `.env` files to git
- Use HTTPS in production
- Set secure CORS origins in production
- Keep dependencies updated

## Useful Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server
npm run init-db     # Initialize database

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build

# Database
psql finance_dashboard    # Connect to database
\dt                      # List tables
\d users                 # Describe users table
\q                       # Quit psql
```

---

Happy budgeting! 💰📊

