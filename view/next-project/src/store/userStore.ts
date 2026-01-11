import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORE_KEYS } from '@/store/storeKeys';
import { User } from '@/type/common';

interface UserState {
  user: User;
}

interface UserActions {
  setUser: (user: Partial<User>) => void;
  resetUser: () => void;
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
      setUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
      resetUser: () => set({ user: initialUser }),
    }),
    {
      name: STORE_KEYS.USER_STATE,
    },
  ),
);
