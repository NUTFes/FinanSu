import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { get_with_token } from '@api/api_methods';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const getIsSignIn = async () => {
      const isSignInURL: string = process.env.CSR_API_URI + '/mail_auth/is_signin';
      const isSignInRes = await get_with_token(isSignInURL);
      const isSignIn: boolean = isSignInRes.is_sign_in;
      if (!isSignIn) {
        router.push('/');
        localStorage.clear();
      } else if (isSignIn && router.pathname == '/') {
        router.push('/fund_informations');
      }
    };
    getIsSignIn();
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
