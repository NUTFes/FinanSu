import Image from 'next/image';
import React, { type JSX } from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

function LoginLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <div className='bg-primary-4 flex h-16 w-full items-center justify-center'>
        <div className='w-24 md:w-40'>
          <Image src='/logo.svg' alt='logo' width={150} height={40} className='size-fit' />
        </div>
      </div>
      <div className='flex h-screen items-center justify-center'>{children}</div>
    </>
  );
}

export default LoginLayout;
