import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
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
  login: (
    credentials: LoginCredentials
  ) => Promise<{ needsActivation: boolean }>;
  verifyOtp: (otp: OTP) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  activateAccountWithUid: (uid: string, token: string) => Promise<void>;
  resendActivation: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  getUser: () => User | null;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        email: null,
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        message: null,

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.post<LoginResponse>(
              '/v1/auth/login/',
              credentials
            );
            const { email } = response.data;
            if (response.status == 202) {
              set({ isLoading: false });
              return { needsActivation: true };
            } else {
              set({ email });
              set({ isLoading: false });
              return { needsActivation: false };
            }
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        verifyOtp: async (otp: OTP) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.post('/v1/auth/verify-otp/', otp);
            set({ isLoading: false, user: response.data.user, isAuthenticated: true });
          } catch (error) {
            set({ isLoading: false, isAuthenticated: false, user: null });
            throw error;
          }
        },

        resendOtp: async (email: string) => {
          set({ isLoading: true });
          try {
            await apiClient.post('/v1/auth/login/', { email });
            set({ isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.post<User>(
              '/v1/auth/users/',
              data
            );
            set({ user: response.data, isLoading: false });
          } catch (error) {
            set({ isLoading: false, user: null });
            throw error;
          }
        },

        activateAccountWithUid: async (uid: string, token: string) => {
          set({ isLoading: true });
          try {
            await apiClient.post('/v1/auth/users/activation/', { uid, token });
            set({ isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        resendActivation: async (email: string) => {
          try {
            if (!email) {
              throw 'User email not found';
            }
            set({ isLoading: true });
            await apiClient.post('/v1/auth/users/resend_activation/', {
              email,
            });
            set({ isLoading: false });
          } catch (error) {
            set({ isLoading: false });
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
        
        getUser: () => {
          return get().user;
        }
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
  )
);
