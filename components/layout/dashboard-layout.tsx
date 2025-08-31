'use client';

import type React from 'react';
import { BankingSidebar } from './banking-sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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
