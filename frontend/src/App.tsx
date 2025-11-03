import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Portfolio from './pages/Portfolio';
import Analytics from './pages/Analytics';
import MarketAnalysis from './pages/MarketAnalysis';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/market-analysis" element={<MarketAnalysis />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;

