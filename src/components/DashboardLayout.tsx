
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  console.log('DashboardLayout rendering:', { isAuthenticated, loading, user: !!user, role: user?.role });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Redirecionamento baseado em role após login
  if (user && location.pathname === '/dashboard') {
    console.log('Redirecting based on role:', user.role);
    switch (user.role) {
      case 'social':
        return <Navigate to="/social-media" replace />;
      case 'design':
        return <Navigate to="/designer" replace />;
      case 'admin':
        // Admin fica no dashboard padrão
        break;
      default:
        break;
    }
  }

  console.log('User authenticated, rendering dashboard');

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
