import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
} from '@chakra-ui/react';
import Router from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { get } from '@api/api_methods';
import { signUp } from '@api/signUp';
import { post } from '@api/user';
import theme from '@assets/theme';
import LoadingButton from '@components/common/LoadingButton';
import { Bureau, SignUp, User } from '@type/common';
import { authAtom, userAtom } from 'src/store/atoms';

export default function SignUpView() {
  const [, setAuth] = useRecoilState(authAtom);
  const [, setUser] = useRecoilState(userAtom);

  // 新規登録中フラグ
  const [isSignUpNow, setIsSignUpNow] = useState<boolean>(false);

  // 局（Bureau）をフロントで定義
  const bureaus: Bureau[] = [
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
    id: 0,
    name: '',
    bureauID: 1,
    roleID: 1,
  });

  const {
    register,
    formState: { errors },
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
      console.log('Error' + res.status);
      console.log(res);
      alert(
        '新規登録に失敗しました。メールアドレスもしくはパスワードがすでに登録されている可能性があります',
      );
      setIsSignUpNow(false);
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
                  value={postUserData.name}
                  onChange={userDataHandler('name')}
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
                    value={postUserData.bureauID}
                    onChange={userDataHandler('bureauID')}
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
                  <FormControl isInvalid={errors.email ? true : false} isRequired>
                    <Input
                      minW='100'
                      borderRadius='full'
                      borderColor='primary.1'
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
                    <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                  </FormControl>
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
                  <FormControl isInvalid={errors.password ? true : false} isRequired>
                    <Input
                      minW='100'
                      borderRadius='full'
                      borderColor='primary.1'
                      type='password'
                      {...register('password', {
                        required: 'パスワードは必須です。',
                        minLength: {
                          value: 6,
                          message: 'パスワードは6文字以上で入力してください',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>
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
                  <FormControl isInvalid={errors.passwordConfirmation ? true : false} isRequired>
                    <Input
                      minW='100'
                      borderRadius='full'
                      borderColor='primary.1'
                      type='password'
                      {...register('passwordConfirmation', {
                        validate: {
                          correct: (input: string) => input === getValues('password'),
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.passwordConfirmation &&
                        errors.passwordConfirmation.type === 'correct' && (
                          <p>パスワードが一致しません</p>
                        )}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={1} />
        </Grid>
        <Flex mt='7' />
        <Center>
          <Box p='5' mb='2'>
            {isSignUpNow ? (
              <LoadingButton loadingText='登録中' />
            ) : (
              <Button color='white' bgGradient='linear(to-br, primary.1, primary.2)' type='submit'>
                登録
              </Button>
            )}
          </Box>
        </Center>
      </form>
    </ChakraProvider>
  );
}
