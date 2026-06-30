import { OnboardingProvider } from '../../contexts/OnboardingContext';
import { AdminDashboard } from './AdminDashboard';

export const AdminDashboardPage = () => (
  <OnboardingProvider>
    <AdminDashboard />
  </OnboardingProvider>
);
