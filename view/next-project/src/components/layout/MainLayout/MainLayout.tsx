import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useAuthStore, useUserStore } from '@/store';
import { Header, Loading, SideNav } from '@components/common';
import { get_with_token_valid } from '@utils/api/api_methods';
import 'tailwindcss/tailwind.css';

import s from './MainLayout.module.css';

const CURRENT_USER_URL = process.env.CSR_API_URI + '/current_user';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout(props: LayoutProps) {
  const router = useRouter();
  const { isSignIn, accessToken, resetAuth, _hasHydrated: authHasHydrated } = useAuthStore();
  const { resetUser, _hasHydrated: userHasHydrated } = useUserStore();
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  const [isChecking, setIsChecking] = useState(true);

  const isLoginPage = router.pathname === '/';

  const hasHydrated = authHasHydrated && userHasHydrated;

  useEffect(() => {
    if (!hasHydrated) return;

    const validateSession = async () => {
      if (!isSignIn || !accessToken) {
        await handleLogout();
        return;
      }

      const isValid = await get_with_token_valid(CURRENT_USER_URL, accessToken);

      if (!isValid) {
        await handleLogout();
      } else if (router.pathname === '/') {
        await router.push('/my_page');
        setIsChecking(false);
      } else {
        setIsChecking(false);
      }
    };

    const handleLogout = async () => {
      resetAuth();
      resetUser();

      if (!isLoginPage) {
        await router.push('/');
      }
      setIsChecking(false);
    };

    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, router.pathname, isSignIn, accessToken, resetAuth, resetUser]);

  if (!hasHydrated || isChecking) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FinanSu</title>
        <meta name='' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={clsx('h-screen w-full')}>
        <div className={clsx('h-16 w-full')}>
          {!isLoginPage && <Header onSideNavOpen={() => setIsSideNavOpen(!isSideNavOpen)} />}
        </div>
        <div className={clsx(s.parent)}>
          {!isLoginPage && (
            <div
              className={clsx(
                { 'invisible opacity-0 md:visible md:opacity-100': isSideNavOpen },
                { 'visible opacity-100 md:invisible md:opacity-0': !isSideNavOpen },
                'transition-all',
              )}
            >
              <SideNav />
            </div>
          )}
          <div
            className={clsx('size-full', { 'md:w-7/8': isSideNavOpen && !isLoginPage }, s.content)}
          >
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
