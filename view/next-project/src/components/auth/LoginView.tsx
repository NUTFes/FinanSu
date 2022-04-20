import React, { FC, useState } from 'react';
import Router from 'next/router';
import { post } from '@api/api_methods';
import SubmitButton from '@components/common/TestButton';

interface submitData {
  email: string;
  password: string;
}

export const submitUser = async (data: submitData) => {
  const submitUrl =
    process.env.CSR_API_URI +
    '/api/auth/sign_in?email=' +
    data.email +
    '&password=' +
    data.password;
  console.log(submitUrl);
  const req: any = await post(submitUrl, '');
  const res: any = await req.json();
  if (req.status === 200) {
    localStorage.setItem('access-token', req.headers['access-token']);
    localStorage.setItem('client', req.headers['client']);
    localStorage.setItem('uid', req.headers['uid']);
    localStorage.setItem('token-type', req.headers['token-type']);
    localStorage.setItem('user_id', res.data.id);
    Router.push('/records');
  } else {
    console.log('Error' + req.status);
    console.log(res);
  }
};

const LoginView: FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const handler = (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [input]: e.target.value });
  };
  /*
     const submitUser = () => {
     console.log(formData)
     }
     */
  return (
    <>
      <div className={s.formContainer}>
        <div>
          <h3>Email</h3>
          <input
            type='text'
            placeholder='Input'
            value={formData.email}
            onChange={handler('email')}
          />
          <p>例: nutmeg-taro@email.com</p>
        </div>
        <div>
          <h3>Password</h3>
          <input
            type='password'
            placeholder='Input'
            value={formData.password}
            onChange={handler('password')}
          />
          <p className={s.formExample}>例: 木実太郎</p>
        </div>
        <SubmitButton onClick={() => submitUser(formData)}>Login</SubmitButton>
      </div>
    </>
  );
};

export default LoginView;
