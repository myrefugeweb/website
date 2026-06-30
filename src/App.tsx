import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { HomePage } from './pages/HomePage';
import { SparrowsClosetPage } from './pages/SparrowsClosetPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { useAnalytics } from './hooks/useAnalytics';
import { StagingProvider } from './contexts/StagingContext';
import './styles/global.css';

const AdminLogin = lazy(() =>
  import('./pages/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboard/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminHelp = lazy(() =>
  import('./pages/AdminHelp').then((m) => ({ default: m.AdminHelp }))
);
const ChangePassword = lazy(() =>
  import('./pages/ChangePassword').then((m) => ({ default: m.ChangePassword }))
);
const ProtectedRoute = lazy(() =>
  import('./components/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute }))
);

const RouteFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40vh',
      color: 'var(--color-text-secondary)',
    }}
  >
    Loading…
  </div>
);

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
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <StagingProvider stagingMode={false}>
                  <HomePage />
                </StagingProvider>
              } 
            />
            <Route 
              path="/sparrows-closet" 
              element={
                <StagingProvider stagingMode={false}>
                  <SparrowsClosetPage />
                </StagingProvider>
              } 
            />
            <Route 
              path="/privacy" 
              element={
                <StagingProvider stagingMode={false}>
                  <PrivacyPage />
                </StagingProvider>
              } 
            />
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
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin/help"
              element={
                <ProtectedRoute>
                  <AdminHelp />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
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

