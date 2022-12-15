import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { STORE_KEYS } from '@/store/storeKeys';

const { persistAtom } = recoilPersist();

export const authAtom = atom({
  key: STORE_KEYS.AUTH_STATE,
  default: {
    isSignIn: false,
    accessToken: '',
  },
  effects_UNSTABLE: [persistAtom],
});
