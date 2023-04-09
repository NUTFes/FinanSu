import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

import Layout from '@components/layout/Layout';
import { ManagedUIContext } from '@components/ui/context';

import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Head>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <ManagedUIContext>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ManagedUIContext>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
