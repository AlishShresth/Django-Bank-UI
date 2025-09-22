import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { VirtualCard, CardState } from '@/types/card';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

interface CardStore extends CardState {
  getCards: () => Promise<void>;
  // createAccount: (data: Transaction) => Promise<void>;
  // updateAccount: (data: Transaction) => Promise<void>;
  // deleteAccount: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: Record<string, any> | null) => void;
  resetCards: () => void;
}

const initialState = {
  card_list: [],
  isLoading: false,
  error: null,
  debit_cards: 0,
  credit_cards: 0,
};

export const useCardStore = create<CardStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        getCards: async () => {
          set({ isLoading: true });
          try {
            const response = await apiClient.get('/v1/cards/virtual-cards/');
            set({
              card_list: response.data.card_list.results,
              debit_cards:
                response.data.card_list.results[0]?.debit_cards_count,
              credit_cards:
                response.data.card_list.results[0]?.credit_cards_count,
            });
          } catch (error: any) {
            console.error(error);
            toast.error('Error fetching transactions');
            set({ card_list: [] });
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

        resetCards: () => set(initialState),
      }),
      {
        name: 'transaction-store',
        partialize: (state) => ({
          card_list: state.card_list,
          isLoading: state.isLoading,
          error: state.error,
          debit_cards: state.debit_cards,
          credit_cards: state.credit_cards,
        }),
      }
    )
  )
);
