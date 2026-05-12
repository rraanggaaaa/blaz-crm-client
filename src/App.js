import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import PipelinePage from './pages/PipelinePage';
import BlastPage from './pages/BlastPage';
import ConnectPage from './pages/ConnectPage';
import BlastLogPage from './pages/BlastLogPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Main App Content (protected by auth)
const AppContent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [waConnected] = useState(true);

  // Jika belum login, tampilkan halaman login
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'pipeline':
        return <PipelinePage />;
      case 'blast':
        return <BlastPage />;
      case 'blastlog':
        return <BlastLogPage />;
      case 'connect':
        return <ConnectPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout 
      activePage={activePage}
      onNavigate={setActivePage}
      onBlastClick={() => setActivePage('blast')}
      waConnected={waConnected}
      user={user}
      onLogout={logout}
    >
      {renderPage()}
    </Layout>
  );
};

// Main App with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;