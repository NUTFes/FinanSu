import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import s from './MainLayout.module.css';

import { authAtom } from '@/store/atoms';
import 'tailwindcss/tailwind.css';
import { Header, SideNav } from '@components/common';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout(props: LayoutProps) {
  const router = useRouter();
  const [auth] = useRecoilState(authAtom);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      if (!auth.isSignIn) {
        router.push('/');
        localStorage.clear();
      } else if (auth.isSignIn === true && router.pathname == '/') {
        router.push('/purchaseorders');
      }
    }
  }, [router, auth]);

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
          <div className={clsx('h-full w-full', { 'md:w-7/8': isSideNavOpen }, s.content)}>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
