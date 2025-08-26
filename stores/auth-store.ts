import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  OTP,
} from '@/types/auth';
import { apiClient } from '@/lib/axios';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  verifyOtp: (otp: OTP) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      email: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post<LoginResponse>(
            '/v1/auth/login/',
            credentials
          );
          const { success, email } = response.data;
          set({ email, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOtp: async (otp: OTP) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post('/v1/auth/verify-otp/', otp);
          const { user } = response.data;
          set({ isLoading: false, user, isAuthenticated: true });
        } catch (error) {
          set({ isLoading: false, isAuthenticated: false, user: null });
          throw error;
        }
      },

      resendOtp: async (email: string) => {
        set({ isLoading: true });
        try {
          await apiClient.post('/v1/auth/resend-otp/', { email });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post<User>('/v1/auth/users/', data);
          set({ user: response.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false, user: null });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post('/v1/auth/logout/');
          set({
            isLoading: false,
            email: null,
            isAuthenticated: false,
            user: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            email: null,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      refreshUser: async () => {
        try {
          const response = await apiClient.post('/v1/auth/refresh/');
        } catch (error) {
          get().logout();
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      }),
    }
  )
);
