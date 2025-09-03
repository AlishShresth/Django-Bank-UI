import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { apiClient } from '@/lib/axios';

interface ApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  current: T | null;
}

interface ApiActions<T> {
  fetch: (endpoint: string, params?: Record<string, any>) => Promise<void>;
  create: (endpoint: string, item: Omit<T, 'id'>) => Promise<void>;
  update: (
    endpoint: string,
    id: string | number,
    item: Partial<T>
  ) => Promise<void>;
  delete: (endpoint: string, id: string | number) => Promise<void>;
  getById: (endpoint: string, id: string | number) => Promise<void>;
  clearCurrent: () => void;
  clearError: () => void;
  reset: () => void;
}

export function createApiStore<T extends { id: string | number }>(
  initialState?: Partial<ApiState<T>>
) {
  return create<ApiState<T> & ApiActions<T>>()(
    devtools(
      persist(
        (set, get) => ({
          data: [],
          loading: false,
          error: null,
          current: null,
          ...initialState,

          fetch: async (endpoint: string, params?: Record<string, any>) => {
            set({ loading: true, error: null });
            try {
              const response = await apiClient.get(endpoint, { params });
              const {results} = response.data;
              set({ data: results, loading: false });
            } catch (err: any) {
              set({
                error: err.response.data || 'Failed to fetch data',
                loading: false,
              });
            }
          },

          create: async (endpoint: string, item: Omit<T, 'id'>) => {
            set({ loading: true, error: null });
            try {
              const response = await apiClient.post(endpoint, item);
              set((state) => ({
                data: [...state.data, response.data],
                loading: false,
              }));
            } catch (err: any) {
              set({
                error: err.response.data || 'An error occurred',
                loading: false,
              });
            }
          },

          update: async (
            endpoint: string,
            id: string | number,
            item: Partial<T>
          ) => {
            set({ loading: true, error: null });
            try {
              const response = await apiClient.patch(`${endpoint}/${id}`, item);
              set((state) => ({
                data: state.data.map((i) =>
                  i.id === id ? { ...i, ...response.data } : i
                ),
                current:
                  state.current?.id === id
                    ? { ...state.current, ...response.data }
                    : state.current,
                loading: false,
              }));
            } catch (err: any) {
              set({
                error: err.response.data || 'An error occurred',
                loading: false,
              });
            }
          },

          delete: async (endpoint: string, id: string | number) => {
            set({ loading: true, error: null });
            try {
              const response = await apiClient.delete(`${endpoint}/${id}`);
              set((state) => ({
                data: state.data.filter((i) => i.id !== id),
                current: state.current?.id === id ? null : state.current,
                loading: false,
              }));
            } catch (err: any) {
              set({
                error: err.response.data || 'An error occurred',
                loading: false,
              });
            }
          },

          getById: async (endpoint: string, id: string | number) => {
            set({ loading: true, error: null });
            try {
              const response = await apiClient.get(`${endpoint}/${id}`);
              set({ current: response.data, loading: false });
            } catch (err: any) {
              set({
                error: err.response.data || 'An error occurred',
                loading: false,
              });
            }
          },

          clearCurrent: () => set({ current: null }),

          clearError: () => set({ error: null }),

          reset: () =>
            set({
              data: [],
              loading: false,
              error: null,
              current: null,
            }),
        }),
        {
          name: 'api-storage',
          partialize: (state) => ({ data: state.data }),
        }
      ),
      { name: 'api-store' }
    )
  );
}
