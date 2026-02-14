import localFont from 'next/font/local';
import Head from 'next/head';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';

import { ToastProvider } from '@/hooks/useToast';
import Layout from '@components/layout/Layout';
import { ManagedUIContext } from '@components/ui/context';

import type { AppProps } from 'next/app';

import '@/styles/globals.css';

export const notoSansJP = localFont({
  src: '../../public/fonts/NotoSansJP-Regular.ttf',
  display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

export default MyApp;
