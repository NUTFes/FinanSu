import { FormEvent, useState } from 'react';
import Image from 'next/image';

import LoginLayout from '@/components/layout/LoginLayout';
import { PrimaryButton } from '@components/common';
import PrimaryLink from '@/components/common/PrimaryLink';
import { reserPasswordRequest } from '@/utils/api/resetPassword';

export default function Periods() {
  const [email, setEmail] = useState<string>('');

  const postRequest = async (e: FormEvent) => {
    e.preventDefault();
    const requestUrl = process.env.CSR_API_URI + '/password_reset/request';

    const req = await reserPasswordRequest(requestUrl, email);
    const res = await req.json();
  };

  return (
    <LoginLayout>
      <div className='m-4 w-fit rounded-lg px-4 shadow-md md:m-8 md:w-1/2 md:px-10'>
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
        <div className='my-20 flex w-full flex-col items-center'>
          <p>再設定メールを送信しました</p>
          <p>メールが届かない場合再度送信してください</p>
          <PrimaryLink href={'/'} className='my-10'>
            ログイン画面へ戻る
          </PrimaryLink>
        </div>
      </div>
    </LoginLayout>
  );
}
