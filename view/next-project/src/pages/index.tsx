import Image from 'next/image';
import { useState } from 'react';

import { PrimaryButton } from '@/components/common';

import SignInView from '@components/auth/SignInView';
import SignUpView from '@components/auth/SignUpView';
import LoginLayout from '@components/layout/LoginLayout';

export default function Home() {
  const [isMember, setIsMember] = useState(true);
  const cardContent = (isMember: boolean) => {
    if (isMember) {
      return (
        <>
          <div className='mt-8 flex items-center justify-center gap-2'>
            <Image
              src='/logo-black.svg'
              alt='logo'
              width={150}
              height={40}
              className='h-fit w-40 md:w-48'
            />
            <p className='text-2xl text-black-600 md:text-3xl'>ログイン</p>
          </div>
          <SignInView />
          <hr className='border-black-300' />
          <div className='my-12 flex flex-col items-center justify-center gap-5'>
            <p className='text-black-600'>登録がまだの方はこちら</p>
            <PrimaryButton onClick={() => setIsMember(!isMember)}>新規登録</PrimaryButton>
            <a href='/reset_password/request' className='my-5 underline'>
              パスワードを忘れた
            </a>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='mt-8 flex items-center justify-center gap-2'>
            <Image
              src='/logo-black.svg'
              alt='logo'
              width={150}
              height={40}
              className='h-fit w-40 md:w-48'
            />
            <p className='text-2xl text-black-600 md:text-3xl'>新規登録</p>
          </div>
          <SignUpView />
          <hr className='border-black-300' />
          <div className='my-12 flex flex-col items-center justify-center gap-5'>
            <p className='text-black-600'>登録済みの方はこちら</p>
            <PrimaryButton onClick={() => setIsMember(!isMember)}>ログイン</PrimaryButton>
          </div>
        </>
      );
    }
  };
  return (
    <LoginLayout>
      <div className='m-4 w-fit rounded-lg px-5 shadow-md md:m-8 md:w-1/2 md:px-10'>
        {cardContent(isMember)}
      </div>
    </LoginLayout>
  );
}
