'use client';

import type React from 'react';
import { useEffect } from 'react';
import { BankingSidebar } from './banking-sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
      <SidebarProvider>
        <BankingSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
