import React from 'react';
import Head from 'next/head';
import Header from '@components/common/Header';
import theme from '@assets/theme';
import { Center, ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import { get_with_token } from '@api/api_methods';
import SideNav from '@components/common/SideNav';

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

      <Grid
      templateColumns='repeat(12 1fr)'
      gap='1'
      >
        <GridItem colSpan={12} h="60px">
          <Header />
        </GridItem>
        <GridItem colSpan={2} w="160px">
          <SideNav />
        </GridItem>
        <GridItem colSpan={10}>
            {props.children}      
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}
