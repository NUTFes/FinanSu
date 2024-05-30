import Image from 'next/image';
import { FormEvent, useState } from 'react';

import LoginLayout from '@/components/layout/LoginLayout';
import { reserPasswordRequest } from '@/utils/api/resetPassword';
import { PrimaryButton, Link, Loading, PrimaryLink } from '@components/common';

export default function Periods() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const requestHandler = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const requestUrl = process.env.CSR_API_URI + '/password_reset/request';

    const req = await reserPasswordRequest(requestUrl, email);
    setIsLoading(false);

    setIsSubmitted(true);
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
        {isSubmitted ? (
          <div className='my-20 flex w-full flex-col items-center'>
            <p className='text-lg'>再設定メールを送信しました</p>
            <ul className='mx-auto my-4 text-sm'>
              <li>*メールが届くまでに数分かかることがあります。</li>
              <li>
                *メールが届かない場合は、送信先のメールアドレスの確認と迷惑メールの確認をしてください。
              </li>
              <li>*それでもメールが見つからない場合は、再度リクエストを行ってください。</li>
            </ul>
            <PrimaryLink href={'/'} className='my-10'>
              ログイン画面へ戻る
            </PrimaryLink>
          </div>
        ) : (
          <form
            method='post'
            onSubmit={(e) => {
              requestHandler(e);
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
              <PrimaryButton type='submit' disabled={isLoading || email.length < 1}>
                再設定メールの送信
              </PrimaryButton>
              <Link href='/'>戻る</Link>
            </div>
          </form>
        )}
        {isLoading && <Loading />}
      </div>
    </LoginLayout>
  );
}
