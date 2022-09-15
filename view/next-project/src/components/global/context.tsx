import React, {
  FC,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { get_with_token } from '@api/api_methods';

interface User {
  id: number;
  name: string;
  bureau_id: number;
  role_id: number;
}

export type State = {
  user: User;
  isSignIn: boolean;
};

type GlobalContextType = State & {
  setUser: (user: User) => void;
  setIsSignIn: (isSignIn: boolean) => void;
  clearGlobalFields: () => void;
};

type Action =
  | {
    type: 'SET_USER';
    user: User;
  }
  | {
    type: 'SET_IS_SIGN_IN';
    isSignIn: boolean;
  }
  | {
    type: 'CLEAR_GLOBAL_FIELDS';
  };

const initialState: State = {
  user: {} as User,
  isSignIn: {} as boolean,
};

export const GlobalContext = createContext<State | any>(initialState);

const GlobalStateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      };
    case 'SET_IS_SIGN_IN':
      return {
        ...state,
        isSignIn: action.isSignIn,
      };
    case 'CLEAR_GLOBAL_FIELDS':
      return {
        ...state,
        user: initialState.user,
        isSignIn: initialState.isSignIn,
      };
    default:
      return state;
  }
};

export const GlobalStateProvider: FC = (props) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);
  const router = useRouter();

  const setUser = useCallback((user: User) => dispatch({ type: 'SET_USER', user }), [dispatch]);

  const setIsSignIn = useCallback(
    (isSignIn: boolean) => dispatch({ type: 'SET_IS_SIGN_IN', isSignIn }),
    [dispatch],
  );

  const clearGlobalFields = useCallback(
    () => dispatch({ type: 'CLEAR_GLOBAL_FIELDS' }),
    [dispatch],
  );

  // current_userの取得とセット
  const getCurrentUser = useCallback(async () => {
    const getCurrentUserURL = process.env.CSR_API_URI + '/current_user';
    setUser(await get_with_token(getCurrentUserURL));
  }, [setUser]);

  // sign in しているかの取得とセット
  const getIsSignIn = useCallback(async () => {
    const isSignInURL: string = process.env.CSR_API_URI + '/mail_auth/is_signin';
    const isSignInRes = await get_with_token(isSignInURL);
    const isSignIn: boolean = isSignInRes.is_sign_in;
    setIsSignIn(isSignIn);
    if (!isSignIn && router.pathname !== '/') {
      localStorage.clear();
      router.push('/');
    }
  }, [router, setIsSignIn]);

  useEffect(() => {
    if (router.isReady) {
      getCurrentUser();
      getIsSignIn();
    }
  }, [router, getCurrentUser, getIsSignIn]);

  const user = useMemo(() => state.user, [state.user]);

  const isSignIn = useMemo(() => state.isSignIn, [state.isSignIn]);

  const value = useMemo(
    () => ({
      user,
      isSignIn,
      setUser,
      setIsSignIn,
      clearGlobalFields,
    }),
    [user, isSignIn, setUser, setIsSignIn, clearGlobalFields],
  );

  return <GlobalContext.Provider value={value} {...props} />;
};

export const useGlobalContext = () => {
  const context = useContext<GlobalContextType>(GlobalContext);
  // if (context === undefined) {
  // throw new Error(`useGlobalContext must be used within a GlobalStateProvider`)
  // }
  return context;
};
