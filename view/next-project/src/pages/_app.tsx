import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@components/layout/Layout';
import { ManagedUIContext } from '@components/ui/context';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Head>
          <title>FinanSu</title>
          <meta name='FinanSu' content='ja' />
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
