import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuthStore, useUserStore } from '@/store';
import { Header, Loading, SideNav } from '@components/common';
import { get_with_token_valid } from '@utils/api/api_methods';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout(props: LayoutProps) {
  const router = useRouter();
  const { isSignIn, accessToken, resetAuth, _hasHydrated: authHasHydrated } = useAuthStore();
  const { resetUser, _hasHydrated: userHasHydrated } = useUserStore();
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  const isLoginPage = router.pathname === '/';

  const [isChecking, setIsChecking] = useState(true);

  const hasHydrated = authHasHydrated && userHasHydrated;

  useEffect(() => {
    if (!hasHydrated) return;

    const validateSession = async () => {
      if (!isSignIn || !accessToken) {
        await handleLogout();
        return;
      }

      const getCurrentUserUrl = process.env.CSR_API_URI + '/current_user';
      const isValid = await get_with_token_valid(getCurrentUserUrl, accessToken);

      if (!isValid) {
        await handleLogout();
      } else {
        if (isLoginPage) {
          await router.push('/my_page');
        }
        setIsChecking(false);
      }
    };

    const handleLogout = async () => {
      resetAuth();
      resetUser();

      if (!isLoginPage) {
        await router.push('/');
      }
      setIsChecking(false);
    };

    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, isLoginPage, isSignIn, accessToken, resetAuth, resetUser]);

  if (!hasHydrated || isChecking) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FinanSu</title>
        <meta name='' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex h-screen w-full flex-col overflow-hidden bg-gray-50'>
        {!isLoginPage && (
          <div className='h-16 w-full shrink-0'>
            <Header onSideNavOpen={() => setIsSideNavOpen(!isSideNavOpen)} />
          </div>
        )}
        <div className='flex flex-1 overflow-hidden relative'>
          {!isLoginPage && (
            <aside
              className={clsx(
                'z-20 bg-primary-4 transition-all duration-300 ease-in-out',
                'md:static md:block md:h-full',
                isSideNavOpen
                  ? 'md:w-52 md:translate-x-0 md:opacity-100'
                  : 'md:w-0 md:-translate-x-full md:opacity-0 md:overflow-hidden',
                'fixed top-16 bottom-0 right-0',
                !isSideNavOpen ? 'w-52 translate-x-0 shadow-xl' : 'w-0 translate-x-full',
              )}
            >
              <SideNav />
            </aside>
          )}
          <main className={clsx('flex-1 overflow-y-auto w-full relative')}>{props.children}</main>
        </div>
      </div>
    </>
  );
}
