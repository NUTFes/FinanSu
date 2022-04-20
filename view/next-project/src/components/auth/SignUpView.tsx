import React, { useState } from 'react';
import Router from 'next/router';
import { signUp } from '@api/signUp';
import { get, post } from '@api/user';
import SubmitButton from '@components/General/RegistButton';
import { ChakraProvider, Center, Input, Box, Heading } from '@chakra-ui/react';
import theme from '@assets/theme';

interface postData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface User {
  name: string;
  department_id: number;
}

interface Department {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  department: Department[];
}

export async function getServerSideProps() {
  const getDepartmentsUrl: string = process.env.SSR_API_URI + '/departments';
  const departmentsRes: Department = await get(getDepartmentsUrl);
  return {
    props: {
      departments: departmentsRes,
    },
  };
}

export const postUser = async (data: postData) => {
  const postUserData: User = {
    name: '',
    department_id: 1,
  };

  const getUrl: string = process.env.CSR_API_URI + '/users';
  const postUserUrl: string = process.env.CSR_API_URI + '/users';
  const signUpUrl: string = process.env.CSR_API_URI + '/mail_auth/signup';

  const getRes: any = await get(getUrl);
  const userID: number = getRes[getRes.length - 1].id + 1;
  const userRes: any = await post(postUserUrl, postUserData);
  const req: any = await signUp(signUpUrl, data, userID);
  const res: any = await req.json();
  if (req.status === 200) {
    localStorage.setItem('access-token', res.access_token);
    localStorage.setItem('login', 'true');
    Router.push('/budgets');
  } else {
    console.log('Error' + res.status);
    console.log(res);
  }
};

export default function SignUpView(props: Props) {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const handler = (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Box p='5' mb='2'>
          <Box my='2'>
            <Heading as='h4' size='md' my='2'>
              Name
            </Heading>
            <Input type='text' value={formData.userName} onChange={handler('userName')} />
            <p>例: 技大太郎</p>
          </Box>
          <Box my='2'>
            <Heading as='h4' size='md' my='2'>
              Email
            </Heading>
            <Input type='text' value={formData.email} onChange={handler('email')} />
            <p>例: gidai-taro@email.com</p>
          </Box>
          <Box my='2'>
            <Heading as='h4' size='md' my='2'>
              Password
            </Heading>
            <Input type='password' value={formData.password} onChange={handler('password')} />
          </Box>
          <Box my='2'>
            <Heading as='h4' size='md' my='2'>
              Password Confirmation
            </Heading>
            <Input
              type='password'
              value={formData.passwordConfirmation}
              onChange={handler('passwordConfirmation')}
            />
          </Box>
          <SubmitButton onClick={() => postUser(formData)}>Next</SubmitButton>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
