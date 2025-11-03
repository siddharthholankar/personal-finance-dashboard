# Personal Finance Dashboard - Backend

RESTful API backend for the Personal Finance Dashboard application.

## Tech Stack

- Node.js with Express
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
   - Install PostgreSQL if not already installed
   - Create a new database: `finance_dashboard`

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials and JWT secret

4. Initialize the database:
```bash
npm run init-db
```

5. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id` - Get account by ID

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Portfolio
- `GET /api/portfolio` - Get all portfolio holdings
- `POST /api/portfolio` - Add new holding
- `PUT /api/portfolio/:id` - Update holding
- `DELETE /api/portfolio/:id` - Delete holding

### Analytics
- `GET /api/analytics/monthly-summary` - Get monthly income/expense summary
- `GET /api/analytics/category-breakdown` - Get spending by category
- `GET /api/analytics/recent-summary` - Get recent activity summary
- `GET /api/analytics/portfolio-summary` - Get portfolio performance

## Deployment

### Environment Variables for Production
Set the following environment variables:
- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `NODE_ENV=production`

### Recommended Hosting Platforms
- Heroku
- Railway
- Render
- DigitalOcean App Platform

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- SQL injection protection with parameterized queries
- CORS configuration
- Input validation with express-validator
- Error handling middleware

