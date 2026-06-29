import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AutomationPage } from './pages/AutomationPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { LandingPage } from './pages/LandingPage';
import { LogsPage } from './pages/LogsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <ToastProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="automation" element={<AutomationPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </ToastProvider>
    </AuthProvider>
  );
}
