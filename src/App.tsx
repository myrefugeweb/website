import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { SparrowsClosetPage } from './pages/SparrowsClosetPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { ChangePassword } from './pages/ChangePassword';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAnalytics } from './hooks/useAnalytics';
import './styles/global.css';

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAnalytics();
  return <>{children}</>;
};

// Component to handle 404 redirects
const RedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a redirect path stored from 404.html
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      // Clear it so we don't redirect again
      sessionStorage.removeItem('redirectPath');
      // Navigate to the stored path
      navigate(redirectPath + window.location.search + window.location.hash, { replace: true });
      return;
    }

    // Also handle direct /index.html access
    const path = window.location.pathname;
    if (path === '/index.html' || path.startsWith('/index.html/')) {
      const actualPath = path.replace('/index.html', '') || '/';
      navigate(actualPath + window.location.search + window.location.hash, { replace: true });
    }
  }, [navigate]);

  return null;
};

function App() {
  try {
    // Get base path from Vite config or default to '/'
    const basePath = import.meta.env.BASE_URL || '/';
    
    return (
      <BrowserRouter basename={basePath}>
        <AnalyticsWrapper>
          <RedirectHandler />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sparrows-closet" element={<SparrowsClosetPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/change-password" 
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
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

