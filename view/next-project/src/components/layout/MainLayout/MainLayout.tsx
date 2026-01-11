import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useAuthStore, useUserStore } from '@/store';
import { Header, SideNav } from '@components/common';
import { get_with_token_valid } from '@utils/api/api_methods';

import s from './MainLayout.module.css';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout(props: LayoutProps) {
  const router = useRouter();
  const { isSignIn, accessToken, resetAuth } = useAuthStore();
  const resetUser = useUserStore((state) => state.resetUser);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  useEffect(() => {
    const getCurrentUserUrl = process.env.CSR_API_URI + '/current_user';
    get_with_token_valid(getCurrentUserUrl, accessToken).then((result) => {
      if (!result) {
        localStorage.clear();
        resetAuth();
        resetUser();
        router.push('/');
      } else {
        if (router.isReady) {
          if (!isSignIn) {
            router.push('/');
            localStorage.clear();
          } else if (isSignIn === true && router.pathname == '/') {
            router.push('/purchaseorders');
          }
        }
      }
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>FinanSu</title>
        <meta name='' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={clsx('h-screen w-full')}>
        <div className={clsx('h-16 w-full')}>
          <Header onSideNavOpen={() => setIsSideNavOpen(!isSideNavOpen)} />
        </div>
        <div className={clsx(s.parent)}>
          <div
            className={clsx(
              { 'invisible opacity-0 md:visible md:opacity-100': isSideNavOpen },
              { 'visible opacity-100 md:invisible md:opacity-0': !isSideNavOpen },
              'transition-all',
            )}
          >
            <SideNav />
          </div>
          <div className={clsx('size-full', { 'md:w-7/8': isSideNavOpen }, s.content)}>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
