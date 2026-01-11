import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORE_KEYS } from '@/store/storeKeys';

interface AuthState {
  isSignIn: boolean;
  accessToken: string;
}

interface AuthActions {
  setAuth: (auth: Partial<AuthState>) => void;
  resetAuth: () => void;
}

const initialState: AuthState = {
  isSignIn: false,
  accessToken: '',
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (auth) => set((state) => ({ ...state, ...auth })),
      resetAuth: () => set(initialState),
    }),
    {
      name: STORE_KEYS.AUTH_STATE,
    },
  ),
);
