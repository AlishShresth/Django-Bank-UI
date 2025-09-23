import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { Profile, NextOfKin, ProfileState } from '@/types/profile';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

interface ProfileStore extends ProfileState {
  getProfile: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
  getNextOfKin: (id: string) => Promise<void>;
  setNextOfKin: (data: NextOfKin) => Promise<void>;
  updateNextOfKin: (data: NextOfKin) => Promise<void>;
  deleteNextOfKin: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setProfile: (profileData: any) => void;
  setError: (error: Record<string, any> | null) => void;
  resetProfile: () => void;
}

const initialState = {
  profile: null,
  next_of_kin_list: [] as NextOfKin[],
  next_of_kin: null,
  isLoading: false,
  error: null,
};

export const useProfileStore = create<ProfileStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        getProfile: async () => {
          set({ isLoading: true });
          try {
            const response = await apiClient.get('/v1/profiles/my-profile/');
            set({ profile: response.data.profile });
            set({ next_of_kin_list: response.data.profile.next_of_kin });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        updateProfile: async (formData: FormData) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.patch(
              '/v1/profiles/my-profile/',
              formData,
              {
                headers: {
                  'Content-Type': undefined,
                },
              }
            );
            const { data } = response.data.profile;
            toast.success(
              response.data.profile.message || 'Profile Updated Successfully'
            );
            set({ profile: data, isLoading: false });
          } catch (error: any) {
            set({
              isLoading: false,
              error: { profile: error?.response?.data?.errors },
            });
            throw error;
          }
        },

        getNextOfKin: async (id: string = '') => {
          set({ isLoading: true });
          try {
            const response = await apiClient.get(
              '/v1/profiles/my-profile/next-of-kin/' + id
            );
            if (id && id != '') {
              const { next_of_kin } = response.data.next_of_kin;
              set({ next_of_kin });
            } else {
              const { next_of_kin_list } = response.data.next_of_kin.results;
              set({ next_of_kin_list });
            }
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        setNextOfKin: async (data: NextOfKin) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.post(
              '/v1/profiles/my-profile/next-of-kin/',
              data
            );
            set({
              isLoading: false,
              next_of_kin: response.data.next_of_kin,
              error: null,
            });
            get().next_of_kin_list?.push(response.data.next_of_kin);
          } catch (error: any) {
            set({
              isLoading: false,
              error: { next_of_kin: error.response.data.next_of_kin },
            });
            throw error.response.data.next_of_kin || error.response.data;
          }
        },

        updateNextOfKin: async (data: NextOfKin) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.patch(
              `/v1/profiles/my-profile/next-of-kin/${data.id}/`,
              data
            );
            const updatedNextOfKin = response.data.next_of_kin;
            get().getProfile();
          } catch (error: any) {
            set({
              isLoading: false,
              error: { next_of_kin: error.response.data.next_of_kin },
            });
            throw error;
          }
        },

        deleteNextOfKin: async (id: string) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.delete(
              `/v1/profiles/my-profile/next-of-kin/${id}/`
            );
            get().getProfile();
          } catch (error: any) {
            set({
              isLoading: false,
              error: { next_of_kin: error.response.data.errors },
            });
            throw error.response.data.errors;
          }
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setProfile: (profileData: any) => {
          set({ profile: profileData });
        },

        setError: (error: Record<string, any> | null) => {
          set({ error });
        },

        resetProfile: () => set(initialState),
      }),
      {
        name: 'profile-storage',
        partialize: (state) => ({
          profile: state.profile,
          next_of_kin: state.next_of_kin,
          next_of_kin_list: state.next_of_kin_list,
          isLoading: state.isLoading,
          error: state.error,
        }),
      }
    )
  )
);
