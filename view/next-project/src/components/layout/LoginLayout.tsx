import Image from 'next/image';
import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

function LoginLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <div className='w-full h-16 bg-primary-4 flex justify-center items-center'>
        <div className='w-24 md:w-40'>
          <Image src='/logo.svg' alt='logo' width={150} height={40} className='h-fit w-fit' />
        </div>
      </div>
      <div className='flex justify-center items-center h-screen'>
        {children}
      </div>
    </>
  );
}

export default LoginLayout;
