import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('login') === 'false') {
      router.push('/');
    } else if (localStorage.getItem('login') === 'true' && router.pathname == '/') {
      router.push('/fund_informations');
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
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
