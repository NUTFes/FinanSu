import React from 'react';
import Head from 'next/head';
import Header from '@components/common/Header';
import theme from '@assets/theme';
import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import { get_with_token } from '@api/api_methods';
import SideNav from '@components/common/SideNav';
import clsx from 'clsx';

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
      <div className={clsx('grid grid-cols-9 grid-row-2 w-full gap-0')}>
        <div className={clsx('grid col-span-9 row-span-1 h-auto')} >
          <Header />
        </div>
        <div className={clsx('grid col-span-1 row-span-1 justify-items-start w-full text-black-600 text-md h-100')}>
          <SideNav />
        </div>
        <div className={clsx('grid col-span-8 row-span-1 justify-items-center w-full text-black-600 text-md h-100')}>
          {props.children}
        </div>
      </div>
    </>
  );
}
