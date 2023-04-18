import Router from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { PrimaryButton } from '../common';
import { BUREAUS } from '@/constants/bureaus';
import { authAtom, userAtom } from '@/store/atoms';
import { get } from '@api/api_methods';
import { signUp } from '@api/signUp';
import { post } from '@api/user';
import LoadingButton from '@components/common/LoadingButton';
import { SignUp, User } from '@type/common';

export default function SignUpView() {
  const [, setAuth] = useRecoilState(authAtom);
  const [, setUser] = useRecoilState(userAtom);

  // 新規登録中フラグ
  const [isSignUpNow, setIsSignUpNow] = useState<boolean>(false);

  const [postUserData, setPostUserData] = useState<User>({
    id: 0,
    name: '',
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
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setPostUserData({ ...postUserData, [input]: e.target.value });
    };

  const postUser = async (data: SignUp) => {
    setIsSignUpNow(true);
    const userUrl: string = process.env.CSR_API_URI + '/users';
    const signUpUrl: string = process.env.CSR_API_URI + '/mail_auth/signup';
    // userのpost時のResに登録したデータが返ってこないので以下で用意
    const getRes = await get(userUrl);
    const userID: number = getRes[getRes.length - 1].id + 1;
    // signIn には登録したuserのIDが必要なので先にUserをpost
    await post(userUrl, postUserData);
    // signUp
    const req = await signUp(signUpUrl, data, userID);
    const res = await req.json();
    // state用のuserのデータ
    const userData: User = {
      id: userID,
      name: postUserData.name,
      bureauID: Number(postUserData.bureauID),
      roleID: postUserData.roleID,
    };
    if (req.status === 200) {
      // state用のauthのデータ
      const authData = {
        isSignIn: true,
        accessToken: res.accessToken,
      };
      setAuth(authData);
      setUser(userData);
      Router.push('/purchaseorders');
    } else {
      alert(
        '新規登録に失敗しました。メールアドレスもしくはパスワードがすでに登録されている可能性があります',
      );
      setIsSignUpNow(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(postUser)}>
      <div className='my-16 flex w-full flex-col items-center'>
        <div className='mb-10 flex flex-col gap-3'>
          <div className='grid grid-cols-3 items-center justify-items-end gap-5'>
            <p className='whitespace-nowrap text-black-300'>名前</p>
            <input
              className='col-span-2 w-full border-b border-b-primary-1 p-1'
              type='text'
              value={postUserData.name}
              onChange={userDataHandler('name')}
            />
            <p className='whitespace-nowrap text-black-300'>学科</p>
            <select
              className='col-span-2 w-full border-b border-b-primary-1 p-1'
              value={postUserData.bureauID}
              onChange={userDataHandler('bureauID')}
            >
              {BUREAUS.map((bureau) => (
                <option key={bureau.id} value={bureau.id}>
                  {bureau.name}
                </option>
              ))}
            </select>
            <p className='whitespace-nowrap text-black-300'>メールアドレス</p>
            <input
              className='col-span-2 w-full border-b border-b-primary-1 p-1'
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
            <p className='whitespace-nowrap text-black-300'>パスワード</p>
            <input
              className='col-span-2 w-full border-b border-b-primary-1 p-1'
              type='password'
              {...register('password', {
                required: 'パスワードは必須です。',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください',
                },
              })}
            />
            <p className='whitespace-nowrap text-black-300'>パスワード確認</p>
            <input
              className='col-span-2 w-full border-b border-b-primary-1 p-1'
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
