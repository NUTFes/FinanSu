import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  isSignIn: boolean;
  accessToken: string;
  _hasHydrated: boolean;
}

interface AuthActions {
  setAuth: (auth: Pick<AuthState, 'isSignIn' | 'accessToken'>) => void;
  resetAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

const initialState: Pick<AuthState, 'isSignIn' | 'accessToken'> = {
  isSignIn: false,
  accessToken: '',
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      _hasHydrated: false,
      setAuth: (auth) => set(auth),
      resetAuth: () => set(initialState),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isSignIn: state.isSignIn, accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
