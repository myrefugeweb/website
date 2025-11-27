import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SparrowsClosetPage } from './pages/SparrowsClosetPage';
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
    
    return (
      <BrowserRouter basename={basePath}>
        <AnalyticsWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sparrows-closet" element={<SparrowsClosetPage />} />
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

