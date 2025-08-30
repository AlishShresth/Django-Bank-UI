'use client';

import type React from 'react';
import { Sidebar } from './sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useEffect(() => {
    // Function to handle route changes
    const handleRouteChange = () => {
      const route = window.location.pathname;

      if (route === '/profile') {
        document.documentElement.classList.add('overflow-hidden');
      } else {
        document.documentElement.classList.remove('overflow-hidden');
      }
    };

    // Run on initial mount
    handleRouteChange();

    // Listen for browser navigation (back/forward buttons)
    window.addEventListener('popstate', handleRouteChange);

    // Cleanup: Remove event listener and class on unmount
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, []);
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
