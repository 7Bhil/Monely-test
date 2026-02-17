import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/Auth';
import OnboardingPage from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import WalletsPage from './pages/Wallets';
import TransactionsPage from './pages/Transactions';
import SettingsPage from './pages/Settings';
import AnalyticsPage from './pages/Analytics';
import Layout from './components/layout/Layout';
import { MobilePromoModal } from './components/modals/MobilePromoModal';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
      return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Layout Wrapper to handle Mobile Promo
const AppLayout = () => {
    const { user } = useAuth();
    const [showMobilePromo, setShowMobilePromo] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Show promo only on dashboard on first load or login
        if (user && location.pathname === '/') {
            // Check if looking at dashboard and haven't seen promo this session
            const hasSeenPromo = sessionStorage.getItem('hasSeenMobilePromo');
            if (!hasSeenPromo) {
                setShowMobilePromo(true);
                sessionStorage.setItem('hasSeenMobilePromo', 'true');
            }
        }
    }, [user, location]);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/wallets" element={<WalletsPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
            <MobilePromoModal open={showMobilePromo} onOpenChange={setShowMobilePromo} />
        </Layout>
    );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
