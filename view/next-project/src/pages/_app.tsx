import { Noto_Sans_JP } from 'next/font/google';
import Head from 'next/head';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';

import { ToastProvider } from '@/hooks/useToast';
import Layout from '@components/layout/Layout';
import { ManagedUIContext } from '@components/ui/context';

import type { AppProps } from 'next/app';

import '@/styles/globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={` ${notoSansJP.className} ${notoSansJP.variable} h-full`}>
        <ManagedUIContext>
          <Layout>
            <NuqsAdapter>
              <Component {...pageProps} />
            </NuqsAdapter>
          </Layout>
        </ManagedUIContext>
      </main>
    </ToastProvider>
  );
}

export default MyApp;
