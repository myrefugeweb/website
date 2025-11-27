import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  try {
    // Get base path from Vite config or default to '/'
    const basePath = import.meta.env.BASE_URL || '/';
    
    // Handle GitHub Pages 404 redirect
    // When 404.html redirects to index.html with a path, we need to handle it
    useEffect(() => {
      // Check if we're at index.html with a path (from 404 redirect)
      const path = window.location.pathname;
      if (path.startsWith('/index.html')) {
        // Extract the actual path from /index.html/path
        const actualPath = path.replace('/index.html', '') || '/';
        // Update the URL without reloading
        window.history.replaceState({}, '', actualPath + window.location.search + window.location.hash);
      }
    }, []);
    
    return (
      <BrowserRouter basename={basePath}>
        <AnalyticsWrapper>
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

