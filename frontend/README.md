# Personal Finance Dashboard - Frontend

Modern, responsive React application for managing personal finances.

## Features

- 🔐 User authentication with JWT
- 📊 Interactive dashboard with key metrics
- 💰 Transaction management with filters
- 📈 Portfolio tracking and performance
- 📉 Analytics with beautiful charts
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- Vite (build tool)
- Axios (HTTP client)
- React Router (routing)
- Lucide React (icons)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the API URL if different from default

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── components/      # Reusable UI components
│   └── Layout.tsx   # Main layout with sidebar
├── context/         # React context providers
│   └── AuthContext.tsx
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Portfolio.tsx
│   └── Analytics.tsx
├── services/        # API service layer
│   └── api.ts
├── App.tsx          # Root component with routing
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

### Other Platforms

The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

Just build the app and upload the `dist` directory.

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Features Overview

### Dashboard
- Total balance across all accounts
- Monthly income and expenses
- Portfolio value and gains
- Recent transactions
- Quick action buttons

### Transactions
- Add, edit, and delete transactions
- Filter by type (income/expense)
- Link to accounts
- Category management
- Date selection

### Portfolio
- Track investment holdings
- Real-time value calculations
- Gain/loss percentage
- Update current prices
- Performance metrics

### Analytics
- Monthly income vs expenses chart
- Category breakdown pie chart
- Bar chart comparisons
- Export data to CSV
- Savings rate calculation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

