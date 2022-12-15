import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { get_with_token } from '@api/api_methods';
import 'tailwindcss/tailwind.css';
import Header from '@components/common/Header';
import SideNav from '@components/common/SideNav';
import { User } from '@type/common';
import { authAtom } from 'src/store/atoms';

import s from './MainLayout.module.css';

interface LayoutProps {
  children?: React.ReactNode;
  currentUser?: User;
}

export async function getServerSideProps() {
  const getCurrentUserUrl = process.env.SSR_API_URI + '/current_user';
  const currentUserRes = await get_with_token(getCurrentUserUrl);
  return {
    props: {
      currentUser: currentUserRes,
    },
  };
}

export default function MainLayout(props: LayoutProps) {
  const router = useRouter();
  const [auth] = useRecoilState(authAtom);

  useEffect(() => {
    if (router.isReady) {
      console.log(auth);
      if (!auth.isSignIn) {
        console.log('if');
        router.push('/');
        localStorage.clear();
      } else if (auth.isSignIn === true && router.pathname == '/') {
        console.log('else if');
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
          <Header />
        </div>
        <div className={clsx(s.parent)}>
          <div className={clsx('w-1/8 bg-primary-4', s.sidenav)}>
            <SideNav />
          </div>
          <div className={clsx('h-full w-7/8', s.content)}>{props.children}</div>
        </div>
      </div>
    </>
  );
}
