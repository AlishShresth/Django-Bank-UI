import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Profile,
  NextOfKin,
  ProfileState,
} from '@/types/profile';
import { apiClient } from '@/lib/axios';

interface ProfileStore extends ProfileState {
  getProfile: () => Promise<void>;
  updateProfile: (data: Profile) => Promise<void>;
  getNextOfKin: () => Promise<void>;
  updateNextOfKin: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist((set, get) => ({
    profile: null,
    next_of_kin: null,
    isLoading: false,

    getProfile: async () => {
      set({ isLoading: true });
      try {
        const response = await apiClient.get(
          '/v1/profiles/my-profile/'
        );
        set({ profile: response.data.profile });
        console.log('response data', response.data.profile, get().profile);
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    updateProfile: async (profile_data: Profile) => {
      set({ isLoading: true });
      try {
        const response = await apiClient.patch(
          '/v1/profiles/my-profile/',
          profile_data
        );
        const { message, data } = response.data;
        set({ profile: data, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    getNextOfKin: async () => {
      set({ isLoading: true });
      try {
        const response = await apiClient.get(
          '/v1/profiles/my-profile/next-of-kin/'
        );
        const { next_of_kin } = response.data.next_of_kin.results;
        set({ next_of_kin, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    updateNextOfKin: async () => {},

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
  }), {
    name: 'profile-storage',
    partialize: (state) => ({
      profile: state.profile,
      next_of_kin: state.next_of_kin,
      isLoading: state.isLoading,
    })
  })
);
