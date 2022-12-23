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
} from '@chakra-ui/react';
import Router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { authAtom, userAtom } from '@/store/atoms';
import { get_with_token } from '@api/api_methods';
import { signIn } from '@api/signIn';
import theme from '@assets/theme';
import LoadingButton from '@components/common/LoadingButton';
import { SignIn } from '@type/common';

export default function SignInView() {
  // ログイン中フラグ
  const [isSignInNow, setIsSignInNow] = useState<boolean>(false);
  const [, setAuth] = useRecoilState(authAtom);
  const [, setUser] = useRecoilState(userAtom);

  const {
    register,
    formState: { errors },
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
      // state用のauthのデータ
      const authData = {
        isSignIn: true,
        accessToken: res.accessToken,
      };
      setAuth(authData);
      setUser(userRes);
      Router.push('/purchaseorders');
    } else {
      console.log('Error' + res.status);
      console.log(res);
      alert(
        'ログインに失敗しました。メールアドレスもしくはパスワードが間違っている可能性があります',
      );
      setIsSignInNow(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <form onSubmit={handleSubmit(SignIn)} noValidate>
        <Flex mt='10' />
        <Grid templateColumns='repeat(12, 1fr)' gap={4}>
          <GridItem colSpan={1} />
          <GridItem colSpan={10}>
            <Grid templateColumns='repeat(12, 1fr)' gap={4}>
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
            </Grid>
          </GridItem>
          <GridItem colSpan={1} />
        </Grid>
        <Flex mt='7' />
        <Center>
          <Box p='5' mb='2'>
            {isSignInNow ? (
              <LoadingButton loadingText='ログイン中' />
            ) : (
              <Button color='white' bgGradient='linear(to-br, primary.1, primary.2)' type='submit'>
                ログイン
              </Button>
            )}
          </Box>
        </Center>
      </form>
    </ChakraProvider>
  );
}
