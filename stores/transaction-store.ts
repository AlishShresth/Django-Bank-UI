import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { Transaction, TransactionState } from '@/types/transaction';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

interface TransactionStore extends TransactionState {
  getTransactions: () => Promise<void>;
  // createAccount: (data: Transaction) => Promise<void>;
  // updateAccount: (data: Transaction) => Promise<void>;
  // deleteAccount: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: Record<string, any> | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  resetTransactions: () => void;
}

const initialState = {
  transaction_list: [],
  isLoading: false,
  error: null,
  count: 0,
  next: '',
  previous: '',
};

export const useTransactionStore = create<TransactionStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        getTransactions: async () => {
          set({ isLoading: true });
          try {
            const response = await apiClient.get('/v1/accounts/transactions/');
            set({
              transaction_list: response.data.transaction_list.results,
              count: response.data.transaction_list.count,
              next: response.data.transaction_list.next,
              previous: response.data.transaction_list.previous,
            });
          } catch (error: any) {
            console.error(error);
            toast.error('Error fetching transactions');
            set({ transaction_list: [] });
          } finally {
            set({ isLoading: false });
          }
        },

        // createAccount: async (data: BankAccount) => {},
        // updateAccount: async (data: BankAccount) => {},
        // deleteAccount: async (id: string) => {},

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: Record<string, any> | null) => {
          set({ error });
        },

        setTransactions: (transactions: Transaction[]) => {
          set({ transaction_list: transactions });
        },

        resetTransactions: () => set(initialState),
      }),
      {
        name: 'transaction-store',
        partialize: (state) => ({
          transaction_list: state.transaction_list,
          isLoading: state.isLoading,
          error: state.error,
          count: state.count,
          next: state.next,
          previous: state.previous,
        }),
      }
    )
  )
);
