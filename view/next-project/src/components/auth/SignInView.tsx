import Router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { authAtom, userAtom } from '@/store/atoms';
import { get_with_token } from '@api/api_methods';
import { signIn } from '@api/signIn';
import LoadingButton from '@components/common/LoadingButton';
import { SignIn } from '@type/common';

import { PrimaryButton } from '../common';

export default function SignInView() {
  // ログイン中フラグ
  const [isSignInNow, setIsSignInNow] = useState<boolean>(false);
  const [, setAuth] = useRecoilState(authAtom);
  const [, setUser] = useRecoilState(userAtom);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<SignIn>({
    mode: 'all',
  });

  const SignIn = async (data: SignIn) => {
    setIsSignInNow(true);
    const signinUrl: string = process.env.CSR_API_URI + '/mail_auth/signin';
    const currentUserUrl: string = process.env.CSR_API_URI + '/current_user';

    const req = await signIn(signinUrl, data);
    const res = await req.json();
    const userRes = await get_with_token(currentUserUrl, res.accessToken);
    if (req.status === 200) {
      const authData = {
        isSignIn: true,
        accessToken: res.accessToken,
      };
      setAuth(authData);
      setUser(userRes);
      Router.push('/my_page');
    } else {
      alert(
        'ログインに失敗しました。メールアドレスもしくはパスワードが間違っている可能性があります',
      );
      setIsSignInNow(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(SignIn)}>
      <div className='my-16 flex w-full flex-col items-center'>
        <div className='mb-10 flex flex-col gap-3'>
          <div className='grid grid-cols-3 items-center justify-items-end gap-5'>
            <p className='md:text-md whitespace-nowrap text-sm text-black-300'>メールアドレス</p>
            <input
              type='text'
              className='col-span-2 w-full border-b border-b-primary-1 p-1'
              {...register('email', {
                required: 'メールアドレスは必須です',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'メールアドレス形式で入力してください',
                },
              })}
            />
            <p className='md:text-md whitespace-nowrap text-sm text-black-300'>パスワード</p>
            <input
              type='password'
              className='col-span-2 w-full border-b border-b-primary-1 p-1'
              {...register('password', {
                required: 'パスワードは必須です',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください',
                },
              })}
            />
          </div>
        </div>
        <div className='mb-5'>
          <p className='text-red-500'>{errors.email && errors.email.message}</p>
          <p className='text-red-500'>{errors.password && errors.password.message}</p>
        </div>
        {isSignInNow ? (
          <LoadingButton loadingText='ログイン中' />
        ) : (
          <PrimaryButton type='submit' disabled={!isValid}>
            ログイン
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}
