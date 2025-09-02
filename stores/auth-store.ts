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
  login: (credentials: LoginCredentials) => Promise<void>;
  verifyOtp: (otp: OTP) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  activateAccountWithUid: (uid: string, token: string) => Promise<void>;
  resendActivation: (email?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string | null) => void;
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
            const { success, email, message } = response.data;
            if (response.status == 202) {
              set({ message });
            } else {
              set({ email });
            }
            set({ isLoading: false });
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

        resendActivation: async () => {
          const email = get().user?.email;
          if(!email){
            throw "User email not found"
          }
          set({ isLoading: true });
          try {
            await apiClient.post('/auth/users/resend_activation/', { email });
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

        setMessage: (message: string | null) => {
          set({ message });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          email: state.email,
          isAuthenticated: state.isAuthenticated,
          isLoading: state.isLoading,
          message: state.message,
        }),
      }
    )
  )
);
