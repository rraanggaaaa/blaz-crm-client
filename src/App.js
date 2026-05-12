import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Main App Content (protected by auth)
const AppContent = () => {
  const { isAuthenticated, login } = useAuth();

  // Jika belum login, tampilkan halaman login
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // Jika sudah login, tampilkan DashboardPage (sudah berisi semua halaman)
  return <DashboardPage />;
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