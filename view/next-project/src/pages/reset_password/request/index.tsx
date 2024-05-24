import { FormEvent, useState } from 'react';
import Image from 'next/image';

import LoginLayout from '@/components/layout/LoginLayout';
import { PrimaryButton } from '@components/common';
import PrimaryLink from '@/components/common/PrimaryLink';
import { reserPasswordRequest } from '@/utils/api/resetPassword';
import { useRouter } from 'next/router';
import Loading from '@/components/common/Loading';

export default function Periods() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const postRequest = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const requestUrl = process.env.CSR_API_URI + '/password_reset/request';

    const req = await reserPasswordRequest(requestUrl, email);
    setIsLoading(false);

    router.push('/reset_password/request/complete');
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
        <form
          method='post'
          onSubmit={(e) => {
            postRequest(e);
          }}
        >
          <div className='my-10 flex w-full flex-col items-center'>
            <div className='mb-10 flex flex-col gap-6'>
              <div className='my-2 flex flex-col items-center'>
                <p className=' text-md whitespace-nowrap text-black-300'>
                  登録しているメールアドレスを入力してください。
                </p>
                <p className=' text-md whitespace-nowrap text-black-300'>
                  パスワードリセットフォームをお送りします。
                </p>
              </div>
              <div className='grid grid-cols-3 items-center justify-items-end gap-5'>
                <p className='text-md whitespace-nowrap text-black-300'>メールアドレス</p>
                <input
                  type='email'
                  placeholder='test@example.com'
                  className='col-span-2 w-full border-b border-b-primary-1 p-1'
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <PrimaryButton type='submit' disabled={isLoading}>
              再設定メールの送信
            </PrimaryButton>
            <a href='/' className='mt-10 underline'>
              戻る
            </a>
          </div>
        </form>
        {<Loading />}
      </div>
    </LoginLayout>
  );
}
