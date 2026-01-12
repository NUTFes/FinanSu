import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '@/type/common';

interface UserState {
  user: User;
  _hasHydrated: boolean;
}

interface UserActions {
  setUser: (user: User) => void;
  resetUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

const initialUser: User = {
  id: 0,
  name: '',
  bureauID: 0,
  roleID: 0,
  createdAt: '',
  updatedAt: '',
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      user: initialUser,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      resetUser: () => set({ user: initialUser }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
