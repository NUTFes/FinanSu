import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import LoginLayout from '@/components/layout/LoginLayout';
import { PrimaryButton } from '@components/common';
import PrimaryLink from '@/components/common/PrimaryLink';
import { Context } from 'vm';
import { resetPassword, resetPasswordTokenValid } from '@/utils/api/resetPassword';
import { PasswordResetData } from '@/type/common';
import Loading from '@/components/common/Loading';
import Router from 'next/router';

interface Props {
  isTokenValid: boolean;
  id: string;
  token: string;
}

export async function getServerSideProps(context: Context) {
  const { query } = context;

  const getIsTokenValidUrl = `${process.env.SSR_API_URI}/password_reset/${query.id}/valid?token=${query.token}`;

  const validRes = await resetPasswordTokenValid(getIsTokenValidUrl);

  const tokenValid = validRes.status === 200;

  return {
    props: {
      isTokenValid: tokenValid,
      id: query.id,
      token: query.token,
    },
  };
}

export default function ResetPassword(props: Props) {
  const { isTokenValid, id, token } = props;
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const postPasswordData: PasswordResetData = {
    token: token,
    password: '',
    confirmPassword: '',
  };

  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
  } = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    mode: 'all',
  });

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    setIsLoading(true);
    const postData: PasswordResetData = {
      ...postPasswordData,
      password: getValues('password'),
      confirmPassword: getValues('confirmPassword'),
    };

    const postUrl = `${process.env.CSR_API_URI}/password_reset/${id}`;

    const req = await resetPassword(postUrl, postData);

    setIsLoading(false);

    if (req.status != 200) {
      window.alert('パスワードの変更に失敗しました\nログイン画面に移動します');
      Router.push('/');
      return;
    }

    setIsSubmitted(true);
  };

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
        {isTokenValid ? (
          <div>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='my-20 flex w-full flex-col items-center'>
                  <div className='mb-10 flex flex-col gap-3'>
                    <div className='grid grid-cols-3 items-center justify-items-center gap-5'>
                      <p className='md:text-md whitespace-nowrap text-sm text-black-300'>
                        パスワード
                      </p>
                      <input
                        type='password'
                        className='col-span-2 w-full border-b border-b-primary-1 p-1'
                        {...register('password', {
                          required: 'パスワードは必須です。',
                          minLength: {
                            value: 6,
                            message: 'パスワードは6文字以上で入力してください',
                          },
                        })}
                      />
                      <p className='md:text-md whitespace-nowrap text-sm text-black-300'>
                        パスワード(確認)
                      </p>
                      <input
                        type='password'
                        className='col-span-2 w-full border-b border-b-primary-1 p-1'
                        {...register('confirmPassword', {
                          required: 'パスワードは必須です。',
                          minLength: {
                            value: 6,
                            message: 'パスワードは6文字以上で入力してください',
                          },
                          validate: {
                            correct: (input: string) => input === getValues('password'),
                          },
                        })}
                      />
                    </div>
                    <div className='mb-5'>
                      <p className='text-red-500'>{errors.password && errors.password.message}</p>
                      <p className='text-red-500'>
                        {errors.confirmPassword && errors.confirmPassword.type === 'correct' && (
                          <p>パスワードが一致しません</p>
                        )}
                      </p>
                    </div>
                  </div>
                  <PrimaryButton type='submit' disabled={!isValid}>
                    パスワード変更
                  </PrimaryButton>
                  <a href='/' className='mt-10 underline hover:text-grey-300'>
                    戻る
                  </a>
                </div>
              </form>
            ) : (
              <div className='my-20 flex w-full flex-col items-center'>
                <p>パスワードを変更しました</p>
                <PrimaryLink href={'/'} className='my-10'>
                  ログイン画面へ戻る
                </PrimaryLink>
              </div>
            )}
          </div>
        ) : (
          <div className='my-20 flex w-full flex-col items-center'>
            <div className='mb-10 flex flex-col items-center gap-3'>
              <p className='whitespace-nowrap text-lg text-black-300'>
                リンクが無効もしくは、有効期限が切れています。
              </p>
              <p className='whitespace-nowrap text-lg text-black-300'>
                再度パスワードリセットメールを送信して下さい。
              </p>
            </div>
            <a href='/' className='mt-10 underline hover:text-grey-300'>
              ログイン画面へ
            </a>
          </div>
        )}
      </div>
      {isLoading && <Loading />}
    </LoginLayout>
  );
}
