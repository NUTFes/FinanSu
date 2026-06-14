import Router from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { BUREAUS } from '@/constants/bureaus';
import { postMailAuthSignup } from '@/generated/hooks';
import { useAuthStore, useUserStore } from '@/store';
import { PrimaryButton } from '@components/common';
import LoadingButton from '@components/common/LoadingButton';
import { SignUp, User } from '@type/common';

export default function SignUpView() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useUserStore((state) => state.setUser);

  // 新規登録中フラグ
  const [isSignUpNow, setIsSignUpNow] = useState<boolean>(false);

  const [postUserData, setPostUserData] = useState<Pick<User, 'id' | 'bureauID' | 'roleID'>>({
    id: 0,
    bureauID: 1,
    roleID: 1,
  });

  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
  } = useForm<SignUp>({
    mode: 'all',
  });

  const userDataHandler =
    (input: 'bureauID' | 'roleID') => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPostUserData({ ...postUserData, [input]: e.target.value });
    };

  const postUser = async (data: SignUp) => {
    setIsSignUpNow(true);

    try {
      const req = await postMailAuthSignup({
        email: data.email,
        password: data.password,
        name: data.name,
        bureau_id: Number(postUserData.bureauID),
        role_id: Number(postUserData.roleID),
      });
      const res = req.data;

      // state用のuserのデータ
      const userData: User = {
        id: res.userID,
        name: data.name,
        bureauID: Number(postUserData.bureauID),
        roleID: Number(postUserData.roleID),
      };
      // state用のauthのデータ
      const authData = {
        isSignIn: true,
        accessToken: res.accessToken,
      };
      setAuth(authData);
      setUser(userData);
      Router.push('/my_page');
    } catch {
      alert('新規登録に失敗しました。このメールアドレスは既に登録されている可能性があります。');
      setIsSignUpNow(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(postUser)}>
      <div className='my-16 flex w-full flex-col items-center'>
        <div className='mb-10 flex flex-col gap-3'>
          <div className='grid grid-cols-3 items-center justify-items-end gap-5'>
            <label
              className='md:text-md text-black-300 text-sm whitespace-nowrap'
              htmlFor='signup-name'
            >
              名前
            </label>
            <input
              className='border-b-primary-1 col-span-2 w-full border-b p-1'
              id='signup-name'
              type='text'
              {...register('name', {
                required: '名前は必須です。',
              })}
            />
            <label
              className='md:text-md text-black-300 text-sm whitespace-nowrap'
              htmlFor='signup-bureau'
            >
              所属局
            </label>
            <select
              className='border-b-primary-1 col-span-2 w-full border-b p-1'
              id='signup-bureau'
              value={postUserData.bureauID}
              onChange={userDataHandler('bureauID')}
            >
              {BUREAUS.map((bureau) => (
                <option key={bureau.id} value={bureau.id}>
                  {bureau.name}
                </option>
              ))}
            </select>
            <label
              className='md:text-md text-black-300 text-sm whitespace-nowrap'
              htmlFor='signup-email'
            >
              メールアドレス
            </label>
            <input
              className='border-b-primary-1 col-span-2 w-full border-b p-1'
              id='signup-email'
              type='text'
              {...register('email', {
                required: 'メールアドレスは必須です。',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'メールアドレス形式で入力してください。',
                },
              })}
            />
            <label
              className='md:text-md text-black-300 text-sm whitespace-nowrap'
              htmlFor='signup-password'
            >
              パスワード
            </label>
            <input
              className='border-b-primary-1 col-span-2 w-full border-b p-1'
              id='signup-password'
              type='password'
              {...register('password', {
                required: 'パスワードは必須です。',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください',
                },
              })}
            />
            <label
              className='md:text-md text-black-300 text-sm whitespace-nowrap'
              htmlFor='signup-password-confirmation'
            >
              パスワード確認
            </label>
            <input
              className='border-b-primary-1 col-span-2 w-full border-b p-1'
              id='signup-password-confirmation'
              type='password'
              {...register('passwordConfirmation', {
                validate: {
                  correct: (input: string) => input === getValues('password'),
                },
              })}
            />
          </div>
        </div>
        <div className='mb-5'>
          <p className='text-red-500'>{errors.name && errors.name.message}</p>
          <p className='text-red-500'>{errors.email && errors.email.message}</p>
          <p className='text-red-500'>{errors.password && errors.password.message}</p>
          <p className='text-red-500'>
            {errors.passwordConfirmation && errors.passwordConfirmation.type === 'correct' && (
              <p>パスワードが一致しません</p>
            )}
          </p>
        </div>
        {isSignUpNow ? (
          <LoadingButton loadingText='登録中' />
        ) : (
          <PrimaryButton type='submit' disabled={!isValid}>
            登録
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}
