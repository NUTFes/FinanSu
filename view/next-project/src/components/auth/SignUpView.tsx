import React, { useState } from 'react';
import Router from 'next/router';
import { signUp } from '@api/signUp';
import { get, post } from '@api/user';
import SubmitButton from '@components/General/RegistButton';
import { ChakraProvider, Center, Box, Heading, Input, Select } from '@chakra-ui/react';
import theme from '@assets/theme';

interface PostData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface User {
  userName: string;
  departmentId: number;
}

interface Department {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  departments: Department[];
}

export const postUser = async (data: PostData, postUserData: User) => {
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
  const [postUserData, setPostUserData] = useState({
    userName: '',
    departmentId: 1,
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const userDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setPostUserData({ ...postUserData, [input]: e.target.value });
    };
  const formDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [input]: e.target.value });
    };
  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Box p='5' mb='2'>
          <Box my='3'>
            <Heading as='h4' size='md' my='2'>
              Name
            </Heading>
            <Input
              type='text'
              value={postUserData.userName}
              onChange={userDataHandler('userName')}
            />
            <p>例: 技大太郎</p>
          </Box>
          <Box my='3'>
            <Heading as='h4' size='md' my='2'>
              学科
            </Heading>
            <Select
              value={postUserData.departmentId}
              onChange={userDataHandler('departmentId')}
              borderRadius='full'
              borderColor='primary.1'
              w='224px'
            >
              {props.departments.map((department) => (
                <option value={department.id}>{department.name}</option>
              ))}
            </Select>
          </Box>
          <Box my='3'>
            <Heading as='h4' size='md' my='2'>
              Email
            </Heading>
            <Input type='text' value={formData.email} onChange={formDataHandler('email')} />
            <p>例: gidai-taro@email.com</p>
          </Box>
          <Box my='3'>
            <Heading as='h4' size='md' my='2'>
              Password
            </Heading>
            <Input
              type='password'
              value={formData.password}
              onChange={formDataHandler('password')}
            />
          </Box>
          <Box my='3'>
            <Heading as='h4' size='md' my='2'>
              Password Confirmation
            </Heading>
            <Input
              type='password'
              value={formData.passwordConfirmation}
              onChange={formDataHandler('passwordConfirmation')}
            />
          </Box>
          <SubmitButton onClick={() => postUser(formData, postUserData)}>Next</SubmitButton>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
