import React from 'react';
import Head from 'next/head';
import Header from '@components/common/Header';
import { get_with_token } from '@api/api_methods';
import SideNav from '@components/common/SideNav';
import clsx from 'clsx';
import s from './MainLayout.module.css';

interface User {
  id: number;
  name: string;
  department_id: number;
  role_id: number;
}

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
