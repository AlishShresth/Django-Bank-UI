import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type {
  BankAccount,
  BankAccountPayload,
  AccountState,
} from '@/types/banking';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

interface AccountStore extends AccountState {
  getAccounts: () => Promise<void>;
  createAccount: (data: BankAccountPayload) => Promise<void>;
  updateAccount: (data: BankAccount) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: Record<string, any> | null) => void;
}

export const useAccountStore = create<AccountStore>()(
  devtools(
    persist(
      (set, get) => ({
        account_list: [],
        isLoading: false,
        error: null,

        getAccounts: async () => {
          set({ isLoading: true });
          try {
            const response = await apiClient.get('/v1/accounts/accounts/');
            set({ account_list: response.data.account_list.results });
          } catch (error: any) {
            console.error(error);
            toast.error('Error fetching accounts');
            set({ account_list: [] });
          } finally {
            set({ isLoading: false });
          }
        },

        createAccount: async (data: BankAccountPayload) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.post(
              '/v1/accounts/accounts/',
              data
            );
            set((state) => ({
              account_list: [...state.account_list, response.data.account_list],
            }));
          } catch (error: any) {
            toast.error(
              error.response.data.account_list.error ||
                'Failed to create account'
            );
            set({
              error:
                error.response.data.account_list.error ||
                'Failed to create account',
            });
          } finally {
            set({ isLoading: false });
          }
        },
        updateAccount: async (data: BankAccount) => {},
        deleteAccount: async (id: string) => {},
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        setError: (error: Record<string, any> | null) => {
          set({ error });
        },
      }),
      {
        name: 'account-store',
        partialize: (state) => ({
          account_list: state.account_list,
          isLoading: state.isLoading,
          error: state.error,
        }),
      }
    )
  )
);
