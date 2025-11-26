import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SparrowsClosetPage } from './pages/SparrowsClosetPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAnalytics } from './hooks/useAnalytics';
import './styles/global.css';

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAnalytics();
  return <>{children}</>;
};

function App() {
  try {
    return (
      <BrowserRouter>
        <AnalyticsWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sparrows-closet" element={<SparrowsClosetPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </AnalyticsWrapper>
      </BrowserRouter>
    );
  } catch (error) {
    console.error('App error:', error);
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Error Loading App</h1>
        <p>Please check the console for details.</p>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

export default App;

