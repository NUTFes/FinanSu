import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import { ManagedUIContext } from '@components/ui/context';
import { GlobalStateProvider, useGlobalContext } from '@components/global/context';
import Layout from '@components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const state = useGlobalContext();

  useEffect(() => {
    if (router.isReady) {
      if (!state.isSignIn) {
        router.push('/');
        localStorage.clear();
      } else if (state.isSignIn && router.pathname == '/') {
        router.push('/purchaseorders');
      }
    }
  }, []);

  return (
    <ChakraProvider>
      <Head>
        <title>FinanSu</title>
        <meta name='FinanSu' content='ja' />
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap'
        />
      </Head>
      <GlobalStateProvider>
        <ManagedUIContext>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ManagedUIContext>
      </GlobalStateProvider>
    </ChakraProvider>
  );
}

export default MyApp;
