import React, { useState } from 'react';
import Router from 'next/router';
import { signUp } from '@api/signUp';
import { get, post } from '@api/user';
import SubmitButton from '@components/General/RegistButton';
import {
  ChakraProvider,
  Center,
  Box,
  Heading,
  Input,
  Select,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import theme from '@assets/theme';

interface PostData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface User {
  userName: string;
  departmentId: number;
  roleId: number;
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
    Router.push('/fund_informations');
  } else {
    console.log('Error' + res.status);
    console.log(res);
  }
};

export default function SignUpView(props: Props) {
  // 学科をフロントで定義
  const departments = [
    {
      id: 1,
      name: '機械工学分野/機械創造工学課程・機械創造工学専攻',
    },
    {
      id: 2,
      name: '電気電子情報工学分野/電気電子情報工学課程/電気電子情報工学専攻',
    },
    {
      id: 3,
      name: '情報・経営システム工学分野/情報・経営システム工学課程/情報・経営システム工学専攻',
    },
    {
      id: 4,
      name: '物質生物工学分野/物質材料工学課程/生物機能工学課程/物質材料工学専攻/生物機能工学専攻',
    },
    {
      id: 5,
      name: '環境社会基盤工学分野/環境社会基盤工学課程/環境社会基盤工学専攻',
    },
    {
      id: 6,
      name: '量子・原子力統合工学分野/原子力システム安全工学専攻',
    },
  ];
  const [postUserData, setPostUserData] = useState<User>({
    userName: '',
    departmentId: 1,
    roleId: 1,
  });
  const [formData, setFormData] = useState<PostData>({
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
      <Flex mt='10' />
      <Grid templateColumns='repeat(12, 1fr)' gap={4}>
        <GridItem colSpan={1} />
        <GridItem colSpan={10}>
          <Grid templateColumns='repeat(12, 1fr)' gap={4}>
            <GridItem rowSpan={1} colSpan={4}>
              <Flex color='black.600' h='100%' justify='end' align='center'>
                <Heading as='h4' size='md' my='2'>
                  名前
                </Heading>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={8}>
              <Input
                minW='100'
                borderRadius='full'
                borderColor='primary.1'
                type='text'
                value={postUserData.userName}
                onChange={userDataHandler('userName')}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Flex color='black.600' h='100%' justify='end' align='center'>
                <Heading as='h4' size='md' my='2'>
                  学科
                </Heading>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={8}>
              <Flex>
                <Select
                  minW='100'
                  borderRadius='full'
                  borderColor='primary.1'
                  value={postUserData.departmentId}
                  onChange={userDataHandler('departmentId')}
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Select>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Flex color='black.600' h='100%' justify='end' align='center'>
                <Heading as='h4' size='md' my='2'>
                  メールアドレス
                </Heading>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={8}>
              <Flex>
                <Input
                  minW='100'
                  borderRadius='full'
                  borderColor='primary.1'
                  type='text'
                  value={formData.email}
                  onChange={formDataHandler('email')}
                />
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Flex color='black.600' h='100%' justify='end' align='center'>
                <Heading as='h4' size='md'>
                  パスワード
                </Heading>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={8}>
              <Flex>
                <Input
                  minW='100'
                  borderRadius='full'
                  borderColor='primary.1'
                  type='password'
                  value={formData.password}
                  onChange={formDataHandler('password')}
                />
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Flex color='black.600' h='100%' justify='end' align='center'>
                <Heading as='h4' size='md'>
                  パスワード確認
                </Heading>
              </Flex>
            </GridItem>
            <GridItem rowSpan={1} colSpan={8}>
              <Flex>
                <Input
                  minW='100'
                  borderRadius='full'
                  borderColor='primary.1'
                  type='password'
                  value={formData.passwordConfirmation}
                  onChange={formDataHandler('passwordConfirmation')}
                />
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem colSpan={1} />
      </Grid>
      <Flex mt='7' />
      <Center>
        <Box p='5' mb='2'>
          <SubmitButton onClick={() => postUser(formData, postUserData)}>登録</SubmitButton>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
