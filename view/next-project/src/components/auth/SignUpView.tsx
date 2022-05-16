import React, { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { signUp } from '@api/signUp';
import { get, post } from '@api/user';
import Email from '@components/General/Email';
import Password from '@components/General/Password';
import PasswordConfirmation from '@components/General/PasswordConfirmation';
import {
  ChakraProvider,
  Center,
  Box,
  Heading,
  Input,
  Select,
  Button,
  Flex,
  Grid,
  GridItem,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import theme from '@assets/theme';

interface PostData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface User {
  userName: string;
  bureauId: number;
  roleId: number;
}

interface Bureau {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  bureaus: Bureau[];
}

export default function SignUpView(props: Props) {
  // 局（Bureau）をフロントで定義
  const bureaus = [
    {
      id: 1,
      name: '総務局',
    },
    {
      id: 2,
      name: '渉外局',
    },
    {
      id: 3,
      name: '財務局',
    },
    {
      id: 4,
      name: '企画局',
    },
    {
      id: 5,
      name: '制作局',
    },
    {
      id: 6,
      name: '情報局',
    },
  ];

  const [postUserData, setPostUserData] = useState<User>({
    userName: '',
    bureauId: 1,
    roleId: 1,
  });

  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<PostData>({
    mode: 'all',
  });

  const userDataHandler =
    (input: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
      setPostUserData({ ...postUserData, [input]: e.target.value });
    };

  const postUser = async (data: PostData) => {
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

  return (
    <ChakraProvider theme={theme}>
      <form onSubmit={handleSubmit(postUser)} noValidate>
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
                    value={postUserData.bureauId}
                    onChange={userDataHandler('bureauId')}
                  >
                    {bureaus.map((bureau) => (
                      <option key={bureau.id} value={bureau.id}>
                        {bureau.name}
                      </option>
                    ))}
                  </Select>
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={4}>
                <Flex color='black.600' h='100%' justify='end' align='top'>
                  <Heading as='h4' size='md' my='2'>
                    メールアドレス
                  </Heading>
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={8}>
                <Flex>
                  <Email errors={errors} register={register} />
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={4}>
                <Flex color='black.600' h='100%' justify='end' align='top'>
                  <Heading as='h4' size='md' my='2'>
                    パスワード
                  </Heading>
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={8}>
                <Flex>
                  <Password errors={errors} register={register} />
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={4}>
                <Flex color='black.600' h='100%' justify='end' align='top'>
                  <Heading as='h4' size='md' my='2'>
                    パスワード確認
                  </Heading>
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={8}>
                <Flex>
                  <PasswordConfirmation
                    errors={errors}
                    register={register}
                    password={getValues('password')}
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
            <Button color='white' bgGradient='linear(to-br, primary.1, primary.2)' type='submit'>
              登録
            </Button>
          </Box>
        </Center>
      </form>
    </ChakraProvider>
  );
}
