import { useState } from 'react';
import Image from 'next/image';

import LoginLayout from '@/components/layout/LoginLayout';
import { PrimaryButton } from '@components/common';
import PrimaryLink from '@/components/common/PrimaryLink';

export default function Periods() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);


  return (
    <LoginLayout>
      <div className='m-4 w-fit rounded-lg px-5 shadow-md md:m-8 md:w-1/2 md:px-10'>
        <div className='mt-8 flex items-center justify-center gap-2'>
          <Image
            src='/logo-black.svg'
            alt='logo'
            width={150}
            height={40}
            className='h-fit w-40 md:w-48'
          />
          <p className='text-2xl text-black-600 md:text-3xl'>パスワードの変更</p>
        </div>
        {!isSubmitted ? (
          <form>
            <div className='my-20 flex w-full flex-col items-center'>
              <div className='mb-10 flex flex-col gap-3'>
                <div className='grid grid-cols-3 items-center justify-items-end gap-5'>
                  <p className='md:text-md whitespace-nowrap text-sm text-black-300'>
                    メールアドレス
                  </p>
                  <input
                    type='text'
                    placeholder='test@example.com'
                    className='col-span-2 w-full border-b border-b-primary-1 p-1'
                  />
                </div>
              </div>
              <PrimaryButton
                type='button'
                onClick={() => {
                  setIsSubmitted(true);
                }}
              >
                再設定メールの送信
              </PrimaryButton>
              <a href='/' className='mt-10 underline'>
                戻る
              </a>
            </div>
          </form>
        ) : (
          <div className='my-20 flex w-full flex-col items-center'>
            <p>再設定メールを送信しました</p>
            <p>メールが届かない場合再度送信してください</p>
            <PrimaryLink href={'/'} className='my-10'>
              ログイン画面へ戻る
            </PrimaryLink>
          </div>
        )}
      </div>
    </LoginLayout>
  );
}
