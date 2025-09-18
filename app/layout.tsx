import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthGuard } from '@/components/auth/auth-guard';
import { SessionTimeout } from '@/components/security/session-timeout';
import { ActivityMonitor } from '@/components/security/activity-monitor';
import { ErrorBoundary } from '@/components/error/error-boundary';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SecureBank - Your Trusted Banking Partner',
  description:
    'Modern, secure banking solutions for individuals and businesses',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthGuard>
            <SessionTimeout />
            <ActivityMonitor />
            <Toaster />
            {children}
          </AuthGuard>
        </ErrorBoundary>
      </body>
    </html>
  );
}
