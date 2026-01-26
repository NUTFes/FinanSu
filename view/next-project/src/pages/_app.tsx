import { ChakraProvider } from '@chakra-ui/react';
import localFont from 'next/font/local';
import Head from 'next/head';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';

import Layout from '@components/layout/Layout';
import { ManagedUIContext } from '@components/ui/context';

import type { AppProps } from 'next/app';

import 'tailwindcss/tailwind.css';

export const notoSansJP = localFont({
  src: '../../public/fonts/NotoSansJP-Regular.ttf',
  display: 'swap',
});

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
