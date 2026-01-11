import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORE_KEYS } from '@/store/storeKeys';

interface AuthState {
  isSignIn: boolean;
  accessToken: string;
  hasHydrated: boolean;
}

interface AuthActions {
  setAuth: (auth: Partial<AuthState>) => void;
  resetAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialState: AuthState = {
  isSignIn: false,
  accessToken: '',
  hasHydrated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (auth) => set((state) => ({ ...state, ...auth })),
      resetAuth: () => set(initialState),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: STORE_KEYS.AUTH_STATE,
      partialize: (state) => ({
        isSignIn: state.isSignIn,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error) {
          state?.setHasHydrated(true);
        }
      },
    },
  ),
);
