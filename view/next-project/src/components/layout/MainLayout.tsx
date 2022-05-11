import React from 'react';
import Head from 'next/head';
import Header from '@components/Header';
import theme from '@assets/theme';
import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import { get_with_token } from '@api/api_methods';
import SideNav from '@components/General/SideNav';

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
    <ChakraProvider theme={theme}>
      <Head>
        <title>FinanSu</title>
        <meta name='' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <Grid templateColumns='repeat(7,1fr)' gap={4}>
        <GridItem colSpan={1}>
          <SideNav />
        </GridItem>
        <GridItem colSpan={6}>
          <section>
            <main>{props.children}</main>
          </section>
        </GridItem>
      </Grid>

    </ChakraProvider>
  );
}
