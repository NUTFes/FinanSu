import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import { RecoilRoot } from 'recoil';

import Layout from '@components/layout/Layout';
import { ManagedUIContext } from '@components/ui/context';

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
            <NuqsAdapter>
              <Component {...pageProps} />
            </NuqsAdapter>
          </Layout>
        </ManagedUIContext>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
