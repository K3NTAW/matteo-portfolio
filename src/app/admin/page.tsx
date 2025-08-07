'use client';
import { useState, useEffect } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoginForm from '@/components/admin/LoginForm';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const admin = JSON.parse(adminSession);
        if (admin && admin.email) {
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem('adminSession');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
} 