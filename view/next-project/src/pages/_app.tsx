import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';

import Layout from '@components/layout/Layout';
import { ManagedUIContext } from '@components/ui/context';

import type { AppProps } from 'next/app';

import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ManagedUIContext>
        <Layout>
          <NuqsAdapter>
            <Component {...pageProps} />
          </NuqsAdapter>
        </Layout>
      </ManagedUIContext>
    </ChakraProvider>
  );
}

export default MyApp;
