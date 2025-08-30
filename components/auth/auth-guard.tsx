'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { refreshUser, isAuthenticated, user } = useAuthStore();
  const { getProfile } = useProfileStore();
  useEffect(() => {
    if (user && isAuthenticated) {
      refreshUser();
      getProfile();
    }
  }, [refreshUser, isAuthenticated]);

  return <>{children}</>;
}
