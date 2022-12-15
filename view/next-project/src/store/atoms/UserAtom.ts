import { STORE_KEYS } from '@/store/storeKeys';
import { User } from '@/type/common';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userAtom = atom<User>({
  key: STORE_KEYS.USER_STATE,
  default: {
    id: 0,
    name: '',
    bureauID: 0,
    roleID: 0,
    createdAt: '',
    updatedAt: '',
  },
  effects_UNSTABLE: [persistAtom],
});
